// Minimal browser polyfills required by some Lit SDK dependencies.
if (!globalThis.global) globalThis.global = globalThis;
if (!globalThis.process) globalThis.process = { env: {} };

const app = document.getElementById('app');

const state = {
  network: 'datil-dev',
  connectTimeout: 60000,
  checkNodeAttestation: false,
  chain: 'ethereum',
  walletAddress: '',
  litNodeClient: null,
  encryptedStudentLayer: null,
  decryptedStudentLayer: null,
  litModules: null,
  providers: [],
  selectedProviderIndex: 0,
  log: []
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

function renderFatalError(error) {
  app.innerHTML = `
    <style>body{margin:0;font-family:Inter,system-ui,sans-serif;background:#fff;color:#172033}.wrap{max-width:860px;margin:40px auto;padding:24px}.box{border:1px solid #fecaca;background:#fef2f2;border-radius:22px;padding:22px}pre{white-space:pre-wrap;background:#111827;color:#e5e7eb;border-radius:14px;padding:14px}</style>
    <main class="wrap"><section class="box"><h1>Browser Lit Demo failed to initialize</h1><p>This is the captured runtime error.</p><pre>${escapeHtml(error?.stack || error?.message || String(error))}</pre></section></main>
  `;
}
window.addEventListener('error', (event) => renderFatalError(event.error || event.message));
window.addEventListener('unhandledrejection', (event) => renderFatalError(event.reason));

let mission;
let studentLayer;
let publicLayer;

async function loadMission() {
  if (mission) return mission;
  const response = await fetch('/content/mission.json');
  if (!response.ok) throw new Error(`Failed to load mission.json: ${response.status}`);
  mission = await response.json();
  studentLayer = mission.layers.find((layer) => layer.id === 'student');
  publicLayer = mission.layers.find((layer) => layer.id === 'public');
  return mission;
}

async function loadLitModules() {
  if (state.litModules) return state.litModules;
  log('Loading Lit SDK modules...');
  const [client, encryption, constants, authHelpers] = await Promise.all([
    import('@lit-protocol/lit-node-client'),
    import('@lit-protocol/encryption'),
    import('@lit-protocol/constants'),
    import('@lit-protocol/auth-helpers')
  ]);
  state.litModules = {
    LitNodeClient: client.LitNodeClient,
    checkAndSignAuthMessage: client.checkAndSignAuthMessage,
    encryptToJson: encryption.encryptToJson,
    decryptFromJson: encryption.decryptFromJson,
    LIT_ABILITY: constants.LIT_ABILITY,
    LitAccessControlConditionResource: authHelpers.LitAccessControlConditionResource
  };
  log('Lit SDK modules loaded.');
  return state.litModules;
}


const LIT_DIAGNOSTIC_URLS = {
  'datil-dev': [
    'https://15.235.83.220:7470/web/handshake',
    'https://15.235.83.220:7471/web/handshake',
    'https://15.235.83.220:7472/web/handshake',
    'https://yellowstone-rpc.litprotocol.com',
    'https://datil-dev-relayer.getlit.dev'
  ],
  'datil-test': [
    'https://51.255.59.58/web/handshake',
    'https://23.81.180.7/web/handshake',
    'https://158.69.163.138/web/handshake',
    'https://yellowstone-rpc.litprotocol.com',
    'https://datil-test-relayer.getlit.dev'
  ],
  'datil': [
    'https://207.244.90.225/web/handshake',
    'https://23.111.254.108/web/handshake',
    'https://yellowstone-rpc.litprotocol.com',
    'https://datil-relayer.getlit.dev'
  ]
};

async function runNetworkDiagnostics() {
  const urls = LIT_DIAGNOSTIC_URLS[state.network] || [];
  if (!urls.length) throw new Error(`No diagnostic URLs for ${state.network}`);
  log(`Running network diagnostics for ${state.network} (${urls.length} URLs)...`);
  for (const url of urls) {
    const startedAt = performance.now();
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
      log(`DIAG ${url} -> HTTP ${response.status} ${response.type} in ${Math.round(performance.now() - startedAt)}ms`);
    } catch (error) {
      log(`DIAG ${url} -> FAILED: ${error.message || error}`);
    }
  }
}

