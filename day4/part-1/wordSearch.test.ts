import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

describe('getWordsAt', () => {
  it('should find the word west of 4,4', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getWordsAt(grid, 4, 4)).toContain('ASAM');
  });

  it('should find the word north west of 4,4', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getWordsAt(grid, 4, 4)).toContain('AMXS');
  });

  it('should find the word north east of 4,4', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    const words = getWordsAt(grid, 4, 4);
    expect(words.filter(word => word === 'ASAM')).toHaveLength(2);
  });

  it('should find the word south east of 4,4', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getWordsAt(grid, 4, 4)).toContain('AXSA');
  });

  it('should find the word south west of 4,4', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getWordsAt(grid, 4, 4)).toContain('AMSA');
  });

  it('should all words around of 9,9', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getWordsAt(grid, 9, 9).filter(word => word === 'X')).toHaveLength(5);
  });

  it('should all words around of 8,9', async () => {
    const grid = await gridFrom('./puzzle-sample.txt');
    expect(getWordsAt(grid, 8, 9)).toContain('SM');
  });
});

describe('wordSearch', () => {
  it('should find all words in the puzzle', async () => {
    const words = await wordSearch('./puzzle-sample.txt');
    expect(words.filter(word => word === 'XMAS')).toHaveLength(18);
  });

  it.skip('should find all words in the puzzle', async () => {
    const words = await wordSearch('./puzzle-input.txt');
    expect(words.filter(word => word === 'XMAS')).toHaveLength(18);
  });
});

async function wordSearch(filename: string): Promise<string[]> {
  const grid = await gridFrom(filename);
  const words = new Array<string>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'X') {
        const wordsAt = getWordsAt(grid, x, y);
        words.push(...wordsAt);
      }
    }
  }
  return words;
}

function getWordsAt(grid: string[][], x: number, y: number) {
  const words = new Array<string>();
  let word = '';
  let word2 = '';
  let word3 = '';
  let word4 = '';
  let word5 = '';
  let word6 = '';
  let word7 = '';
  let word8 = '';
  for (let i = 0; i < 4; i++) {
    word += getCoordinate(grid, y + i, x);
    word2 += getCoordinate(grid, y - i, x);
    word3 += getCoordinate(grid, y, x + i);
    word4 += getCoordinate(grid, y, x - i);
    word5 += getCoordinate(grid, y - i, x - i);
    word6 += getCoordinate(grid, y - i, x + i);
    word7 += getCoordinate(grid, y + i, x + i);
    word8 += getCoordinate(grid, y + i, x - i);
  }
  words.push(word);
  words.push(word2);
  words.push(word3);
  words.push(word4);
  words.push(word5);
  words.push(word6);
  words.push(word7);
  words.push(word8);
  return words;
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

