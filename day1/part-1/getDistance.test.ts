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


async function getDistance(filename: string): Promise<number> {
  const filePath = path.join(__dirname, filename);
  let runningTotal = 0;
  
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [num1, num2] = line.split(/\s+/).map(Number);
    runningTotal += Math.abs(num1 - num2);
  }

  return runningTotal;
}
