import { describe, expect, it } from "vitest";
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('calibration result', () => {
  it('first sample could be true', () => {
    expect(couldBeTrue('190: 10 19')).toBe(190);
  });

  it('should be true for 3 operands and 2 operators', () => {
    expect(couldBeTrue('3267: 81 40 27')).toBe(3267);
  });

  it('should be false', () => {
    expect(couldBeTrue('161011: 16 10 13')).toBe(0);
  });

  it('should concatenate', () => {
    expect(couldBeTrue('156: 15 6')).toBe(156);
  });
});

describe('calibration result from file', () => {
  it('should sum valid equations in sample file', async () => {
    const result = await loadFrom('./puzzle-sample.txt');
    expect(result).toBe(11387);
  });

  it.skip('should sum for puzzle input', async () => {
    const result = await loadFrom('./puzzle-input.txt');
    expect(result).toBe(3749);
  });
});

function couldBeTrue(equation: string): number {
  const [left, right] = equation.split(':');
  const testValue = Number(left);
  const operands = right.split(' ').map(Number);
  return recursiveCouldBeTrue(testValue, operands) ? testValue : 0;
}

function recursiveCouldBeTrue(testValue: number, operands: number[]): boolean {
  if (operands.length === 1) {
    return testValue === operands[0];
  }
  var add = [operands[0] + operands[1], ...operands.slice(2)];
  var multiply = [operands[0] * operands[1], ...operands.slice(2)];
  var concatenate = [Number(`${operands[0]}${operands[1]}`), ...operands.slice(2)];
  return recursiveCouldBeTrue(testValue, add) || recursiveCouldBeTrue(testValue, multiply) || recursiveCouldBeTrue(testValue, concatenate);
}

async function loadFrom(filename: string): Promise<number> {
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let result = 0;
  for await (const line of rl) {
    result += couldBeTrue(line);
  }
  return result;
}