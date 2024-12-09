import { describe, it, expect } from 'vitest';

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
    expect(calculateChecksum('2333133121414131402')).toBe(1928);
  });
});

function calculateChecksum(input: string): number {
  const blocks = loadBlocks(input);
  moveLast(blocks);
  let index = 0;
  return blocks.reduce((acc, v) => v === -1 ? acc : acc + (v * index++), 0);
}

function moveLast(blocks: Array<number>) {
  moveLastRecursive(blocks, 0, blocks.length - 1);
}

function moveLastRecursive(blocks: Array<number>, start: number, end: number) {
  const last = end;
  let free = start;
  while (free < last && blocks[free] !== -1) {
    free++;
  }
  if (free === last) {
    return;
  }
  blocks[free] = blocks[last];
  blocks[last] = -1;
  moveLastRecursive(blocks, start, last - 1);
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

