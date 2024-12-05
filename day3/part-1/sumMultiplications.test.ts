import { describe, expect, it } from "vitest";
import * as fs from 'fs';
import * as path from 'path';

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

  it('has instruction to switch off multiplication', () => {
    expect(sumMultiplications("don't()mul(2,4)%")).toBe(0);
  });

  it('has instruction to switch multiplication back on', () => {
    expect(sumMultiplications("don't()mul(2,4)%do()jhkjhmul(100,2)")).toBe(200);
  });

  it('sums full sample with switches', () => {
    expect(sumMultiplications("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))")).toBe(48);
  });
});

describe('sumMultiplications from file', () => {
  it.skip('extracts sungle instruction', () => {
    expect(sumMultiplicationsFromFile("./puzzle-input.txt")).toBe(0);
  });
});

function sumMultiplicationsFromFile(filename: string): number {
  const filePath = path.join(__dirname, filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return sumMultiplications(fileContent);
}

function sumMultiplications(instructions: string): number {  
  const regex = /mul\((\d+),(\d+)\)|don't\(\)|do\(\)/g;
  let result = 0;
  let on = true;
  let match;
  while ((match = regex.exec(instructions)) !== null) {
    if (match[0] === "don't()") {
      on = false;
    } else if (match[0] === "do()") {
      on = true;
    } else if (on) {
      result += parseInt(match[1], 10) * parseInt(match[2], 10);
    }
  }

  return result;
}

