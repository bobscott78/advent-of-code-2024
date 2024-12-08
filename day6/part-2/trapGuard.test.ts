import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

describe('trap guard', () => {
  it('should find the exit', async () => {
    const map = new GuardMap(new Visited());
    await map.loadFrom('../part-1/puzzle-input.txt');
    map.getRoute();
    expect(map.isAtEdge(map.position)).toBe(true);
  });

  it('should trap the guard', async () => {
    const map = new GuardMap(new Visited());
    await map.loadFrom('../part-1/puzzle-sample.txt');
    map.placeObstacle([3,6]);
    const steps = map.getRoute();
    expect(steps.steps).toBe(23);
    expect(map.isAtEdge(map.position)).toBe(false);
  });

  it.skip('it should count traps places', async () => {
    const visited = new Visited();
    const map = new GuardMap(visited);
    const mapFilename = '../part-1/puzzle-input.txt';
    await map.loadFrom(mapFilename);
    const start = map.position
    map.getRoute();
    const originalRoute = visited.locations();
    
    let traps = 0;
    for (const location of originalRoute) {
      const newMap = new GuardMap(new Visited());
      await newMap.loadFrom(mapFilename);
      const candidateObstacle = location.split(',').map(Number) as [number, number];
      if ((candidateObstacle[0] !== start[0]) || (candidateObstacle[1] !== start[1])) {
        newMap.placeObstacle(candidateObstacle);
        const result = newMap.getRoute();
        if (!result.atEdge) {
          traps++;
        }
      }
    }

    expect(traps).toBe(6);
  }, { timeout: 10000 });
});

class GuardMap {
  position: [number, number] = [0, 0];
  direction: 'N' | 'S' | 'E' | 'W' = 'N';
  private map = new Array<string[]>();
  private dimensions: [number, number] = [0, 0];
  private visited;

  constructor(visited: Visited) {
    this.visited = visited;
  }

  getRoute() {
    let step = 0;
    let moved = true;
    while (moved && !this.isAtEdge(this.position)) {
      moved = this.move();
      step++;
    }
    return { steps: step, atEdge: moved };
  }
  
  placeObstacle(position: [number, number]) {
    this.map[position[1]][position[0]] = '#';
  }
  
  isAtEdge(position: [number, number]): boolean {
    return position[0] === 0 || position[0] === this.dimensions[0] - 1 || position[1] === 0 || position[1] === this.dimensions[1] - 1;
  }
  
  move() {
    let next: [number, number] = this.nextStep();
    if (this.visited.isVisited(next, this.direction)) {
      return false;
    }
    if (this.map[next[1]][next[0]] === '#') {
      this.rotate();
    } else {
      this.moveForward();
    }
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
    
    this.visited.add(this.position, this.direction);
    
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
        this.visited.add(this.position, this.direction);
      }
    }
    this.dimensions = [this.map[0].length, this.map.length];
  }
}


class Visited {
  private visited = new Map<'N' | 'S' | 'E' | 'W', Set<string>>();

  constructor() {
    this.visited.set('N', new Set<string>());
    this.visited.set('E', new Set<string>());
    this.visited.set('S', new Set<string>());
    this.visited.set('W', new Set<string>());
  }

  add(position: [number, number], direction: 'N' | 'S' | 'E' | 'W') {
    if (!this.visited.get(direction)?.has(position.toString())) {
      this.visited.get(direction)?.add(position.toString());
    }
  }

  isVisited(position: [number, number], direction: 'N' | 'S' | 'E' | 'W'): boolean {
    return this.visited.get(direction)?.has(position.toString()) ?? false;
  }

  locations() {
    const mergedVisited = new Set<string>();
    for (const directionSet of this.visited.values()) {
      for (const location of directionSet) {
        if (!mergedVisited.has(location)) {
          mergedVisited.add(location);
        }
      }
    }
    return mergedVisited;
  }
}
