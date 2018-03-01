import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

function budgetReducer(state = {}, action) {
  switch (action.type) {
  case 'BUDGET_REQUEST':
    fetch('http://localhost:3000/budget')
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        console.log('parsed json', json)
        store.dispatch({type: 'BUDGET_REQUEST_SUCCESS', data: json})
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
    return state
  case 'BUDGET_REQUEST_FAILED':
  case 'BUDGET_REQUEST_SUCCESS':
    return {
      ...state,
      budget: action.data
    }
  default:
    console.info(`state ${JSON.stringify(state)} : action : ${action} `);
    return state;
  }
}

function countReducer(state = {counter: 0}, action) {
  switch (action.type) {
  case 'INCREMENT':
    return {
      ...state,
      counter: (state.counter+1)
    }
  case 'DECREMENT':
    return {
      ...state,
      counter: (state.counter-1)
    }
  default:
    console.info(`state ${JSON.stringify(state)} : action : ${action} `);
    return state;
  }
}

const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

// components/SpendingTable.js
const SpendingTable = ({}) => (
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>2018-01</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Shopping</td>
        <td>$100.00</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Auto Payment</td>
        <td>$400.00</td>
      </tr>
    </tfoot>
  </table>
)

const App = () => (
  <div>
    <Counter
      value={store.getState().countReducer.counter}
      onIncrement={() =>
        store.dispatch({type: 'INCREMENT'})
      }
      onDecrement={() =>
        store.dispatch({type: 'DECREMENT'})
      }
      />
      <SpendingTable />
  </div>
)
// Example of createStore from scratch
// const createStore = (reducer) => {
//   let state;
//   let listeners = [];
//
//   const getState = () => state;
//
//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach(listener => listener());
//   };
//
//   const subscribe = (listener) => {
//     listeners.push(listener);
//     return () => {
//       listeners = listeners.filter(l => l !== listener);
//     };
//   };
//
//   dispatch({});
//
//   return { getState, dispatch, subscribe };
// }
// let store = createStore(counter);
// let store = createStore(counter,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
const store = createStore(
  combineReducers({ countReducer: countReducer, budgetReducer: budgetReducer})
  ,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const render = () => {
  // document.body.innerText = store.getState();
  ReactDOM.render(
    // <Counter
    //   value={store.getState()}
    //   onIncrement={() =>
    //     store.dispatch({type: 'INCREMENT'})
    //   }
    //   onDecrement={() =>
    //     store.dispatch({type: 'DECREMENT'})
    //   }
    //   />,
    //   <SpendingTable />,
    <App/>,
    document.getElementById('root')
  );
};
store.subscribe(render)
render();
store.dispatch({type: 'BUDGET_REQUEST'})

// const render

// document.addEventListener('click', () => {
//   store.dispatch({ type: 'INCREMENT' })
//   // store.dispatch({ type: 'DECREMENT' })
// });



