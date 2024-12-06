import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

describe('trap guard', () => {
  it('should find the exit', async () => {
    const map = new GuardMap();
    await map.loadFrom('../part-1/puzzle-sample.txt');
    map.getRoute();
    expect(map.isAtEdge(map.position)).toBe(true);
  });

  it('should trap the guard', async () => {
    const map = new GuardMap();
    await map.loadFrom('../part-1/puzzle-sample.txt');
    map.placeObstacle([3,6]);
    const steps = map.getRoute();
    expect(steps).toBe(20);
    expect(map.isAtEdge(map.position)).toBe(false);
  });

  it('it should count traps places', async () => {
    const map = new GuardMap();
    const mapFilename = '../part-1/puzzle-sample.txt';
    await map.loadFrom(mapFilename);
    map.getRoute();
    const originalRoute = map.visited;

    let traps = 0;
    for (let i = 1; i < originalRoute.length; i++) {
      const newMap = new GuardMap();
      await newMap.loadFrom(mapFilename);
      const candidateObstacle = originalRoute[i].split(':')[0].split(',').map(Number) as [number, number];
      newMap.placeObstacle(candidateObstacle);
      newMap.getRoute();
      if (!newMap.isAtEdge(newMap.position)) {
        traps++;
      }
    }
    
    expect(traps).toBe(6);
  });
});

class GuardMap {
  position: [number, number] = [0, 0];
  direction: 'N' | 'S' | 'E' | 'W' = 'N';
  private map = new Array<string[]>();
  visited = new Array<string>();
  
  getRoute() {
    let step = 0;
    let moved = true;
    while (step < 100000 && moved) {
      moved = this.move();
      step++;
    }
    return step;
  }
  
  placeObstacle(position: [number, number]) {
    this.map[position[1]][position[0]] = '#';
  }
  
  isAtEdge(position: [number, number]): boolean {
    return position[0] === 0 || position[0] === this.map[0].length - 1 || position[1] === 0 || position[1] === this.map.length - 1;
  }
  
  move() {
    const next: [number, number] = this.nextStep();
    if (next[0] < 0 || next[1] < 0 || next[0] >= this.map[0].length || next[1] >= this.map.length) {
      return false;
    }
    if (this.visited.find(v => v === `${next.toString()}:${this.direction}`)) {
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
    if (!this.visited.find(v => v.startsWith(this.position.toString()))) {
      this.visited.push(`${this.position.toString()}:${this.direction}`);
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
        this.visited.push(`${this.position.toString()}:${this.direction}`);
      }
    }
  }
}
