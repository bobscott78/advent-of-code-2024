import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('move files', () => {
  it('should load files', () => {
    const blocks = loadBlocks('2333133121414131402');
    expect(blocks.length).toBe(18);
  });

  it('should move files', () => {
    const blocks = loadBlocks('2333133121414131402');
    moveFiles(blocks);
    expect(blocks[1].files).toContainEqual({ id: 9, size: 2});
    expect(blocks[1].files).toContainEqual({ id: 2, size: 1});
    expect(blocks[2].files).toContainEqual({ id: 1, size: 3});
    expect(blocks[3].files).toContainEqual({ id: 7, size: 3});
    expect(blocks[4].files.length).toBe(0);
  });

  it('works out the checksum in a terrible way', () => {
    const blocks = loadBlocks('2333133121414131402');
    moveFiles(blocks);
    let checksum = getChecksum(blocks);
    expect(checksum).toBe(2858);
  });
});

describe('load from file', () => {
  it('should load from file', async () => {
    const blocks = await loadFrom('../part-1/puzzle-sample.txt');
    moveFiles(blocks);
    let checksum = getChecksum(blocks);
    expect(checksum).toBe(2858);
  });

  it('should load full puzzle from file', async () => {
    const blocks = await loadFrom('../part-1/puzzle-input.txt');
    moveFiles(blocks);
    let checksum = getChecksum(blocks);
    expect(checksum).toBe(2858);
  });
});

function getChecksum(blocks: Array<Block>) {
  let checksum = 0;
  let index = 0;
  for (let i = 0; i < blocks.length; i++) {
    checksum += blocks[i].checksum(index);
    index += blocks[i].size;
  }
  return checksum;
}

function moveFiles(blocks: Array<Block>) {
  let source = blocks.length - 1;
  while (source > 0) {
    while (source >= 0 && !blocks[source].hasOneFile()) {
      source--;
    }
    if (source >= 0) {
      const file = blocks[source].files[0];
    
      let destination = 0;
      while (destination < source && !blocks[destination].hasSpaceFor(file)) {
        destination++;
      }
      
      if (blocks[destination].hasSpaceFor(file)) {
        blocks[destination].addFile(file.id, file.size);
        blocks[source].files = [];
      }
    }
    source--;
  }
}

function canMove(source: string, destination: string) {
  return destination.indexOf('.'.repeat(source.length)) >= 0;
}

function loadBlocks(input: string): Array<Block> {
  const blocks = new Array<Block>();
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    const char = Number(input[i]);
    if (isFile(i)) {
      blocks.push(Block.forFile(id, char));
      id++;
    }
    else {
      if (char > 0) {
        blocks.push(new Block(char));
      }
    }
  }
  return blocks;
}

function isFile(index: number) {
  return index % 2 === 0;
}

async function loadFrom(filename: string): Promise<Array<Block>> {
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

class Block {
  files: Array<{ id: number, size: number }> = new Array<{ id: number, size: number }>();

  static forFile(id: number, size: number): Block {
    const block = new Block(size);
    block.addFile(id, size);
    return block;
  }
  
  constructor(public size: number) {}

  addFile(id: number, size: number) {
    this.files.push({ id, size });
  }

  hasOneFile() {
    return this.files.length === 1;
  }  

  hasSpaceFor(file: { id: number; size: number; }) {
    return this.size - this.files.reduce((sum, f) => sum + f.size, 0) >= file.size;
  }

  checksum(index: number) {
    let checksum = 0;
    for (let i = 0; i < this.files.length; i++) {
      for (let j = 0; j < this.files[i].size; j++) {
        checksum += this.files[i].id * index;
        index++;
      }
    }
    return checksum;
  }
}