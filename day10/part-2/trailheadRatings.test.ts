import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('trailhead ratings', () => {
  it('should find all routes from trailhead', async () => {
    const map = new TrailMap();
    await map.loadFrom('./puzzle-sample-1.txt');
    const routes = map.routesFrom(map.trailheads[0]);
    
    expect(routes.size).toBe(1);
    expect(routes.get('2,6')).toBe(3);
  });

  it('should find all routes for a slightly larger sample', async () => {
    const map = new TrailMap();
    await map.loadFrom('./puzzle-sample-2.txt');
    const routes = map.routesFrom(map.trailheads[0]);
    
    expect(routes.size).toBe(4);
    const sum = Array.from(routes.values()).reduce((a, b) => a + b, 0);
    expect(sum).toBe(13);
  });

  it('should find all routes in larger sample', async () => {
    const map = new TrailMap();
    await map.loadFrom('./puzzle-sample-3.txt');
    
    const routes = map.routesFrom(map.trailheads[0]);
    
    expect(routes.size).toBe(2);
    const sum = Array.from(routes.values()).reduce((a, b) => a + b, 0);
    expect(sum).toBe(227);
  });

  it('should find all routes in largest sample', async () => {
    const map = new TrailMap();
    await map.loadFrom('./puzzle-sample-4.txt');
    
    let sum = 0;
    for (const trailhead of map.trailheads) {
      const routes = map.routesFrom(trailhead);
      sum += Array.from(routes.values()).reduce((a, b) => a + b, 0);
    }
    
    expect(sum).toBe(81);
  });

  it.skip('should find all route scores in full input', async () => {
    const map = new TrailMap();
    await map.loadFrom('../part-1/puzzle-input.txt');
    
    let sum = 0;
    for (const trailhead of map.trailheads) {
      const routes = map.routesFrom(trailhead);
      sum += Array.from(routes.values()).reduce((a, b) => a + b, 0);
    }
    
    expect(sum).toBe(81);
  });

});

class TrailMap {
  private locations: Array<Array<number>> = new Array<Array<number>>();
  trailheads: Array<{x: number, y: number}> = [];

  location(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.locations[0].length || y >= this.locations.length) {
      return -1;
    }
    return this.locations[y][x];
  }

  routesFrom(start: { x: number; y: number; }) : Map<string, number> {
    const altitude = this.location(start.x, start.y);

    const summits: Map<string, number> = new Map();

    this.resursiveRoutes({ x: start.x - 1, y: start.y }, altitude, summits);
    this.resursiveRoutes({ x: start.x + 1, y: start.y }, altitude, summits);
    this.resursiveRoutes({ x: start.x, y: start.y - 1 }, altitude, summits);
    this.resursiveRoutes({ x: start.x, y: start.y + 1 }, altitude, summits);

    return summits;
  }

  resursiveRoutes(start: { x: number; y: number; }, previousAltitude: number, summits: Map<string, number>) {    
    const altitude = this.location(start.x, start.y);
    
    if (altitude === previousAltitude + 1) {
      if (altitude === 9) {
        const coords = `${start.x},${start.y}`;
          const currentCount = summits.get(coords) || 0;
          summits.set(coords, currentCount + 1);
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