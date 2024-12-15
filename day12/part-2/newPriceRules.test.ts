import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

describe('newPriceRules', () => {
  it('should get number of cornerrs on rectangular region', async () => {
    const regions = await readFormFile('../part-1/puzzle-sample.txt');
    const aRegions = regions.get('A') || [];
    const corners = getCorners(aRegions);
    expect(corners).toEqual(4);
  });

  it('should get number of corners on square region', async () => {
    const regions = await readFormFile('../part-1/puzzle-sample.txt');
    const bRegions = regions.get('B') || [];
    const corners = getCorners(bRegions);
    expect(corners).toEqual(4);
  });

  it('should get number of corners on region of one plot', async () => {
    const regions = await readFormFile('../part-1/puzzle-sample.txt');
    const dRegions = regions.get('D') || [];
    const corners = getCorners(dRegions);
    expect(corners).toEqual(4);
  });

  it('should get number of corners on irregular region', async () => {
    const regions = await readFormFile('../part-1/puzzle-sample.txt');
    const cRegions = regions.get('C') || [];
    const corners = getCorners(cRegions);
    expect(corners).toEqual(8);
  });

  it('should get total price of all regions', async () => {
    const regions = await readFormFile('../part-1/puzzle-sample.txt');
    const totalPrice = getTotalPrice(regions);
    expect(totalPrice).toEqual(80);
  });

  it('should get total price of sample 2', async () => {
    const regions = await readFormFile('../part-1/puzzle-sample-2.txt');
    const totalPrice = getTotalPrice(regions);
    expect(totalPrice).toEqual(436);
  });

  it('should get total price of larger sample', async () => {
    const regions = await readFormFile('../part-1/puzzle-sample-larger.txt');
    const totalPrice = getTotalPrice(regions);
    expect(totalPrice).toEqual(1206);
  });

  it.skip('should get total price of puzzle input', async () => {
    const regions = await readFormFile('../part-1/puzzle-input.txt');
    const totalPrice = getTotalPrice(regions);
    expect(totalPrice).toEqual(15404);
  });
});

function getTotalPrice(regions: Map<string, Plot[]>): number {
  let price = 0;
  for (const region of regions.keys()) {
    const regionPlots = regions.get(region) ?? [];
    const regionIndex = splitRegion(regionPlots);
    for(let i = 0; i < regionIndex; i++) {
      const plots = regionPlots.filter(p => p.region === i);
      price += getCorners(plots) * plots.length;
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

function getCorners(regions: Plot[]): number {
  let corners = 0;
  for(const region of regions) {
    const west = regions.find(r => r.coords[0] === region.coords[0] - 1 && r.coords[1] === region.coords[1]);
    const east = regions.find(r => r.coords[0] === region.coords[0] + 1 && r.coords[1] === region.coords[1]);
    const north = regions.find(r => r.coords[0] === region.coords[0] && r.coords[1] === region.coords[1] - 1);
    const south = regions.find(r => r.coords[0] === region.coords[0] && r.coords[1] === region.coords[1] + 1);
    const northwest = regions.find(r => r.coords[0] === region.coords[0] - 1 && r.coords[1] === region.coords[1] - 1);
    const northeast = regions.find(r => r.coords[0] === region.coords[0] + 1 && r.coords[1] === region.coords[1] - 1);
    const southwest = regions.find(r => r.coords[0] === region.coords[0] - 1 && r.coords[1] === region.coords[1] + 1);
    const southeast = regions.find(r => r.coords[0] === region.coords[0] + 1 && r.coords[1] === region.coords[1] + 1);
    
    if (!west && !north) {
      corners++;
    }
    if (!west && !south) {
      corners++;
    }
    if (!east && !north) {
      corners++;
    }
    if (!east && !south) {
      corners++;
    }
    if (north && east && !northeast) {
      corners++;
    }
    if (north && west && !northwest) {
      corners++;
    }
    if (south && west && !southwest) {
      corners++;
    }
    if (south && east && !southeast) {
      corners++;
    }
  }
  return corners;
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