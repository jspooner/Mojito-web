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

/** /reducers **/
const initState = {
  // budget: {
  //   income: {}
  // }
}

function budgetReducer(state = initState, action) {
  switch (action.type) {
  case 'BUDGET_REQUEST_FAILED':
    return { ...state, budget: null }
  case 'BUDGET_REQUEST_SUCCESS':
    // const keys        = Object.keys(action.data.income[0]);
    // const dateColumns = keys.filter(word => !['category','average','total'].includes(word))

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

/** /components **/
class IncomeTable extends React.Component {
  render() {
    const { income } = this.props;
    if (!income) {
      return (
        <div>Loading</div>
      )
    }
    const keys = Object.keys(income[0]);
    const dateColumns = keys.filter(word => !['category','average','total']
      .includes(word))
      .map( d => ({ Header: d, accessor: d, width: 80 } ) )
    const columns = [{
      Header: 'Category',
      accessor: 'category',
      width: 200,
      class: 'category'
    }].concat(dateColumns).concat([{
      Header: 'Average',
      accessor: 'average',
      width: 100
    }, {
      Header: 'Total',
      accessor: 'total',
      width: 100
    },
    {
      Header: 'Category',
      accessor: 'category-2',
      width: 200
    }]
    // .concat(dateColumns)
  )
    return (
      <div>
        <ReactTable
          data={income}
          columns={columns}
          className="-striped -highlight"
          defaultPageSize={income.length}
          showPagination={false}
          defaultSorted={[{id: "total",desc: true}]}
        />
      </div>
    )
  }
}
class BudgetTable extends React.Component {
  render() {
    const { budget, totals } = this.props;
    if (!budget) {
      return (
        <div>Loading</div>
      )
    }
    const keys = Object.keys(budget[0]);
    const dateColumns = keys.filter(word => !['category','average','total']
      .includes(word))
      .map( d => ({ Header: d, accessor: d, width: 80, Footer: (<div>{" "}{
        this.props.totals[d]
        // Collect the data by column and sum
        // console.log(this.props.data[0][d]) 
      }</div>) }) )
    const columns = [{
      Header: 'Category',
      accessor: 'category',
      width: 200,
      class: 'category'
    }].concat(dateColumns).concat([{
      Header: 'Average',
      accessor: 'average',
      width: 100
    }, {
      Header: 'Total',
      accessor: 'total',
      width: 100
    }])
    return (
      <div>
        <ReactTable
          data={budget}
          columns={columns}
          className="-striped -highlight"
          defaultPageSize={budget.length}
          showPagination={false}
          defaultSorted={[{id: "total",desc: true}]}
        />
      </div>
    )
  }
}
/** /layouts **/
class LayoutDumb extends React.Component {
  static propTypes = {
    fetchBudget: PropTypes.func.isRequired,
    budget: PropTypes.object,
    totals: PropTypes.object,
    income: PropTypes.object
  }
  static defaultProps = {
    income: {},
    budget: {},
    totals: {}
  }
  componentWillMount() {
    // Dumb component shouln't know about fetchBudget
    // this.props.store.dispatch(fetchBudget())
    // if(!this.props.budget) {
      this.props.fetchBudget()
    // }
  }
  render() {
    // console.log(this.props)
    const { totals, budget, income } = this.props.budget;
    return (
      <div id="budget">
        <h1>Budget</h1>
        <IncomeTable income={income} />
        <BudgetTable budget={budget} totals={totals} />
      </div>
    )
  }
}

/** Container **/
// container component pattern.
// containers vs components https://www.youtube.com/watch?v=KYzlpRvWZ6c&feature=youtu.be&t=22m32s
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

const Layout = connect((store) => {
  return {
    budget: store.budgetReducer.budget
  }
}, {fetchBudget})(LayoutDumb)


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
