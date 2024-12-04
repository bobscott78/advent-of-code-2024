import { describe, expect, it } from "vitest";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';


describe('safe', () => {
  it('big increases are unsafe', () => {
    const report = "1 2 6 8 9";
    const isSafe = safe(report);
    expect(isSafe).toBe(false);
  });

  it('big decreases are unsafe', () => {
    const report = "9 8 6 2 1";
    const isSafe = safe(report);
    expect(isSafe).toBe(false);
  });
});

function safe(report: string) {
  const numbers = report.split(' ').map(Number);
  let index = 0;
  let safe = true;

  while (safe && index < numbers.length - 2) {
    const current = numbers[index];
    const next = numbers[index + 1];
    safe = Math.abs(current - next) <= 3;
    index++;
  }
  return safe;
}

