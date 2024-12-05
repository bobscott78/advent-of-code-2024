import { describe, expect, it } from "vitest";

describe('sumMultiplications', () => {
  it('extracts sungle instruction', () => {
    expect(sumMultiplications("xmul(2,4)%")).toBe(8);
  });
});

function sumMultiplications(instructions: string): number {
  const regex = /mul\((\d+),(\d+)\)/;
  const match = instructions.match(regex);
  
  if (match) {
      return parseInt(match[1], 10) * parseInt(match[2], 10);
  }
  return 0
}

