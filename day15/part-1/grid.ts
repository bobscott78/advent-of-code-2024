class Grid {
  public grid = new Map<string, string>()
  private lines = 0;
  private columns = 0;
  public robot: [number, number] = [0, 0];

  constructor() {
  }


  print() {
    for (let y = 0; y < this.lines; y++) {
      let row = '';
      for (let x = 0; x < this.columns; x++) {
        row += this.grid.get(this.coordString(x, y)) || '.';
      }
      console.log(row);
    }
  }

  sumGpsCoords(): number {
    let sum = 0;
    for (const [key, value] of this.grid.entries()) {
      if (value === 'O') {
        const [x, y] = key.split(',').map(Number);
        sum += (100 * y) + x;
      }
    }
    return sum;
  }

  moveRobot(direction: string) {
    const destination: [number, number] = this.getNext(direction, this.robot);
    const nextBox = this.grid.get(this.coordString(destination[0], destination[1]));
    if (nextBox === '.') {
      this.grid.set(this.coordString(this.robot[0], this.robot[1]), '.');
      this.robot = destination; 
      this.grid.set(this.coordString(this.robot[0], this.robot[1]), '@');
    } else if (nextBox === 'O') {
      if (this.moveBox(destination, direction)) {
        this.grid.set(this.coordString(this.robot[0], this.robot[1]), '.');
        this.robot = destination; 
        this.grid.set(this.coordString(this.robot[0], this.robot[1]), '@');
      }
    }
  }

  private moveBox(location: [number, number], direction: string): boolean {
    const destination = this.getNext(direction, location);
    const nextBox = this.grid.get(this.coordString(destination[0], destination[1]));
    if (nextBox === '.') {
      this.grid.set(this.coordString(destination[0], destination[1]), 'O');
      return true;
    }
    if (nextBox === '#') {
      return false;
    }
    if (nextBox === 'O') {
      if (!this.moveBox(destination, direction)) {
        return false;
      }
      return true;
    }
    return false;
  }

  private getNext(direction: string, location: [number, number]): [number, number] {
    if (direction === '<') {
      return [location[0] - 1, location[1]];
    }
    if (direction === '^') {
      return [location[0], location[1] - 1];
    }
    if (direction === '>') {
      return [location[0] + 1, location[1]];
    }
    if (direction === 'v') {
      return [location[0], location[1] + 1];
    }
    return [-1, -1];
  }
  
  addLine(line: string) {
    this.columns = 0;
    line.split('').forEach((char, index) => {
      this.grid.set(this.coordString(index, this.lines), char);
      if (char === '@') {
        this.robot = [index, this.lines];
      }
      this.columns++;
    });
    this.lines++;
  }  

  private coordString(x: number, y: number): string {
    return `${x},${y}`;
  }
}

export default Grid;