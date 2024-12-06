import {describe, expect, it} from 'vitest';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

describe('guardRoute', () => {
  it('should load a map and find the guard', async () => {
    const map = new GuardMap();
    await map.loadFrom('./puzzle-sample.txt');
    expect(map.position).toStrictEqual([4,6]);
    expect(map.direction).toBe('N');
    expect(map.visited).toContainEqual([4,6]);
  });

  it('should move the guard', async () => {
    const map = new GuardMap();
    await map.loadFrom('./puzzle-sample.txt');
    map.move();
    expect(map.position).toStrictEqual([4,5]);
    expect(map.visited).toContainEqual([4,5]);
    expect(map.visited).toContainEqual([4,6]);
  });

  it('guard turns right if there is an obstacle', async () => {
    const map = new GuardMap();
    await map.loadFrom('./puzzle-sample.txt');
    for (let i = 0; i < 6; i++) {
      map.move();
    }
    expect(map.position).toStrictEqual([5,1]);
    expect(map.visited).toHaveLength(7);
  });
});

class GuardMap {
  position: [number, number] = [0, 0];
  direction: 'N' | 'S' | 'E' | 'W' = 'N';
  private map = new Array<string[]>();
  visited = new Set<[number,number]>();
  
  move() {
    const next: [number, number] = [this.position[0], this.position[1] - 1];
    if (this.map[next[1]][next[0]] === '#') {
      this.rotate();
    }

    this.moveForward();
  }

  private rotate() {
    if (this.direction === 'N') { 
      this.direction = 'E';
    }
    else if (this.direction === 'E') {
      this.direction = 'S';
    }
    else if (this.direction === 'S') {
      this.direction = 'W';
    }
    else if (this.direction === 'W') {
      this.direction = 'N';
    }
  }

  private moveForward() {
    if (this.direction === 'N') {
      this.position = [this.position[0], this.position[1] - 1];
    }
    else if (this.direction === 'E') {
      this.position = [this.position[0] + 1, this.position[1]];
    }
    this.visited.add(this.position);
  }

  async loadFrom(filename: string) {
    const filePath = path.join(__dirname, filename);

    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      this.map.push(line.split(''));
      if (line.includes('^')) {
        this.position = [line.indexOf('^'), this.map.length - 1];
        this.visited.add(this.position);
      }
    }
  }
}
