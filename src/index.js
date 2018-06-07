import * as React from 'react';
import * as ReactDOM  from 'react-dom';
import * as Components from './components/components';
import * as Model from './components/models';
import { createStore } from 'redux';
import * as Mousetrap from 'mousetrap';

function reducer(state = new Model.Game(), action) {
    switch (action.type) {
        case 'TICK':
        return state.tick();
        case 'ROTATE':
        return state.rotate();
        default: return state;
    }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.subscribe(() => {
    ReactDOM.render(<Components.GameView game={store.getState()} />, 
    document.getElementById('root'));
  });
  
  setInterval(() => store.dispatch({ type: 'TICK' }),500);
  
  Mousetrap.bind('space', () => { store.dispatch({type:'ROTATE'}); });