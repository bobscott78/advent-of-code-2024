import { describe, it, expect } from 'vitest';

describe('add function', () => {
    it('should return the sum of two numbers', () => {
        expect(add(2, 3)).toBe(5);
    });
});

function add(arg0: number, arg1: number): any {
  return arg0 + arg1;
}
