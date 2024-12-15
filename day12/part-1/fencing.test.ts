import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('fencing', () => {
  it('should count plot neighbours', async () => {
    const regions = await readFormFile('puzzle-sample.txt');
    expect(getNeighbours(regions.get('A') ?? [], [0, 0])).toEqual(1);
    expect(getNeighbours(regions.get('A') ?? [], [1, 0])).toEqual(2);
    expect(getNeighbours(regions.get('A') ?? [], [2, 0])).toEqual(2);
    expect(getNeighbours(regions.get('A') ?? [], [3, 0])).toEqual(1);
    expect(getNeighbours(regions.get('D') ?? [], [3, 1])).toEqual(0);
    expect(getNeighbours(regions.get('C') ?? [], [2, 2])).toEqual(2);
  });

  it('should get perimeter of region', async () => {
    const regions = await readFormFile('puzzle-sample.txt');
    expect(getPerimeter(regions.get('A') ?? [])).toEqual(10);
    expect(getPerimeter(regions.get('B') ?? [])).toEqual(8);
    expect(getPerimeter(regions.get('C') ?? [])).toEqual(10);
    expect(getPerimeter(regions.get('D') ?? [])).toEqual(4);
    expect(getPerimeter(regions.get('E') ?? [])).toEqual(8);
  });

  it('should work out perimeter when region contains other regions', async () => {
    const regions = await readFormFile('puzzle-sample-2.txt');
    expect(getPerimeter(regions.get('O') ?? [])).toEqual(36);
    expect(getPerimeter(regions.get('X') ?? [])).toEqual(16);
  });

  it('should split a fragmented region', async () => {
    const regions = await readFormFile('puzzle-sample-2.txt');
    const xRegions = regions.get('X') ?? [];
    splitRegion(xRegions);
    const oRegions = regions.get('O') ?? [];
    splitRegion(oRegions);
    expect(xRegions.filter(p => p.region === 0).length).toEqual(1);
    expect(xRegions.filter(p => p.region === 1).length).toEqual(1);
    expect(xRegions.filter(p => p.region === 2).length).toEqual(1);
    expect(xRegions.filter(p => p.region === 3).length).toEqual(1);
    expect(oRegions.filter(p => p.region === 0).length).toEqual(21);
    expect(oRegions.filter(p => p.region === 1).length).toEqual(0);
  });

  it('should split larger sample', async () => {
    const regions = await readFormFile('puzzle-sample-larger.txt');
    const rRegions = regions.get('R') ?? [];
    splitRegion(rRegions);
    expect(rRegions.filter(p => p.region === 0).length).toEqual(12);
  });

  it('should get total price of larger sample', async () => {
    const regions = await readFormFile('puzzle-sample-larger.txt');
    const total = getTotalPrice(regions);
    expect(total).toEqual(1930);
  });

  it.skip('should get total price of puzzle input', async () => {
    const regions = await readFormFile('puzzle-input.txt');
    const total = getTotalPrice(regions);
    expect(total).toEqual(0);
  });
});

function getTotalPrice(regions: Map<string, Plot[]>): number {
  let price = 0;
  for (const region of regions.keys()) {
    const regionPlots = regions.get(region) ?? [];
    const regionIndex = splitRegion(regionPlots);
    for(let i = 0; i < regionIndex; i++) {
      const plots = regionPlots.filter(p => p.region === i);
      price += getPerimeter(plots) * plots.length;
    }
  }
  return price;
}

function splitRegion(regions: Plot[]): number {
  let regionIndex = 0;
  let nextPlot = regions.find(plot => plot.region === -1);
  while (nextPlot) {
    markRegion(regions, nextPlot.coords, regionIndex);
    regionIndex++;
    nextPlot = regions.find(plot => plot.region === -1);
  }
  return regionIndex;
}

function markRegion(regions: Plot[], coords: [number, number], regionIndex: number) {
  const plot = regions.find(plot => plot.coords[0] === coords[0] && plot.coords[1] === coords[1]);
  if (plot && plot.region === -1){
    plot.region = regionIndex;
    markRegion(regions, [coords[0] - 1, coords[1]], regionIndex);
    markRegion(regions, [coords[0] + 1, coords[1]], regionIndex);
    markRegion(regions, [coords[0], coords[1] - 1], regionIndex);
    markRegion(regions, [coords[0], coords[1] + 1], regionIndex);
  }
}

function getPerimeter(regions: Plot[]): number {
  return regions.reduce((acc, plot) => acc += 4 - getNeighbours(regions, plot.coords), 0);
}

function getNeighbours(region: Plot[], coords: [number, number]): number {
  let count = 0;
  if (region.findIndex((p) => p.coords[0] === coords[0] - 1 && p.coords[1] === coords[1]) !== -1) {
    count++;
  }
  if (region.findIndex((p) => p.coords[0] === coords[0] + 1 && p.coords[1] === coords[1]) !== -1) {
    count++;
  }
  if (region.findIndex((p) => p.coords[0] === coords[0] && p.coords[1] === coords[1] - 1) !== -1) {
    count++;
  }
  if (region.findIndex((p) => p.coords[0] === coords[0] && p.coords[1] === coords[1] + 1) !== -1) {
    count++;
  }
  return count;
}

async function readFormFile(filename: string): Promise<Map<string, Plot[]>>{
  const filePath = path.join(__dirname, filename);

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })
  
  const regions = new Map<string, Plot[]>();
  let rows = 0;
  for await (const line of rl) {
    const plots = line.split('');
    plots.forEach((plot, index) => {
      const coords: Plot = { coords: [index, rows], region: -1 };
      if (regions.has(plot)) {
        regions.get(plot)?.push(coords);
      } else {
        regions.set(plot, new Array(coords));
      }
    });
    rows++;
  }
  return regions;
}

interface Plot {
  coords: [number, number];
  region: number;
}

