import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeLitModePlan } from './lit-access.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const mission = JSON.parse(fs.readFileSync(path.join(root, 'content/mission.json'), 'utf8'));
const plan = describeLitModePlan(mission);
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/lit-mode-plan.json'), JSON.stringify(plan, null, 2));
console.log('Generated dist/lit-mode-plan.json');
for (const item of plan) console.log(`- ${item.layerId}: ${item.requiredAbility} on ${item.network}`);
