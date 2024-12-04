import { describe, expect, it } from "vitest";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

describe('similarity score', () => {
  it('should return score for 2 lines', async () => {
    expect(await similarityScore("./puzzle-input-2-lines.txt")).toBe(6);
  });

  it('should return score for sample lists', async () => {
    expect(await similarityScore("./puzzle-input-sample.txt")).toBe(31);
  });

  it.skip('should return score for puzzle input', async () => {
    expect(await similarityScore("../part-1/puzzle-input.txt")).toBe(0);
  });
});

async function similarityScore(filename: string): Promise<number> {
  const filePath = path.join(__dirname, filename);
  const first: number[] = [];
  const second: Map<number, number> = new Map();

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [num1, num2] = line.split(/\s+/).map(Number);
    first.push(num1);
    second.set(num2, (second.get(num2) || 0) + 1);
  }

  return first.reduce((acc, num) => acc + (second.get(num) || 0) * num, 0);
}
