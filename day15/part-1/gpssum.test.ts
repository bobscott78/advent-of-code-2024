import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import Grid from './grid';

describe('gpssum', () => {
  it('should initialise the grid and moves', async () => {
    const {grid, moves} = await readFromFile('puzzle-sample.txt');
    expect(grid.robot).toEqual([2, 2]);
    expect(moves).toHaveLength(15);
  });

  it('should move the robot up', async () => {
    const {grid, moves} = await readFromFile('puzzle-sample.txt');
    grid.moveRobot(moves[0]);
    grid.moveRobot(moves[1]);
    grid.moveRobot(moves[2]);
    grid.moveRobot(moves[3]);
    grid.moveRobot(moves[4]);
    grid.moveRobot(moves[5]);
    grid.moveRobot(moves[6]);
    grid.moveRobot(moves[7]);
    grid.moveRobot(moves[8]);
    grid.moveRobot(moves[9]);
    grid.moveRobot(moves[10]);
    grid.moveRobot(moves[11]);
    grid.moveRobot(moves[12]);
    grid.moveRobot(moves[13]);

    expect(grid.robot).toEqual([4, 4]);
  });

  it('should sum gps coords for sample', async () => {
    const {grid, moves} = await readFromFile('puzzle-sample.txt');

    for (const move of moves) {
      grid.moveRobot(move);
    }
    expect(grid.sumGpsCoords()).toEqual(2028);  
  });

  it('should sum gps coords for larger sample', async () => {
    const {grid, moves} = await readFromFile('puzzle-sample-larger.txt');

    for (const move of moves) {
      grid.moveRobot(move);
    }
    expect(grid.sumGpsCoords()).toEqual(10092);  
  });

  it('should sum gps coords for puzzle input', async () => {
    const {grid, moves} = await readFromFile('puzzle-input.txt');

    for (const move of moves) {
      grid.moveRobot(move);
    }
    expect(grid.sumGpsCoords()).toEqual(0);  
  });
});


async function readFromFile(filename: string): Promise<{grid: Grid, moves: string[]}>{
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })
  
  const grid = new Grid();
  let moves: string[] = [];
  for await (const line of rl) {
    if (line.startsWith('#')) {
      grid.addLine(line);      
    } else if (line !== '') {
      moves.push(...line.split(''));
    }
  }
  return {grid, moves};
}