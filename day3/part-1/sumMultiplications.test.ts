import { describe, expect, it } from "vitest";

describe('sumMultiplications', () => {
  it('extracts sungle instruction', () => {
    expect(sumMultiplications("xmul(2,4)%")).toBe(8);
  });

  it('extracts multiple instructions', () => {
    expect(sumMultiplications("xmul(2,4)%mul(3,50)%")).toBe(158);
  });

  it('sums the full sample', () => {
    expect(sumMultiplications("xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))")).toBe(161);
  });
});

function sumMultiplications(instructions: string): number {  
  const regex = /mul\((\d+),(\d+)\)/g;
  let result = 0;
  let match;

  while ((match = regex.exec(instructions)) !== null) {
    result += parseInt(match[1], 10) * parseInt(match[2], 10);
  }

  return result;
}

