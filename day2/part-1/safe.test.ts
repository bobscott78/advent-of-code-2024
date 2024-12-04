import { describe, expect, it } from "vitest";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

describe('safe', () => {
  it('is unsafe for big increases', () => {
    const report = "1 2 6 8 9";
    const isSafe = safe(report);
    expect(isSafe).toBe(false);
  });

  it('is unsafe for big decreases', () => {
    const report = "9 8 6 2 1";
    const isSafe = safe(report);
    expect(isSafe).toBe(false);
  });

  it('is unsafe if increases then decreases', () => {
    const report = "1 3 2 4 5";
    const isSafe = safe(report);
    expect(isSafe).toBe(false);
  });

  it('is unsafe if decreases then increases', () => {
    const report = "5 4 2 3 1";
    const isSafe = safe(report);
    expect(isSafe).toBe(false);
  });

  it('is unsafe if 2 consecutive', () => {
    const report = "1 2 4 4 5";
    const isSafe = safe(report);
    expect(isSafe).toBe(false);
  });

  it('is unsafe if 2 consecutive at end', () => {
    const report = "6 5 4 2 2";
    const isSafe = safe(report);
    expect(isSafe).toBe(false);
  });
});

describe('safe from file', () => {
  it('counts safe reports', async () => {
    expect(await safeFromFile('./puzzle-input-sample.txt')).toBe(2);
  });

  it.skip('counts safe reports from puzzle input', async () => {
    expect(await safeFromFile('./puzzle-input.txt')).toBe(0);
  });
});


function safe(report: string) {
  const numbers = report.split(' ').map(Number);
  let index = 0;
  let safe = true;

  const increasing = numbers[0] < numbers[1];
  while (safe && index < numbers.length - 1) {
    const current = numbers[index];
    const next = numbers[index + 1];
    safe = Math.abs(current - next) <= 3;
    if (increasing) {
      safe = safe && next > current;
    }
    else {
      safe = safe && next < current;
    }
    index++;
  }
  return safe;
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
    if (safe(line)) {
      count++;
    }
  }
  return count;
}

