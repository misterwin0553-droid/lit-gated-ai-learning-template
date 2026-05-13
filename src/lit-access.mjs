import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { encryptToJson, decryptFromJson } from '@lit-protocol/encryption';
import { LIT_NETWORK, LIT_ABILITY } from '@lit-protocol/constants';
import { LitAccessControlConditionResource } from '@lit-protocol/auth-helpers';

export const DEFAULT_LIT_NETWORK = process.env.LIT_NETWORK || LIT_NETWORK.DatilDev || 'datil-dev';
export const DEFAULT_CHAIN = process.env.LIT_CHAIN || 'ethereum';

/**
 * Demo-only access condition.
 *
 * For the public grant MVP, replace this with the final tutorial condition
 * that best matches the chosen authentication story. This placeholder uses
 * a wallet-address equality check so the code path is concrete and can be
 * adapted by other developers.
 */
export function layerAccessCondition(layerId, walletAddress = process.env.LIT_DEMO_WALLET || '0x0000000000000000000000000000000000000000') {
  return [
    {
      contractAddress: '',
      standardContractType: '',
      chain: DEFAULT_CHAIN,
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: walletAddress
      }
    }
  ].map((condition) => ({ ...condition, layerId }));
}

export function createLitClient(options = {}) {
  return new LitNodeClient({
    litNetwork: options.litNetwork || DEFAULT_LIT_NETWORK,
    debug: Boolean(options.debug)
  });
}

export async function connectLitClient(options = {}) {
  const litNodeClient = options.litNodeClient || createLitClient(options);
  await litNodeClient.connect();
  return litNodeClient;
}

export async function encryptLayerWithLit(layer, options = {}) {
  if (layer.id === 'public') {
    return { layerId: layer.id, mode: 'public', plaintext: layer };
  }

  const litNodeClient = options.litNodeClient || await connectLitClient(options);
  const accessControlConditions = options.accessControlConditions || layerAccessCondition(layer.id, options.walletAddress);
  const payload = JSON.stringify({ id: layer.id, label: layer.label, audience: layer.audience, items: layer.items });

  const encryptedJson = await encryptToJson({
    string: payload,
    accessControlConditions,
    chain: options.chain || DEFAULT_CHAIN,
    litNodeClient
  });

  return {
    layerId: layer.id,
    mode: 'lit',
    encryptedJson: JSON.parse(encryptedJson),
    accessControlConditions
  };
}

export async function decryptLayerWithLit(encryptedLayer, options = {}) {
  if (encryptedLayer.mode === 'public') return encryptedLayer.plaintext;
  if (!options.sessionSigs) {
    throw new Error('Lit decrypt requires sessionSigs. Use getSessionSigsForLayer() after wallet authentication.');
  }

  const litNodeClient = options.litNodeClient || await connectLitClient(options);
  const decrypted = await decryptFromJson({
    parsedJsonData: encryptedLayer.encryptedJson,
    sessionSigs: options.sessionSigs,
    litNodeClient
  });
  return JSON.parse(decrypted);
}

export async function getLitResourceForEncryptedLayer(encryptedLayer, litNodeClient) {
  if (!litNodeClient?.getLitResourceForEncryption) {
    return new LitAccessControlConditionResource('*');
  }
  return litNodeClient.getLitResourceForEncryption(encryptedLayer.encryptedJson);
}

export async function getSessionSigsForLayer(encryptedLayer, options = {}) {
  const litNodeClient = options.litNodeClient || await connectLitClient(options);
  const resource = options.resource || await getLitResourceForEncryptedLayer(encryptedLayer, litNodeClient);
  return litNodeClient.getSessionSigs({
    chain: options.chain || DEFAULT_CHAIN,
    expiration: options.expiration,
    resourceAbilityRequests: [
      {
        resource,
        ability: LIT_ABILITY.AccessControlConditionDecryption
      }
    ],
    authNeededCallback: options.authNeededCallback
  });
}

export function describeLitModePlan(mission) {
  return mission.layers
    .filter((layer) => layer.id !== 'public')
    .map((layer) => ({
      layerId: layer.id,
      label: layer.label,
      network: DEFAULT_LIT_NETWORK,
      chain: DEFAULT_CHAIN,
      accessControlConditions: layerAccessCondition(layer.id),
      encryptionTarget: `${layer.id}.items[]`,
      requiredAbility: LIT_ABILITY.AccessControlConditionDecryption
    }));
}
