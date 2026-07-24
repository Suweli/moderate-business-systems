import { readFile, writeFile } from 'node:fs/promises';

const testFilePath = new URL('./attachment-smoke-test.txt', import.meta.url);
await writeFile(testFilePath, `Attachment smoke test from MBS site\nTime: ${new Date().toISOString()}\n`);

const fileBuffer = await readFile(testFilePath);
const form = new FormData();

form.set('_subject', 'MBS Attachment Smoke Test');
form.set('_template', 'table');
form.set('submissionPage', 'Careers Application');
form.set('name', 'Smoke Test User');
form.set('email', 'moderatebiz@yahoo.com');
form.set('phone', '+2340000000000');
form.set('positionAppliedFor', 'Test Position');
form.set('submittedAt', new Date().toISOString());
form.set('userAgent', 'Node Smoke Test');
form.set('attachment', new Blob([fileBuffer], { type: 'text/plain' }), 'attachment-smoke-test.txt');

const response = await fetch('https://formsubmit.co/ajax/moderatebiz@yahoo.com', {
  method: 'POST',
  headers: { Accept: 'application/json' },
  body: form,
});

let payload;
try {
  payload = await response.json();
} catch {
  payload = { parse: 'failed' };
}

console.log(JSON.stringify({ ok: response.ok, status: response.status, payload }, null, 2));
