import { describe, expect, it } from "vitest";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

describe('problem dampener', () => {
  it('removing a duplicate make it safe', async () => {
    expect(safe([8,6,4,4,1])).toBe(true);
  });

  it('removing a duplicate does not make it safe', async () => {
    expect(safe([8,6,4,4,4,1])).toBe(false);
  });

  it('removing a level puts the report in order', async () => {
    expect(safe([1,3,2,4,5])).toBe(true);
  });

  it('removing an already invalid level puts the report in order', async () => {
    expect(safe([1,7,2,4,5])).toBe(true);
  });

  it('removing first level fixes it', async () => {
    expect(safe([2,1,2,3,4])).toBe(true);
  });
});

describe('safe from file', () => {
  it('counts safe reports', async () => {
    expect(await safeFromFile('./puzzle-input-sample.txt')).toBe(4);
  });

  it.skip('counts safe reports from puzzle input', async () => {
    expect(await safeFromFile('../part-1/puzzle-input.txt')).toBe(0);
  });
});

function safe(report: Array<number>, canDampen = true): boolean {
  console.log(report);
  let index = 0;
  let isSafe = true;

  const increasing = report[0] < report[1];
  while (isSafe && index < report.length - 1) {
    const current = report[index];
    const next = report[index + 1];
    isSafe = Math.abs(current - next) <= 3;
    if (increasing) {
      isSafe = isSafe && next > current;
    }
    else {
      isSafe = isSafe && next < current;
    }
    if (!isSafe && canDampen) {
      return (index > 0 && safeWithLevelRemovedAt(report, index-1)) ||
        safeWithLevelRemovedAt(report, index) || 
        safeWithLevelRemovedAt(report, index + 1);
    }
    index++;
  }
  return isSafe;
}

function safeWithLevelRemovedAt(report: Array<number>, index: number): boolean {
  const report1 = [...report];
  report1.splice(index, 1);
  return safe(report1, false);
}

async function safeFromFile(filename: string): Promise<number> {
  const filePath = path.join(__dirname, filename);
  
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let count = 0;
  for await (const line of rl) {
    if (safe(line.split(' ').map(Number), true)) {
      count++;
    }
  }
  return count;
}
