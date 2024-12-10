import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('trailhead scores', () => {
  it('should load map from file', async () => {
    const map = new Map();
    await map.loadFrom('./puzzle-sample-1.txt');
    expect(map.location(0,0)).toBe(0);
    expect(map.location(0,3)).toBe(9);
  });

  it('should find all trailheads', async () => {
    const map = new Map();
    await map.loadFrom('./puzzle-sample-larger.txt');
    expect(map.trailheads.length).toBe(9);
  });

  it('should find all routes from trailhead', async () => {
    const map = new Map();
    await map.loadFrom('./puzzle-sample-2.txt');
    const routes = map.routesFrom(map.trailheads[0]);
    expect(routes.size).toBe(2);
    expect(routes.has('0,6')).toBe(true);
    expect(routes.has('6,6')).toBe(true);
  });

  it('should find all routes in larger sample', async () => {
    const map = new Map();
    await map.loadFrom('./puzzle-sample-larger.txt');
    let routeCount = 0;
    for (const trailhead of map.trailheads) {
      routeCount += map.routesFrom(trailhead).size;
    }
    expect(routeCount).toBe(36);
  });
});

class Map {
  private locations: Array<Array<number>> = new Array<Array<number>>();
  trailheads: Array<{x: number, y: number}> = [];

  location(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.locations[0].length || y >= this.locations.length) {
      return -1;
    }
    return this.locations[y][x];
  }

  routesFrom(start: { x: number; y: number; }) {
    const altitude = this.location(start.x, start.y);

    const summits: Set<string> = new Set();

    this.resursiveRoutes({ x: start.x - 1, y: start.y }, altitude, summits);
    this.resursiveRoutes({ x: start.x + 1, y: start.y }, altitude, summits);
    this.resursiveRoutes({ x: start.x, y: start.y - 1 }, altitude, summits);
    this.resursiveRoutes({ x: start.x, y: start.y + 1 }, altitude, summits);

    return summits;
  }

  resursiveRoutes(start: { x: number; y: number; }, previousAltitude: number, summits: Set<string>) {    
    const altitude = this.location(start.x, start.y);
    
    if (altitude === previousAltitude + 1) {
      if (altitude === 9) {
        if (!summits.has(`${start.x},${start.y}`)) {
          summits.add(`${start.x},${start.y}`);
        }
      } else {
        this.resursiveRoutes({ x: start.x - 1, y: start.y }, altitude, summits);
        this.resursiveRoutes({ x: start.x + 1, y: start.y }, altitude, summits);
        this.resursiveRoutes({ x: start.x, y: start.y - 1 }, altitude, summits);
        this.resursiveRoutes({ x: start.x, y: start.y + 1 }, altitude, summits);
      }
    }
  }

  async loadFrom(filename: string) {
    const filePath = path.join(__dirname, filename);

    const fileStream = fs.createReadStream(filePath);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })
    
    for await (const line of rl) {
      const altitudes = line.split('').map(x => x === '.' ? -1 : x).map(Number);
      altitudes.forEach((altitude, index) => {
        if (altitude === 0) {
          this.trailheads.push({ x: index, y: this.locations.length });
        }
      });
      this.locations.push(altitudes);
    }
  }
}