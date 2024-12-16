import fs from 'fs';
import path from 'path';
import readline from 'readline';


async function main() {
  const robots = await readFromFile('../part-1/puzzle-input.txt', [101, 103]);
    console.clear();
    console.log('--------------------------------');
    for (const robot of robots) {
      robot.move(6620);
    }
    for (let y = 0; y < 103; y++) {
      if (y === 51) {
        console.log('');
      } else {
        const row = robots.filter(robot => robot.position[1] === y).sort((a, b) => a.position[0] - b.position[0]);
        for (let x = 0; x < 101; x++) {
          if (x === 50) {
            process.stdout.write(' ');
          } else if (row.find(robot => robot.position[0] === x)) {
            process.stdout.write('#');
          } else {
            process.stdout.write('.');
          }
        }
        process.stdout.write('\n');
      }
    }
}

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

main();