function accessControlConditions(address) {
  return [
    {
      contractAddress: '',
      standardContractType: '',
      chain: state.chain,
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: address
      }
    }
  ];
}

function log(message) {
  state.log.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
  render();
}


function providerName(provider, fallback = 'EIP-1193 wallet') {
  const info = provider?.info;
  if (info?.name) return info.name;
  if (provider?.isOkxWallet) return 'OKX Wallet';
  if (provider?.isRabby) return 'Rabby';
  if (provider?.isMetaMask) return 'MetaMask-compatible';
  return fallback;
}

function addProvider(provider, name) {
  if (!provider?.request) return;
  if (state.providers.some((item) => item.provider === provider)) return;
  state.providers.push({ provider, name: name || providerName(provider) });
}

function discoverWalletProviders() {
  const before = state.providers.length;
  if (window.ethereum?.providers?.length) {
    window.ethereum.providers.forEach((provider, index) => addProvider(provider, providerName(provider, `Injected wallet ${index + 1}`)));
  }
  addProvider(window.ethereum, providerName(window.ethereum, 'window.ethereum'));
  addProvider(window.okxwallet, 'OKX Wallet global');
  addProvider(window.okxwallet?.ethereum, 'OKX Wallet ethereum');
  addProvider(window.rabby, 'Rabby global');

  window.addEventListener('eip6963:announceProvider', (event) => {
    const detail = event.detail;
    addProvider(detail?.provider, detail?.info?.name || providerName(detail?.provider));
    render();
  });
  window.dispatchEvent(new Event('eip6963:requestProvider'));

  if (state.providers.length !== before) {
    log(`Discovered wallet providers: ${state.providers.map((item, index) => `${index}: ${item.name}`).join(' | ')}`);
  }
  return state.providers;
}

function getWalletProvider() {
  discoverWalletProviders();
  return state.providers[state.selectedProviderIndex]?.provider || window.ethereum;
}

function getSelectedWalletProviderDirect() {
  return state.providers[state.selectedProviderIndex]?.provider || window.ethereum || window.okxwallet?.ethereum || window.okxwallet;
}

async function checkWalletProvider() {
  const provider = getWalletProvider();
  if (!provider) {
    log('No injected wallet provider detected. Open this page in a browser with MetaMask/Rabby/OKX Wallet extension enabled.');
    return null;
  }
  log(`Using wallet provider: ${providerName(provider)} (#${state.selectedProviderIndex})`);
  try {
    const accounts = await provider.request({ method: 'eth_accounts' });
    log(`eth_accounts returned: ${accounts?.length ? accounts.join(', ') : 'none connected'}`);
    if (accounts?.[0]) {
      state.walletAddress = accounts[0];
      render();
    }
    return accounts;
  } catch (error) {
    log(`Provider check failed: ${error.message}`);
    return null;
  }
}

async function resetWalletPermission() {
  const provider = getWalletProvider();
  if (!provider) throw new Error('No injected wallet provider detected.');
  try {
    await provider.request({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] });
    state.walletAddress = '';
    log('Revoked existing eth_accounts permission. Now click Force account permission or Connect wallet again.');
    render();
  } catch (error) {
    log(`Revoke permission not supported or failed: ${error.message}`);
  }
}

async function forceWalletPermission() {
  const provider = getSelectedWalletProviderDirect();
  if (!provider) throw new Error('No injected wallet provider detected.');
  let permissionResult;
  try {
    // Keep this as the first awaited provider call after the user's click.
    permissionResult = await provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
    log(`wallet_requestPermissions completed via ${providerName(provider)}: ${JSON.stringify(permissionResult)}`);
  } catch (error) {
    if (error?.code === 4001 || /denied|rejected/i.test(error?.message || '')) {
      throw new Error('Wallet permission request was rejected/dismissed. Open the wallet extension panel and approve the connection request if it is hidden.');
    }
    log(`wallet_requestPermissions failed or unsupported: ${error.message}`);
  }
  const accounts = await provider.request({ method: 'eth_accounts' });
  log(`eth_accounts after permission request: ${accounts?.length ? accounts.join(', ') : 'none connected'}`);
  if (accounts?.[0]) {
    state.walletAddress = accounts[0];
    log(`Connected wallet ${accounts[0]}`);
    return accounts[0];
  }
  throw new Error('Wallet permission flow finished but no account was connected. Try opening the wallet extension manually and connect this site.');
}

