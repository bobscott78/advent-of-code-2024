import fs from 'fs';
import path from 'path';
import readline from 'readline';
import Grid from './grid';

async function main() {
  const {grid, moves} = await readFromFile('puzzle-sample-larger.txt');

  for (const move of moves) {
    console.clear();
    grid.moveRobot(move);
    console.log(move);
    grid.print();
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

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

main();