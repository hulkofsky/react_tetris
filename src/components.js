import * as React from 'react';
import createReactClass from 'create-react-class';

let count = 0;

export const GameView = createReactClass({
    render: function () {
        const gameBoardStyle = {
          width: this.props.game.cols*25, 
          height: this.props.game.rows*25,
          outline: '5px solid black',
          position: 'relative',
          backgroundColor: 'white'
        }

        return <div>
            <h1>
                TETROSHLACK
            </h1>
            <div  style={gameBoardStyle}>
                { this.props.game.isGameOver() ?
                    <span className="game-over">GG WP!(NO)</span> : <span>
                        <PieceView piece={this.props.game.fallingPiece} />
                        <RubbleView rubble={this.props.game.rubble} />
                    </span> }
            </div>;
        </div>
    }
    
});

export const PieceView = createReactClass({
    render: function () {
        return <div>
            {this.props.piece.points().map(square => <Square key={count++} row={square.row} col={square.col} />)}
        </div>;
    }
});

export const RubbleView = createReactClass({
    render: function () {
        return <span>
      {this.props.rubble.map(square => <Square key={"row"+square.row+"col"+square.col} row={square.row} col={square.col} />)}
    </span>;
    }
});

export const Square = createReactClass({
    render: function() {
        const squareStyle = {
            left: (this.props.col-1) * 25 + 'px',
            top: (this.props.row-1) * 25 + 'px',
            position: 'absolute',
            width: '20px',
            height: '20px',
            backgroundColor: `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`
        };
        return <div className="square" style={squareStyle}/>;
    }
});