async function ensureWallet() {
  const provider = getSelectedWalletProviderDirect();
  if (!provider) throw new Error('No injected wallet found. Install/enable MetaMask/Rabby/OKX Wallet or open this page in the browser where the wallet extension is installed.');
  let accounts;
  try {
    // Important: make eth_requestAccounts the first awaited wallet call after click.
    // Some wallets reject/dismiss if diagnostics/rendering happen before the permission prompt.
    accounts = await provider.request({ method: 'eth_requestAccounts' });
    log(`eth_requestAccounts completed via ${providerName(provider)}.`);
  } catch (error) {
    if (error?.code === 4001 || /denied|rejected/i.test(error?.message || '')) {
      throw new Error('Wallet request was rejected/dismissed or blocked by the extension. Try Force account permission, or open the wallet extension manually and approve the site connection.');
    }
    log(`eth_requestAccounts failed: ${error.message}; trying wallet_requestPermissions...`);
    return forceWalletPermission();
  }
  const address = accounts?.[0];
  if (!address) return forceWalletPermission();
  state.walletAddress = address;
  log(`Connected wallet ${address}`);
  return address;
}

async function ensureLitClient() {
  if (state.litNodeClient) return state.litNodeClient;
  const { LitNodeClient } = await loadLitModules();
  log(`Connecting Lit network ${state.network} with timeout ${state.connectTimeout}ms; checkNodeAttestation=${state.checkNodeAttestation}...`);
  const client = new LitNodeClient({
    litNetwork: state.network,
    connectTimeout: state.connectTimeout,
    checkNodeAttestation: state.checkNodeAttestation,
    debug: false
  });
  await client.connect();
  state.litNodeClient = client;
  log(`Connected Lit network: ${state.network}`);
  return client;
}

async function encryptStudentLayer() {
  await loadMission();
  const walletAddress = state.walletAddress || await ensureWallet();
  const litNodeClient = await ensureLitClient();
  const { encryptToJson } = await loadLitModules();
  const encrypted = await encryptToJson({
    string: JSON.stringify(studentLayer),
    accessControlConditions: accessControlConditions(walletAddress),
    chain: state.chain,
    litNodeClient
  });
  state.encryptedStudentLayer = JSON.parse(encrypted);
  state.decryptedStudentLayer = null;
  log('Encrypted student layer with Lit access condition :userAddress == connected wallet.');
}

async function getSessionSigsForEncryptedLayer() {
  if (!state.encryptedStudentLayer) throw new Error('Encrypt the student layer first.');
  const litNodeClient = await ensureLitClient();
  const { LIT_ABILITY, LitAccessControlConditionResource, checkAndSignAuthMessage } = await loadLitModules();
  const resource = litNodeClient.getLitResourceForEncryption
    ? await litNodeClient.getLitResourceForEncryption(state.encryptedStudentLayer)
    : new LitAccessControlConditionResource('*');

  return litNodeClient.getSessionSigs({
    chain: state.chain,
    resourceAbilityRequests: [
      {
        resource,
        ability: LIT_ABILITY.AccessControlConditionDecryption
      }
    ],
    authNeededCallback: async (params) => {
      log('Wallet signature requested for Lit session signatures.');
      return checkAndSignAuthMessage({
        chain: params.chain || state.chain,
        resources: params.resources,
        expiration: params.expiration,
        uri: params.uri,
        domain: params.domain,
        nonce: params.nonce,
        statement: params.statement
      });
    }
  });
}

async function decryptStudentLayer() {
  if (!state.encryptedStudentLayer) await encryptStudentLayer();
  const litNodeClient = await ensureLitClient();
  const { decryptFromJson } = await loadLitModules();
  const sessionSigs = await getSessionSigsForEncryptedLayer();
  const decrypted = await decryptFromJson({
    parsedJsonData: state.encryptedStudentLayer,
    sessionSigs,
    litNodeClient
  });
  state.decryptedStudentLayer = JSON.parse(decrypted);
  log('Decrypted student layer via Lit session signatures.');
}

