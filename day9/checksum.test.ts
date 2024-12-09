import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('checksum', () => {
  it('should calculate checksum for sample', () => {
    const blocks = loadBlocks('2333133121414131402');
    expect(blocks.map(v => v === -1 ? '.' : v.toString()).join('')).toBe('00...111...2...333.44.5555.6666.777.888899');
  });

  it('should move all blocks to first free posiiton', () => {
    const blocks = loadBlocks('2333133121414131402');
    moveLast(blocks);
    expect(blocks.map(v => v === -1 ? '.' : v.toString()).join('')).toBe('0099811188827773336446555566..............');
  });

  it('should calculate checksum for sample', () => {
    const blocks = loadBlocks('2333133121414131402');
    expect(calculateChecksum(blocks)).toBe(1928);
  });
});

describe('load from file', () => {
  it('should calculate checksum for puzzle', async () => {
    const blocks = await loadFrom('./puzzle-sample.txt');
    expect(calculateChecksum(blocks)).toBe(1928);
  });

  it.skip('should calculate checksum for full puzzle', async () => {
    const blocks = await loadFrom('./puzzle-input.txt');
    expect(calculateChecksum(blocks)).toBe(0);
  });
});

function calculateChecksum(blocks: Array<number>): number {
  moveLast(blocks);
  let index = 0;
  return blocks.reduce((acc, v) => v === -1 ? acc : acc + (v * index++), 0);
}

function moveLast(blocks: Array<number>) {
  moveLastRecursive(blocks, 0, blocks.length - 1);
}

function moveLastRecursive(blocks: Array<number>, start: number, end: number) {
  let last = end;
  let free = start;
  while (free < last){
    while (free < last && blocks[free] !== -1) {
      free++;
    }
    if (free === last) {
      return;
    }
    blocks[free] = blocks[last];
    blocks[last--] = -1;
  }
}

function loadBlocks(input: string): Array<number> {
  const blocks = new Array<number>();
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    const char = Number(input[i]);
    if (isFile(i)) {
      for (let j = 0; j < char; j++) {
        blocks.push(id);
      }
      id++;
    }
    else {
      for (let j = 0; j < char; j++) {
        blocks.push(-1);
      };
    }
  }
  return blocks;
}

function isFile(index: number) {
  return index % 2 === 0;
}

async function loadFrom(filename: string): Promise<Array<number>> {
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })
  ;
  for await (const line of rl) {
    return loadBlocks(line);
  }
  return [];
}