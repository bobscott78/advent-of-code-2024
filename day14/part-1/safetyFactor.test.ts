import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

describe('safetyFactor', () => {
  it('should move a robot for 1 second', async () => {
    const robot = new Robot([2,4], [2,-3], [11, 7]);
    robot.move(1);
    expect(robot.position).toEqual([4, 1]);
  });

  it('should move a robot for 2 seconds', async () => {
    const robot = new Robot([2,4], [2,-3], [11, 7]);
    robot.move(2);
    expect(robot.position).toEqual([6, 5]);
  });

  it('should move a robot for 3 seconds', async () => {
    const robot = new Robot([2,4], [2,-3], [11, 7]);
    robot.move(3);
    expect(robot.position).toEqual([8, 2]);
  });

  it('should move a robot for 4 seconds', async () => {
    const robot = new Robot([2,4], [2,-3], [11, 7]);
    robot.move(4);
    expect(robot.position).toEqual([10, 6]);
  });

  it('should move a robot for 5 seconds', async () => {
    const robot = new Robot([2,4], [2,-3], [11, 7]);
    robot.move(5);
    expect(robot.position).toEqual([1, 3]);
  });

  it('should read from file', async () => {
    const bounds: [number, number] = [11, 7];
    const robots = await readFromFile('puzzle-sample.txt', bounds);
    for (const robot of robots) {
      robot.move(100);
    }
    
    const safetyFactor = robots.filter(robot => robot.position[0] < Math.floor(bounds[0] / 2) && robot.position[1] < Math.floor(bounds[1] / 2)).length * 
      robots.filter(robot => robot.position[0] > Math.floor(bounds[0] / 2) && robot.position[1] > Math.floor(bounds[1] / 2)).length *
      robots.filter(robot => robot.position[0] > Math.floor(bounds[0] / 2) && robot.position[1] < Math.floor(bounds[1] / 2)).length *
      robots.filter(robot => robot.position[0] < Math.floor(bounds[0] / 2) && robot.position[1] > Math.floor(bounds[1] / 2)).length;
      expect(safetyFactor).toEqual(12);
  });

  it.skip('should find the xmas tree when all robots are in unique positions', async () => {
    const bounds: [number, number] = [101, 103];
    const robots = await readFromFile('puzzle-input.txt', bounds);
    let count = 0;
    let allUnique = 0;

    while(count < 10000) {
      const coords = new Map<string, number>();
      for (const robot of robots) {
        robot.moveOnce();
        const key = `${robot.position[0]},${robot.position[1]}`;
        coords.set(key, (coords.get(key) || 0) + 1);        
      }
      if (Array.from(coords.values()).every(x => x === 1)) {
        console.log('unique', count);
        allUnique = count;
      }
      count++;
    }
    expect(allUnique).toEqual(1000);
  });
});

class Robot {
  position: [number, number] = [0, 0];

  constructor(private readonly start: [number, number], private readonly velocity: [number, number], private readonly bounds: [number, number]) {
    this.position = start;
  }

  move(seconds: number) {
    for (let i = 0; i < seconds; i++) {
      this.moveOnce();
    }
  }

  moveOnce() {
    this.position = [this.position[0] + this.velocity[0], this.position[1] + this.velocity[1]];
    if (this.position[1] < 0) {
      this.position[1] = this.position[1] + this.bounds[1];
    }
    if (this.position[0] < 0) {
      this.position[0] = this.position[0] + this.bounds[0];
    }
    if (this.position[1] >= this.bounds[1]) {
      this.position[1] = this.position[1] - this.bounds[1];
    }
    if (this.position[0] >= this.bounds[0]) {
      this.position[0] = this.position[0] - this.bounds[0];
    }
  }
}

async function readFromFile(filename: string, bounds: [number, number]): Promise<Robot[]>{
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })
  
  const robots = new Array<Robot>();
  for await (const line of rl) {
    const [start, velocity] = line.split(' ');
    const [x, y] = start.split('=')[1].split(',').map(x => Number(x));  
    const [vx, vy] = velocity.split('=')[1].split(',').map(x => Number(x));
    robots.push(new Robot([x, y], [vx, vy], bounds));
  }
  return robots;
}
