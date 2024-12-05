import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

describe('get crosses', () => {
  it('should get cross at 2, 1', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getDiagonalCross(grid, 2, 1)).toStrictEqual(['MAS', 'MAS']);
  });
});

describe('x-mas search', () => {
  it('should get count x-mas', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    let count = xmasCount(grid);
    expect(count).toBe(9);
  });

  it.skip('should get count x-mas for puzzle', async () => {
    const grid = await gridFrom('../part-1/puzzle-input.txt');
    let count = xmasCount(grid);
    expect(count).toBe(0);
  });
});

function xmasCount(grid: string[][]) {
  let count = 0;
  const words = ['MAS', 'SAM'];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cross = getDiagonalCross(grid, x, y);
      if (words.indexOf(cross[0]) !== -1 && words.indexOf(cross[1]) !== -1) {
        count++;
      }
    }
  }
  return count;
}

function getDiagonalCross(grid: string[][], x: number, y: number): any {
  const word1 = getCoordinate(grid, y-1, x-1) + getCoordinate(grid, y, x) + getCoordinate(grid, y+1, x+1);
  const word2 = getCoordinate(grid, y+1, x-1) + getCoordinate(grid, y, x) + getCoordinate(grid, y-1, x+1);
  return [word1, word2];
}

function getCoordinate(grid: string[][], y: number, x: number) {
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[y].length) {
    return '';
  }
  return grid[y][x];
}

async function gridFrom(filename: string) {
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const lines = new Array<Array<string>>();
  for await (const line of rl) {
    const characters = line.split('');
    lines.push(characters);
  }
  return lines;
}