async function run(action, label) {
  try {
    await action();
  } catch (error) {
    console.error(error);
    log(`${label} failed: ${error.message}`);
  }
}

function layerCard(layer, status) {
  const items = layer.items.map((item) => `<article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`).join('');
  return `<section class="layer ${status}"><div class="layer-head"><div><span>${escapeHtml(layer.audience)}</span><h2>${escapeHtml(layer.label)}</h2></div><b>${status.toUpperCase()}</b></div>${items}</section>`;
}

function lockedStudentCard() {
  return `<section class="layer locked"><div class="layer-head"><div><span>${escapeHtml(studentLayer?.audience || 'Authorized learner')}</span><h2>${escapeHtml(studentLayer?.label || 'Student Clue Layer')}</h2></div><b>LOCKED</b></div>${(studentLayer?.items || []).map((item) => `<article><h3>${escapeHtml(item.title)}</h3><p>[locked until Lit decrypt succeeds]</p></article>`).join('') || '<article><h3>Student clues</h3><p>[mission loading]</p></article>'}</section>`;
}

function render() {
  const encrypted = Boolean(state.encryptedStudentLayer);
  const decrypted = Boolean(state.decryptedStudentLayer);
  app.innerHTML = `
    <style>
      :root{--paper:#f7f3e7;--ink:#172033;--muted:#667085;--line:#e4dcc8;--blue:#2563eb;--orange:#d97706;--green:#16a34a;--red:#dc2626;--gray:#98a2b3;--dark:#111827}*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{max-width:1120px;margin:0 auto;padding:34px 22px 56px}.panel{background:var(--paper);border:1px solid var(--line);border-radius:28px;padding:26px;box-shadow:0 18px 50px rgba(23,32,51,.08)}.kicker{color:var(--orange);font-weight:900;letter-spacing:.12em;font-size:12px}h1{font-size:42px;line-height:1.04;margin:12px 0}p{color:var(--muted);line-height:1.6}.buttons{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}.buttons button{border:1px solid var(--line);background:white;border-radius:999px;padding:11px 15px;font-weight:900;cursor:pointer}.buttons button.primary{background:var(--dark);color:white}.status{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}.pill{background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px}.pill b{display:block;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:20px}.layer{border:1px solid var(--line);border-radius:24px;padding:20px;background:#fff}.layer.locked{background:#fbfbfa;color:#667085}.layer-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.layer-head span{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:900}.layer h2{margin:4px 0 10px;font-size:20px}.layer b{font-size:11px;font-weight:900;letter-spacing:.08em;padding:7px 9px;border-radius:999px;background:#ecfdf3;color:var(--green)}.locked b{background:#f2f4f7;color:var(--gray)}article{border-top:1px solid #eef0f2;padding-top:13px;margin-top:13px}h3{margin:0 0 6px;font-size:15px}article p{margin:0;color:var(--muted)}pre{white-space:pre-wrap;background:#101828;color:#e5e7eb;border-radius:18px;padding:16px;max-height:260px;overflow:auto;font-size:12px;line-height:1.5}.ok{color:var(--green)}.warn{color:var(--orange)}@media(max-width:850px){.grid,.status{grid-template-columns:1fr}h1{font-size:34px}}
    </style>
    <main class="wrap">
      <section class="panel">
        <div class="kicker">BROWSER LIT UNLOCK MVP</div>
        <h1>Student Layer Unlock</h1>
        <p>This page now loads without Lit SDK static imports. Lit modules are loaded only when you click encrypt/decrypt, so the first screen should never be blank.</p>
        <label style="display:block;margin-top:14px;font-weight:900">Lit network</label>
        <select id="networkSelect" style="border:1px solid var(--line);border-radius:12px;padding:10px;margin-top:6px;background:#fff">
          <option value="datil-dev" ${state.network === 'datil-dev' ? 'selected' : ''}>datil-dev (default, 7470-7472)</option>
          <option value="datil-test" ${state.network === 'datil-test' ? 'selected' : ''}>datil-test (443)</option>
          <option value="datil" ${state.network === 'datil' ? 'selected' : ''}>datil (443)</option>
        </select>
        <label style="display:block;margin-top:10px;color:var(--muted)"><input id="attestationToggle" type="checkbox" ${state.checkNodeAttestation ? 'checked' : ''} /> Check node attestation</label>
        <div class="buttons">
          <button id="discoverWallets">Discover wallets</button>
          <select id="providerSelect">${state.providers.length ? state.providers.map((item, index) => `<option value="${index}" ${index === state.selectedProviderIndex ? 'selected' : ''}>${index}: ${escapeHtml(item.name)}</option>`).join('') : '<option>No providers discovered yet</option>'}</select>
          <button id="checkWallet">0. Check wallet</button>
          <button class="primary" id="connect">1. Connect wallet</button>
          <button id="forcePermission">Force account permission</button>
          <button id="resetWallet">Reset wallet permission</button>
          <button id="networkDiag">Network diagnostics</button>
          <button id="encrypt">2. Encrypt student layer</button>
          <button id="decrypt">3. Decrypt with Lit</button>
        </div>
        <div class="status">
          <div class="pill"><b>Wallet</b>${state.walletAddress ? escapeHtml(state.walletAddress) : 'not connected'}</div>
          <div class="pill"><b>Encrypted</b><span class="${encrypted ? 'ok' : 'warn'}">${encrypted ? 'yes' : 'no'}</span></div>
          <div class="pill"><b>Student layer</b><span class="${decrypted ? 'ok' : 'warn'}">${decrypted ? 'unlocked' : 'locked'}</span></div>
        </div>
      </section>
      <section class="grid">
        ${publicLayer ? layerCard(publicLayer, 'unlocked') : '<section class="layer"><h2>Loading mission...</h2></section>'}
        ${decrypted ? layerCard(state.decryptedStudentLayer, 'unlocked') : lockedStudentCard()}
      </section>
      <section class="panel" style="margin-top:20px"><div class="kicker">EVENT LOG</div><pre>${escapeHtml(state.log.join('\n') || 'No events yet.')}</pre></section>
    </main>
  `;
  document.getElementById('networkSelect').onchange = (event) => {
    state.network = event.target.value;
    state.litNodeClient = null;
    state.encryptedStudentLayer = null;
    state.decryptedStudentLayer = null;
    log(`Selected Lit network: ${state.network}; cleared existing Lit client/encryption state.`);
    render();
  };
  document.getElementById('attestationToggle').onchange = (event) => {
    state.checkNodeAttestation = Boolean(event.target.checked);
    state.litNodeClient = null;
    state.encryptedStudentLayer = null;
    state.decryptedStudentLayer = null;
    log(`Set checkNodeAttestation=${state.checkNodeAttestation}; cleared existing Lit client/encryption state.`);
    render();
  };
  document.getElementById('discoverWallets').onclick = () => run(async () => { discoverWalletProviders(); log(`Provider count: ${state.providers.length}`); render(); }, 'Discover wallets');
  document.getElementById('providerSelect').onchange = (event) => { state.selectedProviderIndex = Number(event.target.value || 0); log(`Selected provider #${state.selectedProviderIndex}: ${state.providers[state.selectedProviderIndex]?.name || 'unknown'}`); render(); };
  document.getElementById('checkWallet').onclick = () => run(checkWalletProvider, 'Check wallet');
  document.getElementById('connect').onclick = () => run(ensureWallet, 'Connect wallet');
  document.getElementById('forcePermission').onclick = () => run(forceWalletPermission, 'Force account permission');
  document.getElementById('resetWallet').onclick = () => run(resetWalletPermission, 'Reset wallet permission');
  document.getElementById('networkDiag').onclick = () => run(runNetworkDiagnostics, 'Network diagnostics');
  document.getElementById('encrypt').onclick = () => run(encryptStudentLayer, 'Encrypt student layer');
  document.getElementById('decrypt').onclick = () => run(decryptStudentLayer, 'Decrypt student layer');
}

render();
loadMission().then(async () => { log('Mission content loaded.'); discoverWalletProviders(); await checkWalletProvider(); }).catch((error) => renderFatalError(error));
