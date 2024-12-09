import { describe, expect, it } from 'vitest';

describe('move files', () => {
  it('should load files', () => {
    const blocks = loadBlocks('2333133121414131402');
    expect(blocks.map(v => v.toString()).join('')).toBe('00...111...2...333.44.5555.6666.777.888899');
  });

  it('should move files', () => {
    const blocks = loadBlocks('2333133121414131402');
    moveFiles(blocks);
    expect(blocks.join('')).toBe('00992111777.44.333....5555.6666.....8888..');
  });

  it('works out the checksum in a terrible way', () => {
    const blocks = loadBlocks('2333133121414131402');
    moveFiles(blocks);
    const blocksString = blocks.join('');
    let checksum = 0;
    for (let i = 0; i < blocksString.length; i++) {
      checksum += Number(blocksString[i] === '.' ? 0 : blocksString[i]) * i;
    }
    expect(checksum).toBe(2858);
  });
});

function moveFiles(blocks: string[]) {
  let source = blocks.length - 1;
  while (source > 0) {
    while (source >= 0 && blocks[source].startsWith('.')) {
      source--;
    }
    let destination = 0;
    while (destination < source && !canMove(blocks[source], blocks[destination])) {
      destination++;
    }
    
    if (canMove(blocks[source], blocks[destination])) {
      const newSource = '.'.repeat(blocks[source].length);
      blocks[destination] = blocks[destination].replace(newSource, blocks[source]);
      blocks[source] = newSource;
    }
    source--;
  }
}

function canMove(source: string, destination: string) {
  return destination.indexOf('.'.repeat(source.length)) >= 0;
}

function loadBlocks(input: string): Array<string> {
  const blocks = new Array<string>();
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    const char = Number(input[i]);
    if (isFile(i)) {
      if (char > 0) blocks.push(id.toString().repeat(char));
      id++;
    }
    else {
      if (char > 0) blocks.push('.'.repeat(char));
    }
  }
  return blocks;
}

function isFile(index: number) {
  return index % 2 === 0;
}

