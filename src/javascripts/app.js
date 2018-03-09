import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import PropTypes from 'prop-types';
import {ConnectedRouter} from 'react-router-redux';


import { applyMiddleware, createStore, combineReducers } from 'redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory';
import {connect} from 'react-redux'
import ReactTable from 'react-table';

import "../stylesheets/styles.scss";

/** /actions **/

function fetchBudget() {
  return function(dispatch) {
    fetch('http://localhost:3000/budget').then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);
      dispatch({type: 'BUDGET_REQUEST_SUCCESS', data: json})
    })
    .catch((exception) => {
      console.log('parsing failed', exception)
      dispatch({type: 'BUDGET_REQUEST_FAILED', data: exception})
    })
  }
}

/** /reducers **/
const initState = {
  budget: { debits: [{category: 'none'}], credits: [] }
}

function budgetReducer(state = initState, action) {
  switch (action.type) {
  case 'BUDGET_REQUEST_FAILED':
    return { ...state, budget: null }
  case 'BUDGET_REQUEST_SUCCESS':
    return { ...state, budget: action.data }
  case 'FETCH_BUDGET':
  default:
    return {...state};
  }
}

/** store.js **/
const history = createHistory();
const middleware = applyMiddleware(thunk, logger)
const store = createStore(
  combineReducers({budgetReducer})
  , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  , middleware
);

/** /components/Layout **/
class SpendingTable extends React.Component {
  render() {
    const { data } = this.props;
    const keys = Object.keys(data[0]);
    const columns = keys.map( d => ({ Header: d, accessor: d }) )
    // debugger
    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
        />
      </div>
    )
  }
}

class LayoutDumb extends React.Component {
  componentWillMount() {
    this.props.store.dispatch(fetchBudget())
  }
  render() {
    // console.log(this.props)
    const { debits } = this.props.budget;
    // const mappedDebits = debits.map(d => <li key={d.category}>{d.category}</li>)
    return (
      <SpendingTable data={debits}/>
    )
  }
}
/** Layout + Controller **/
const Layout = connect((store) => {
  return {
    budget: store.budgetReducer.budget
  }
})(LayoutDumb)


/** app.js **/
const rootElement = document.getElementById('root');
if (process.env.NODE_ENV === 'production') {
  ReactDOM.render(<Layout store={store} history={history} />, rootElement );
} else {
  require('react-hot-loader');
  const renderWithHotReload = (Layout) => {
    const AppContainer = require('react-hot-loader').AppContainer;
    ReactDOM.render(
      <AppContainer>
        <Layout store={store} history={history} />
      </AppContainer>,
      rootElement
    );
  };
  renderWithHotReload(Layout);
  if (module.hot) {
    // module.hot.accept('./containers/Root', () => {
    //   console.info("Applying Hot Update!");
    //   const nextRootContainer = require('./containers/Root').default;
    //   renderWithHotReload(nextRootContainer);
    // });
  }
}
