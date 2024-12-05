import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

describe('correct order', () => {
  it('first update is valid', async () => {
    const {rules, updates} = await parseFile('./puzzle-sample.txt');
    expect(satisfies(rules, [75,47,61,53,29])).toBe(true);
  });

  it('fourth update is invalid', async () => {
    const {rules, updates} = await parseFile('./puzzle-sample.txt');
    expect(satisfies(rules, [75,97,47,61,53])).toBe(false);
  });
});

async function parseFile(filename: string) {
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const rules = new Map<number, number[]>();
  const updates = new Array<number[]>();
  for await (const line of rl) {
    if (line.includes('|')) {
      const characters = line.split('|').map(Number);
      if (rules.has(characters[0])) {
        rules.get(characters[0])?.push(characters[1]);
      } else {
        rules.set(characters[0], [characters[1]]);
      }
    }
    else if (line.includes(',')) {
      const numbers = line.split(',').map(Number);
      updates.push(numbers);
    }
  }
  return { rules, updates };
}

function satisfies(rules: Map<number, number[]>, update: number[]) {
  let i = 0;
  let valid = true;
  const previous = new Array<number>();
  while (i < update.length && valid) {
    const current = update[i];
    const rule = rules.get(current);
    if (rule) {
      valid = rule.every(r => !previous.includes(r));
    }
    previous.push(current);
    i++;
  }
  return valid;
}
