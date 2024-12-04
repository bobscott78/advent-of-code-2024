import { describe, expect, it } from "vitest";

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
});

function safe(report: string) {
  const numbers = report.split(' ').map(Number);
  let index = 0;
  let safe = true;

  const increasing = numbers[0] < numbers[1];
  while (safe && index < numbers.length - 2) {
    const current = numbers[index];
    const next = numbers[index + 1];
    safe = Math.abs(current - next) <= 3;
    if (increasing) {
      safe = safe && next > current;
    } 
    index++;
  }
  return safe;
}

