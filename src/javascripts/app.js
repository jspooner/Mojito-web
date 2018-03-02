import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';

const initState = {
  budget: { debits: [], credits: [] }
}

function budgetReducer(state = initState, action) {
  switch (action.type) {
  case 'BUDGET_REQUEST_FAILED':
    return {
      ...state,
      budget: { type: 'BUDGET_REQUEST_SUCCESS', }
    }
  case 'BUDGET_REQUEST_SUCCESS':
    console.log('BUDGET_REQUEST_SUCCESS', state)
    debugger
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
class SpendingTable extends React.Component {
        
  render() {
    const { data } = this.props;
    return (
      <div>
        <ReactTable
          data={data}
          columns={[
            {
              Header: 'Category',
              accessor: 'category'
            }
          ]}
        />
      </div>
    )
  }
}

class App extends React.Component {
  
  getData() {
    console.log(store.getState())
    // return store.getState()['budgetReducer']['budget']['debits'] || []
    return store.getState().budgetReducer.budget.debits
  }
  
  render() {
    const data = this.getData();
    console.log(data)
    return (
      <div>
        <Counter
          // value={store.getState().countReducer.counter}
          onIncrement={() =>
            store.dispatch({type: 'INCREMENT'})
          }
          onDecrement={() =>
            store.dispatch({type: 'DECREMENT'})
          }
          />
          <SpendingTable data={data} />
      </div> 
    )
  }
}
// const App = () => (
//   <div>
//     <Counter
//       value={store.getState().countReducer.counter}
//       onIncrement={() =>
//         store.dispatch({type: 'INCREMENT'})
//       }
//       onDecrement={() =>
//         store.dispatch({type: 'DECREMENT'})
//       }
//       />
//       <SpendingTable data={store.getState()['budgetReducer']['budget'] } />
//   </div>
// )


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
  combineReducers({budgetReducer})
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

// fetch('http://localhost:3001/budget')
//   .then(function(response) {
//     return response.json()
//   }).then(function(json) {
//     console.log('BUDGET json', json)
//     store.dispatch({type: 'BUDGET_REQUEST_SUCCESS', data: json})
//   }).catch(function(ex) {
//     console.log('parsing failed', ex)
//   })

store.dispatch({type: 'BUDGET_REQUEST_SUCCESS', data: {
  credits: [{category: 'Income'}],
  debits: [{category: 'Shopping'}]
  }})


// const render

// document.addEventListener('click', () => {
//   store.dispatch({ type: 'INCREMENT' })
//   // store.dispatch({ type: 'DECREMENT' })
// });



