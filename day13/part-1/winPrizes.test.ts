import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('winPrizes', () => {
  it('should read equations from file', async () => {
    const equations = await readFromFile('puzzle-sample.txt');
    expect(equations[0].a).toEqual(94);
  });

  it('should solve equations', async () => {
    const equations = await readFromFile('puzzle-sample.txt');
    const e = equations[0];

    const solution = solveEquations([[e.a, e.d], [e.b, e.e]], [e.c, e.f]);
    let tokens = 0;
    if (solution && isInteger(solution[0]) && isInteger(solution[1])) {
      tokens = Math.round(solution[0]) * 3 + Math.round(solution[1]);
    }
    
    expect(solution).toBeDefined();
    expect(Math.round(solution[0])).toEqual(80);
    expect(Math.round(solution[1])).toEqual(40);
    expect(tokens).toEqual(280);
  });

  it('should sum the tokens', async () => {
    const equations = await readFromFile('puzzle-sample.txt');
    const tokens = sumTokens(equations);
    expect(tokens).toEqual(480);
  });

  it.skip('should solve the puzzle', async () => {
    const equations = await readFromFile('puzzle-input.txt');
    const tokens = sumTokens(equations);
    expect(tokens).toEqual(1000000);
  });
});

function sumTokens(equations: ButtonEquation[]): number {
  return equations.reduce((sum, e) => {
    const solution = solveEquations([[e.a, e.d], [e.b, e.e]], [e.c, e.f]);
    let tokens = 0;
    if (solution && isInteger(solution[0]) && isInteger(solution[1])) {
      tokens = Math.round(solution[0]) * 3 + Math.round(solution[1]);
    }
    return sum + tokens;
  }, 0);
} 

function isInteger(value: number): boolean {
  return Math.abs(Math.round(value) - value) < 0.0001;
}

type Matrix2x2 = [[number, number], [number, number]];
type Vector2x1 = [number, number];

function determinant(matrix: Matrix2x2): number {
    const [[a, b], [c, d]] = matrix;
    return a * d - b * c;
}

function inverse(matrix: Matrix2x2): Matrix2x2 | null {
    const det = determinant(matrix);
    if (det === 0) return null;

    const [[a, b], [c, d]] = matrix;

    return [
        [d / det, -b / det],
        [-c / det, a / det],
    ];
}

function multiplyMatrixVector(matrix: Matrix2x2, vector: Vector2x1): Vector2x1 {
    const [[a, b], [c, d]] = matrix;
    const [x, y] = vector;

    return [
        a * x + b * y,
        c * x + d * y,
    ];
}

function solveEquations(coefficients: Matrix2x2, constants: Vector2x1): Vector2x1 | null {
    const inv = inverse(coefficients);
    if (!inv) return null;

    return multiplyMatrixVector(inv, constants);
}

async function readFromFile(filename: string): Promise<ButtonEquation[]>{
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })
  
  const equations = new Array<ButtonEquation>();
  let rows = 0;
  let equation: ButtonEquation = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
  for await (const line of rl) {
    if (line.startsWith('Button A')) {
      const rhs = line.split(': ')[1];
      const [a, b] = rhs.split(',').map(x => x.split('+')[1]);
      equation.a = Number(a);
      equation.b = Number(b);
    }
    if (line.startsWith('Button B')) {
      const rhs = line.split(': ')[1];
      const [d, e] = rhs.split(',').map(x => x.split('+')[1]);
      equation.d = Number(d);
      equation.e = Number(e);
    }
    if (line.startsWith('Prize')) {
      const rhs = line.split(': ')[1];
      const [x, y] = rhs.split(',').map(x => x.split('=')[1]);
      equation.c = Number(x);
      equation.f = Number(y);
      equations.push(equation);
      equation = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
    }
  }
  return equations;
}

interface ButtonEquation {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}
 