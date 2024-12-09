import { describe, expect, it } from "vitest";
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('antinode locations', () => {
  it('should read the map', async () => {
    const { antennae, bounds } = await loadMap('./puzzle-sample-1.txt');
    expect(bounds[0]).toBe(12);
    expect(bounds[1]).toBe(12);
    expect(antennae.size).toBe(2);
    expect(antennae.get('A')).toContainEqual([6, 5]);
    expect(antennae.get('A')).toContainEqual([8, 8]);
    expect(antennae.get('A')).toContainEqual([9, 9]);    
  });

  it('should calculate antinodes for the first pair', async () => {
    const { antennae, bounds } = await loadMap('./puzzle-sample-1.txt');
    const antinodes = calculateAntinodes(antennae, bounds);
    expect(antinodes).toContainEqual('4,2');
    expect(antinodes).toHaveLength(14);
  });
});

function calculateAntinodes(antennae: Map<string, [number, number][]>, bounds: [number,number]) {
  const result = new Set<string>();
  Array.from(antennae.keys()).forEach((antenna) => {
    const pairs = getAllPairs(antennae.get(antenna) || []);
    pairs.forEach((pair) => {
      let antinodes = calculateAntinodeForPair(pair);
      antinodes = antinodes.filter((antinode) => antinode[0] >= 0 && antinode[0] < bounds[0] && antinode[1] >= 0 && antinode[1] < bounds[1]);
      antinodes.forEach((antinode) => {
        if (!result.has(antinode.toString())) {
          result.add(antinode.toString());
        }
      });
    });
  });
  return result;
}

function calculateAntinodeForPair(pair: [number, number][]): [number, number][] {
  const diff = [pair[1][0] - pair[0][0], pair[1][1] - pair[0][1]];
  
  const antinode: [number, number][] = [
    [pair[0][0] - diff[0], pair[0][1] - diff[1]],
    [pair[1][0] + diff[0], pair[1][1] + diff[1]]
  ];
  return antinode;
}

function getAllPairs(list: [number, number][]): [number, number][][] {
  const pairs: Set<string> = new Set();
  const result: [number, number][][] = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const pair = [list[i], list[j]];
      const pairString = JSON.stringify(pair);
      if (!pairs.has(pairString)) {
        pairs.add(pairString);
        result.push(pair);
      }
    }
  }
  return result;
}

async function loadMap(filename: string) {
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let antennae = new Map<string, [number, number][]>();
  let bounds: [number, number] = [0,0];
  for await (const line of rl) {
    bounds[0] = line.length;
    bounds[1]++;
    line.split('').forEach((char, index) => {
      if (char !== '.') {
        if (antennae.has(char)) {
          antennae.get(char)?.push([index, bounds[1] - 1]);
        } else {
          antennae.set(char, [[index, bounds[1] - 1]]);
        }
      }
    });
  }
  return { antennae, bounds };
}

