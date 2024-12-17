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
      if (value === '[') {
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
    } else if (nextBox === ']' || nextBox === '[') {
      if (this.moveBox(destination, direction)) {
        this.grid.set(this.coordString(this.robot[0], this.robot[1]), '.');
        this.robot = destination; 
        this.grid.set(this.coordString(this.robot[0], this.robot[1]), '@');
      }
    }
  }

  private canMoveBoxVertically(location: [number, number], direction: string): boolean {
    const currentBox = this.grid.get(this.coordString(location[0], location[1])) || '';
    if (currentBox === '.') {
      return true;
    }
    
    let box: [[number, number], [number, number]];
    if (currentBox === '[') {
      box = [[location[0], location[1]], [location[0] + 1, location[1]]];
    } else {
      box = [[location[0] - 1, location[1]], [location[0], location[1]]];
    }
    const destination = [this.getNext(direction, box[0]), this.getNext(direction, box[1])];
    const nextBoxes = [this.grid.get(this.coordString(destination[0][0], destination[0][1])),
      this.grid.get(this.coordString(destination[1][0], destination[1][1]))];
    
    
    if (nextBoxes[0] === '#' || nextBoxes[1] === '#') {
      return false;
    }
    else if (nextBoxes[0] === '.' && nextBoxes[1] === '.') {
      return true;
    }
    return this.canMoveBoxVertically(destination[0], direction)
      && this.canMoveBoxVertically(destination[1], direction);
  }

  private moveBoxVertically(location: [number, number], direction: string) {
    const currentBox = this.grid.get(this.coordString(location[0], location[1])) || '';
    if (currentBox === '.') {
      return;
    }
    let box: [[number, number], [number, number]];
    if (currentBox === '[') {
      box = [[location[0], location[1]], [location[0] + 1, location[1]]];
    } else {
      box = [[location[0] - 1, location[1]], [location[0], location[1]]];
    }
    
    const destination = [this.getNext(direction, box[0]), this.getNext(direction, box[1])];
    const nextBoxes = [this.grid.get(this.coordString(destination[0][0], destination[0][1])),
      this.grid.get(this.coordString(destination[1][0], destination[1][1]))];
    if (nextBoxes[0] === '#' || nextBoxes[1] === '#') {
      return;
    }
    else if (nextBoxes[0] === '.' && nextBoxes[1] === '.') {
      this.grid.set(this.coordString(box[0][0], box[0][1]), '.');
      this.grid.set(this.coordString(box[1][0], box[1][1]), '.');
      this.grid.set(this.coordString(destination[0][0], destination[0][1]), '[');
      this.grid.set(this.coordString(destination[1][0], destination[1][1]), ']');
      return;
    } 
    
    if (nextBoxes[0] === ']' && nextBoxes[1] === '[') {
      this.moveBoxVertically(destination[0], direction);
      this.moveBoxVertically(destination[1], direction);
      this.grid.set(this.coordString(box[0][0], box[0][1]), '.');
      this.grid.set(this.coordString(box[1][0], box[1][1]), '.');
      this.grid.set(this.coordString(destination[0][0], destination[0][1]), '[');
      this.grid.set(this.coordString(destination[1][0], destination[1][1]), ']');
      return;
    }
    
    this.moveBoxVertically(destination[0], direction);
    this.moveBoxVertically(destination[1], direction);
    this.grid.set(this.coordString(box[0][0], box[0][1]), '.');
    this.grid.set(this.coordString(box[1][0], box[1][1]), '.');
    this.grid.set(this.coordString(destination[0][0], destination[0][1]), '[');
    this.grid.set(this.coordString(destination[1][0], destination[1][1]), ']');
  }

  private moveBox(location: [number, number], direction: string): boolean {
    if (direction === 'v' || direction === '^') {
      if (!this.canMoveBoxVertically(location, direction)) {
        return false;
      }
      this.moveBoxVertically(location, direction);
      return true;
    }
    const destination = this.getNext(direction, location);
    const currentBox = this.grid.get(this.coordString(location[0], location[1])) || '';
    const nextBox = this.grid.get(this.coordString(destination[0], destination[1])) ||  '';
    if (nextBox === '.') {
      this.grid.set(this.coordString(destination[0], destination[1]), currentBox);
      return true;
    }
    if (nextBox === '#') {
      return false;
    }
    if (nextBox === '[' || nextBox === ']') {
      if (!this.moveBox(destination, direction)) {
        return false;
      }
      this.grid.set(this.coordString(destination[0], destination[1]), currentBox);
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
      let cells: string[];
      if (char === '#') {
        cells = ['#', '#'];
      } else if (char === 'O') {
        cells = ['[', ']'];
      } else if (char === '@') {
        cells = ['@', '.'];
      } else {
        cells = ['.', '.'];
      }
      if (char === '@') {
        this.robot = [this.columns, this.lines];
      }

      this.grid.set(this.coordString(this.columns++, this.lines), cells[0]);
      this.grid.set(this.coordString(this.columns++, this.lines), cells[1]);
    });
    this.lines++;
  }  

  private coordString(x: number, y: number): string {
    return `${x},${y}`;
  }
}

export default Grid;