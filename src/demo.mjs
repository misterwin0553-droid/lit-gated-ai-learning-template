import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAccessReport } from './context-builder.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const mission = JSON.parse(fs.readFileSync(path.join(root, 'content/mission.json'), 'utf8'));
const roles = ['public_learner', 'student', 'teacher', 'owner'];
const tasks = ['public_summary', 'student_hint', 'teacher_script', 'source_review'];
const report = buildAccessReport(mission, roles, tasks);

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/access-report.json'), JSON.stringify(report, null, 2));

console.log('Lit-Gated Interactive Learning Template');
console.log(`Mission: ${mission.title}`);
for (const role of roles) {
  const unlocked = report.roles[role].filter((x) => x.status === 'unlocked').map((x) => x.layerId).join(', ');
  console.log(`- ${role}: ${unlocked}`);
}
console.log('Generated: dist/access-report.json');

if (process.argv.includes('--assert')) {
  const publicTeacherTask = report.aiTasks.public_learner.teacher_script;
  const studentHint = report.aiTasks.student.student_hint;
  const teacherSource = report.aiTasks.teacher.source_review;
  const ownerSource = report.aiTasks.owner.source_review;

  if (publicTeacherTask.permitted) throw new Error('public learner should not run teacher_script');
  if (!studentHint.permitted) throw new Error('student should run student_hint');
  if (teacherSource.permitted) throw new Error('teacher should not run source_review');
  if (!ownerSource.permitted) throw new Error('owner should run source_review');
  console.log('Assertions passed.');
}
