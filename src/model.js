import * as _ from 'underscore';

export class Point {
    constructor(row,col) {
      this.row = row;
      this.col = col;
    }
    add(otherPoint) {
      return new Point(this.row -1 + otherPoint.row, this.col - 1 + otherPoint.col);
    }
    sameAs(p2) {
      return this.row === p2.row && this.col === p2.col;
    }
  }
  
  export class Tetromino {
    constructor(name, rotator) {
      this.name = name;
      this.rotator = rotator;
    }
    pointsRotated(rotation) {
      return this.rotator(rotation);
    }
  }
  
  export class Piece {
    constructor(shape, rows, cols, offset = new Point(1,10)) {
      this.shape = shape;
      this.rows = rows;
      this.cols = cols;
      this.offset = offset;
      this.rotation = 'N';
    }
    points() {
      return this.shape.pointsRotated(this.rotation).map(point => point.add(this.offset));
    }
    maxRow() {
      return Math.max.apply(null, this.points().map(point => point.row));
    }
    maxCol() {
      return Math.max.apply(null, this.points().map(point => point.col));
    }
    minCol() {
      return Math.min.apply(null, this.points().map(point => point.col));
    }
    rotate() {
      this.rotation = Piece.rotations()[(Piece.rotations().indexOf(this.rotation)+1) % 4];
    }
    unRotate() {
      this.rotation = Piece.rotations()[(Piece.rotations().indexOf(this.rotation)-1) % 4];
    }
    hasPoint(point) {
      return this.points().some(item => item.sameAs(point));
    }
    fallOne() {
      this.offset = new Point(this.offset.row+1, this.offset.col);
    }
    liftOne() {
      this.offset = new Point(this.offset.row-1, this.offset.col);
    }
    left() {
      this.offset = new Point(this.offset.row, this.offset.col-1);
    }
    right() {
      this.offset = new Point(this.offset.row, this.offset.col+1);
    }
    static rotations() {
      return ['N','E','S','W'];
    }
  }
  
  export class Game {
    constructor() {
      this.rows = 15;
      this.cols = 15;
      this.startAPiece();
      this.rubble = [];
    }
    tick() {
      this.transactionDo(()=>this.fallingPiece.fallOne(), ()=> this.fallingPiece.liftOne());
      if (this.fallingPiece.maxRow() === this.rows) {
        this.convertToRubble();
        return this;
      }
      var nextPos = this.fallingPiece.points().map(p => new Point(p.row+1,p.col));
      if (nextPos.some(p => this.rubble.some(r => r.sameAs(p)))) {
        this.convertToRubble();
      };
      return this;
    }
    convertToRubble() {
      this.rubble = this.rubble.concat(this.fallingPiece.points());
      const completedRows = this.completedRows();
      completedRows.forEach(r => this.collapseRow(r));
      if (!this.isGameOver()) {
        this.startAPiece();
      }
    }
    isGameOver() {
      return this.rubble.some(point => point.row === 1);
    }
    startAPiece() {
      this.fallingPiece = new Piece(shapes.selectRandom(), this.rows, this.cols);
    }
    rotate() {
      this.transactionDo(()=>this.fallingPiece.rotate(), ()=> this.fallingPiece.unRotate());
      return this;
    }
    left() {
      this.transactionDo(()=>this.fallingPiece.left(), ()=> this.fallingPiece.right());
      return this;
    }
    right() {
      this.transactionDo(()=>this.fallingPiece.right(), ()=> this.fallingPiece.left());
      return this;
    }
    fallingPieceIsOutOfBounds() {
      return this.fallingPiece.minCol() < 1 ||
        this.fallingPiece.maxCol() > this.cols ||
        this.fallingPiece.maxRow() > this.rows;
    }
    fallingPieceOverlapsRubble() {
      return this.fallingPiece.points().some(p => this.rubble.some(r => r.sameAs(p)));
    }
    transactionDo(thing, compensation) {
      thing();
      if (this.fallingPieceIsOutOfBounds() || this.fallingPieceOverlapsRubble()) {
        compensation();
      }
    }
    completedRows() {
      return _.range(1,this.rows+1).filter(row =>
        _.range(1,this.cols+1).every(col => this.rubbleHas(row,col))
      );
    }
    collapseRow(row) {
      this.rubble = this.rubble.filter(point => point.row !== row);
      const higherPoints = this.rubble.filter(point => point.row < row);
      higherPoints.forEach(point => point.row += 1);
    }
    rubbleHas(row,col) {
      return this.rubble.some(point => point.row === row && point.col === col);
    }
  }
  
  // dictionary of shape type to square offsets
  export var shapes = {
    'O': new Tetromino('O', rotation => [new Point(1,1),new Point(1,2), new Point(2,1),new Point(2,2)]),
    'I': new Tetromino('I', rotation => {
      switch (rotation) {
        case 'N': return [new Point(1,1), new Point(2,1),new Point(3,1), new Point(4,1)];
        case 'E': return [new Point(2,1), new Point(2,2),new Point(2,3), new Point(2,4)];
        case 'S': return [new Point(1,1), new Point(2,1),new Point(3,1), new Point(4,1)];
        case 'W': return [new Point(2,1), new Point(2,2),new Point(2,3), new Point(2,4)];
      }
    }),
    'T': new Tetromino('T', rotation => {
      switch (rotation) {
        case 'N': return [new Point(1,1), new Point(1,2), new Point(2,2), new Point(1,3)];
        case 'E': return [new Point(1,2), new Point(2,2),new Point(3,2), new Point(2,1)];
        case 'S': return [new Point(1,2), new Point(2,1),new Point(2,2), new Point(2,3)];
        case 'W': return [new Point(1,1), new Point(2,1),new Point(3,1), new Point(2,2)];
      }
    }),
    'L': new Tetromino('L', rotation => {
      switch (rotation) {
        case 'N': return [new Point(1,1), new Point(2,1), new Point(1,2), new Point(1,3)];
        case 'E': return [new Point(1,1), new Point(1,2), new Point(2,2), new Point(3,2)];
        case 'S': return [new Point(1,3), new Point(2,1), new Point(2,2), new Point(2,3)];
        case 'W': return [new Point(1,1), new Point(2,1), new Point(3,1), new Point(3,2)];
  
      }
    }),
    'Z': new Tetromino('Z', rotation => {
      switch (rotation) {
        case 'N': return [new Point(1,1), new Point(1,2), new Point(2,2), new Point(2,3)];
        case 'E': return [new Point(1,2), new Point(2,2),new Point(2,1), new Point(3,1)];
        case 'S': return [new Point(1,1), new Point(1,2), new Point(2,2), new Point(2,3)];
        case 'W': return [new Point(1,2), new Point(2,2),new Point(2,1), new Point(3,1)];
      }
    }),
    'S': new Tetromino('S', rotation => {
        switch (rotation) {
            case 'N': return [new Point(2,1), new Point(2,2), new Point(1,2), new Point(1,3)];
            case 'E': return [new Point(1,1), new Point(2,1), new Point(2,2), new Point(3,2)];
            case 'S': return [new Point(2,1), new Point(2,2), new Point(1,2), new Point(1,3)];
            case 'W': return [new Point(1,1), new Point(2,1), new Point(2,2), new Point(3,2)];
        }
    }),
    'J': new Tetromino('J', rotation => {
        switch (rotation) {
            case 'N': return [new Point(1,1), new Point(1,2), new Point(1,3), new Point(2,3)];
            case 'E': return [new Point(1,2), new Point(2,2), new Point(3, 2), new Point(3,1)];
            case 'S': return [new Point(1,1), new Point(2,1), new Point(2,2), new Point(2,3)];
            case 'W': return [new Point(1,1), new Point(1,2), new Point(2,1), new Point(3,1)];
        }
    })
  };
  shapes.selectRandom = function() {
    var index = Math.floor(Math.random()*1000000%7);
    return shapes[Object.keys(shapes)[index]];
  }
  