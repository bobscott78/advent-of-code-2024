import { describe, expect, it } from "vitest";

describe('problem dampener', () => {
  it('removing a duplicate make it safe', async () => {
    expect(safe([8,6,4,4,1])).toBe(true);
  });

  it('removing a duplicate does not make it safe', async () => {
    expect(safe([8,6,4,4,4,1])).toBe(false);
  });
});

function safe(report: number[], canDampen = true): boolean {
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
      report.splice(index, 1);
      return safe(report, false);
    }
    index++;
  }
  return isSafe;
}
