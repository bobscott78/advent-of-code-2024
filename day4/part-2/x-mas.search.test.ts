import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

describe('x-mas search', () => {
  it('should get cross at 2, 1', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getDiagonalCross(grid, 2, 1)).toStrictEqual(['MAS', 'MAS']);
  });

  it('should get upright cross at 2, 1', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getUprightCross(grid, 6, 2)).toStrictEqual(['SAM', 'MAA']);
  });
});

function getDiagonalCross(grid: string[][], x: number, y: number): any {
  const word1 = getCoordinate(grid, y-1, x-1) + getCoordinate(grid, y, x) + getCoordinate(grid, y+1, x+1);
  const word2 = getCoordinate(grid, y+1, x-1) + getCoordinate(grid, y, x) + getCoordinate(grid, y-1, x+1);
  return [word1, word2];
}

function getUprightCross(grid: string[][], x: number, y: number): any {
  const word1 = getCoordinate(grid, y-1, x) + getCoordinate(grid, y, x) + getCoordinate(grid, y+1, x);
  const word2 = getCoordinate(grid, y, x-1) + getCoordinate(grid, y, x) + getCoordinate(grid, y, x+1);
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

