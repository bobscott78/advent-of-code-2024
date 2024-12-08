import { describe, expect, it } from "vitest";

describe('calibration result', () => {
  it('first sample could be true', () => {

    expect(couldBeTrue('190: 10 19')).toBe(true);
  });
});

function couldBeTrue(equation: string): boolean {
  const [left, right] = equation.split(':');
  const testValue = Number(left);
  const operands = right.split(' ').map(Number);
  return testValue === operands[0] * operands[1];
}