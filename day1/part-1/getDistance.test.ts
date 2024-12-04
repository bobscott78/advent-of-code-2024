import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

describe('first file with one line', () => {
  it('should return difference between the numbers', async () => {
    expect(await getDistance("./puzzle-input-1-line.txt")).toBe(1);
  });
});

describe('two nicely sorted lines', () => {
  it('should return difference between the numbers', async () => {
    expect(await getDistance("./puzzle-input-2-sorted-lines.txt")).toBe(3);
  });
});

describe('unsorted lines', () => {
  it('should return difference between the numbers', async () => {
    expect(await getDistance("./puzzle-input-3-unsorted-lines.txt")).toBe(11);
  });
});

describe('real puzzle input', () => {
  it.skip('should return difference between the numbers', async () => {
    expect(await getDistance("./puzzle-input.txt")).toBe(1722302);
  });
});

async function getDistance(filename: string): Promise<number> {
  const filePath = path.join(__dirname, filename);
  const first: number[] = [];
  const second: number[] = [];

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [num1, num2] = line.split(/\s+/).map(Number);
    first.push(num1);
    second.push(num2);
  }

  first.sort((a, b) => a - b);
  second.sort((a, b) => a - b);
  
  let runningTotal = 0;
  for (let i = 0; i < first.length; i++) {
    runningTotal += Math.abs(first[i] - second[i]);
  }
  return runningTotal;
}
