import * as React from 'react';
import * as ReactDOM  from 'react-dom';
import * as Components from './components';
import * as Model from './model';
import { createStore } from 'redux';
import * as Mousetrap from 'mousetrap';
import './index.css';

function reducer(state = new Model.Game(), action) {
  if (state.isGameOver()) return state;
    switch (action.type) {
        case 'TICK':
          const revedState = state.tick();
          if (!revedState.isGameOver()) {
            setTimeout(() => store.dispatch({ type: 'TICK' }),500);
          }
          return revedState;
        case 'ROTATE':
          return state.rotate();
        case 'LEFT':
          return state.left();
        case 'RIGHT':
          return state.right();
        default: return state;
    }
  }

Mousetrap.bind('space', () => { store.dispatch({type:'ROTATE'}); });
Mousetrap.bind('a', () => {store.dispatch({type: 'LEFT'});});
Mousetrap.bind('d', () => {store.dispatch({type: 'RIGHT'});});

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.subscribe(() => {
    ReactDOM.render(<Components.GameView game={store.getState()} />, 
    document.getElementById('root'));
  });
  
store.dispatch({ type: 'TICK' });