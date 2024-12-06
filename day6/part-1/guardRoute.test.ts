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
    expect(map.visited).toContainEqual("4,6");
  });

  it('should move the guard', async () => {
    const map = new GuardMap();
    await map.loadFrom('./puzzle-sample.txt');
    map.move();
    expect(map.position).toStrictEqual([4,5]);
    expect(map.visited).toContainEqual("4,5");
    expect(map.visited).toContainEqual("4,6");
  });

  it('guard turns right if there is an obstacle', async () => {
    const map = new GuardMap();
    await map.loadFrom('./puzzle-sample.txt');
    for (let i = 0; i < 10; i++) {
      map.move();
    }
    expect(map.position).toStrictEqual([8,2]);
    expect(map.visited).toHaveLength(11);
  });

  it('guard should eventually find the exit', async () => {
    const map = new GuardMap();
    await map.loadFrom('./puzzle-sample.txt');
    let step = 0;
    let moved = true;
    while (step < 100 && moved) {
      moved = map.move();
      step++;
    }
    expect(map.position[0]).toBe(7);
    expect(map.position[1]).toBe(9);
    expect(map.visited).toHaveLength(41);
  });

  it.skip('guard should eventually find the exit', async () => {
    const map = new GuardMap();
    await map.loadFrom('./puzzle-input.txt');
    let step = 0;
    let moved = true;
    while (step < 100000 && moved) {
      moved = map.move();
      step++;
    }
    expect(map.position[0]).toBe(129);
    expect(map.position[1]).toBe(109);
    expect(map.visited).toHaveLength(4647);
  });
});

class GuardMap {
  position: [number, number] = [0, 0];
  direction: 'N' | 'S' | 'E' | 'W' = 'N';
  private map = new Array<string[]>();
  visited = new Set<string>();
  
  move() {
    const next: [number, number] = this.nextStep();
    if (next[0] < 0 || next[1] < 0 || next[0] >= this.map[0].length || next[1] >= this.map.length) {
      return false;
    }
    if (this.map[next[1]][next[0]] === '#') {
      this.rotate();
    }

    this.moveForward();
    return true;
  }

  private nextStep(): [number, number] {
    switch (this.direction) {
      case 'N':
        return [this.position[0], this.position[1] - 1];
      case 'E':
        return [this.position[0] + 1, this.position[1]];
      case 'S':
        return [this.position[0], this.position[1] + 1];
      case 'W':
        return [this.position[0] - 1, this.position[1]];
    }
  }

  private rotate() {
    switch (this.direction) {
      case 'N':
        this.direction = 'E';
        break;
      case 'E':
        this.direction = 'S';
        break;
      case 'S':
        this.direction = 'W';
        break;
      case 'W':
        this.direction = 'N';
        break;
    }
  }

  private moveForward() {
    switch (this.direction) {
      case 'N':
        this.position = [this.position[0], this.position[1] - 1];
        break;
      case 'E':
        this.position = [this.position[0] + 1, this.position[1]];
        break;
      case 'S':
        this.position = [this.position[0], this.position[1] + 1];
        break;
      case 'W':
        this.position = [this.position[0] - 1, this.position[1]];
        break;
    }
    if (!this.visited.has(this.position.toString())) {
      this.visited.add(this.position.toString());
    }
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
        this.visited.add(this.position.toString());
      }
    }
  }
}
