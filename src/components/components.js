import * as React from 'react';
import * as ReactDOM from 'react-dom';
import createReactClass from 'create-react-class'

let count = 0;

export let GameView = createReactClass({
  render: function () {
    const gameBoardStyle = {
                            width: this.props.game.cols*15, 
                            height: this.props.game.rows*25,
                            border: '2px solid cyan'
                          }

    return <div onKeyUp={this.handleKeyUp} style={gameBoardStyle}>
      <PieceView piece={this.props.game.fallingPiece} />
      <RubbleView rubble={this.props.game.rubble} />
    </div>;
  },
  handleKeyUp: function (e) {
    console.log('key pressed');
    console.dir(e);
  }
});

export let PieceView = createReactClass({
  render: function () {
    return <div>
      {this.props.piece.points().map(square => <Square key={count++} row={square.row} col={square.col} />)}
    </div>;
  }
});

export let RubbleView = createReactClass({
  render: function () {
    return <span>
      {this.props.rubble.map(square => <Square key={"row"+square.row+"col"+square.col} row={square.row} col={square.col} />)}
    </span>;
  }
});

export let Square = createReactClass({
    render: function() {
    		var squareStyle = {
        	left: (this.props.col-1) * 25 + 'px',
          top: (this.props.row-1) * 25 + 'px',
          position: 'absolute',
          width: '20px',
          height: '20px',
          backgroundColor: 'pink'
        };
        return <div className="square" style={squareStyle}></div>;
    }
});