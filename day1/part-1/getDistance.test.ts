import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('first file with one line', () => {
    it('should return difference between the numbers', () => {
        expect(getDistance("./puzzle-input-1-line.txt")).toBe(1);
    });
});

function getDistance(filename: string): number {
  const filePath = path.join(__dirname, filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const [num1, num2] = fileContent.split(/\s+/).map(Number);

  return Math.abs(num1 - num2);
}
