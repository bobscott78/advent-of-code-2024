import { describe, it, expect } from 'vitest';
import Grid from './grid';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

describe('doublewidth', () => {
  it('should double the width of the grid', async () => {
    const {grid, moves} = await readFromFile('./puzzle-sample.txt');
    
    expect(grid.robot[0]).toEqual(10);
    expect(grid.robot[1]).toEqual(3);
  });

  it('should move the robot', async () => {
    const {grid, moves} = await readFromFile('./puzzle-sample.txt');

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
    
    grid.print();

    expect(grid.robot[0]).toEqual(5);
    expect(grid.robot[1]).toEqual(2);
  });

  it('should run test puzzle', async () => {
    const {grid, moves} = await readFromFile('./puzzle-test.txt');

    let count = 0;
    while (count < 10) {
      console.log('count', count, moves[count]);
      grid.moveRobot(moves[count]);
      grid.print();
      count++;
    }
    
    grid.moveRobot(moves[count]);
    grid.print();
    expect(grid.robot[0]).toEqual(15);
  });

  it('should sum gps coords for larger sample', async () => {
    const {grid, moves} = await readFromFile('../part-1/puzzle-sample-larger.txt');

    for (const move of moves) {
      grid.moveRobot(move);
    }
    grid.print();
    expect(grid.sumGpsCoords()).toEqual(9021);  
  });

  it.skip('should sum gps coords for puzzle input', async () => {
    const {grid, moves} = await readFromFile('../part-1/puzzle-input.txt');

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