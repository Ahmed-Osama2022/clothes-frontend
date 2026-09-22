import { parse, compileScript } from '@vue/compiler-sfc';
import { readdirSync, readFileSync } from 'fs';

const walk = (dir, acc = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = dir + '/' + e.name;
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.vue')) acc.push(p);
  }
  return acc;
};

const files = walk('src');
let bad = 0;
for (const file of files.sort()) {
  const src = readFileSync(file, 'utf8');
  const { descriptor, errors } = parse(src, { filename: file });
  if (errors.length) { bad++; console.log('PARSE ' + file); errors.forEach(e => console.log('   ' + e.message)); continue; }
  try {
    compileScript(descriptor, { id: file });
    console.log('OK   ' + file);
  } catch (e) {
    bad++;
    console.log('SCRIPT ' + file + ' -> ' + e.message.split('\n')[0]);
  }
}
console.log('\n' + bad + ' broken / ' + files.length + ' total');
