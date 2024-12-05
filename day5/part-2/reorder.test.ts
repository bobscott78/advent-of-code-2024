import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

describe('reorder', () => {
  it('should be valid', async () => {
    const {rules, updates} = await parseFile('../part-1/puzzle-sample.txt');
    const reordered = reorderUpdate(rules, [75,97,47,61,53]);
    
    expect(reordered).toStrictEqual([97,75,47,61,53]);
  });

  it('another test from sample', async () => {
    const {rules, updates} = await parseFile('../part-1/puzzle-sample.txt');
    const reordered = reorderUpdate(rules, [61,13,29]);
    
    expect(reordered).toStrictEqual([61,29,13]);
  });

  it('yet another test from sample', async () => {
    const {rules, updates} = await parseFile('../part-1/puzzle-sample.txt');
    const reordered = reorderUpdate(rules, [97,13,75,29,47]);
    
    expect(reordered).toStrictEqual([97,75,47,29,13]);
  });
});

describe('read file', () => {
  it('should parse the samplefile', async () => {
    const {rules, updates} = await parseFile('../part-1/puzzle-sample.txt');
    const sum = sumOfInValidReorderedMiddles(updates, rules);
    expect(sum).toBe(123);
  });

  it.skip('should parse the full import file', async () => {
    const {rules, updates} = await parseFile('../part-1/puzzle-input.txt');
    const sum = sumOfInValidReorderedMiddles(updates, rules);
    expect(sum).toBe(0);
  });
});

function sumOfInValidReorderedMiddles(updates: number[][], rules: Map<number, number[]>) {
  return updates.filter(u => !satisfies(rules, u)).reduce((acc, u) => {
    const reordered = reorderUpdate(rules, u);
    const middleIndex = Math.floor(reordered.length / 2);
    return acc + reordered[middleIndex];
  }, 0);
}
function reorderUpdate(rules: Map<number, number[]>, update: number[]) {
  update.sort((a, b) => {
    let result = -1;
    if (ruleExists(a, b)) {
      result = -1;
    }
    if (ruleExists(b, a)) {
      result = 1;
    }
    return result;
  });
  return update;

  function ruleExists(a: number, b: number) {
    const rule = rules.get(a);
    if (rule) {
      return rule.indexOf(b) >= 0;
    }
    return false;
  }
}

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