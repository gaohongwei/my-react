import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import './App.css';
import GitHubUser from './components/GitHubUser'
import FunTable from './components/FunTable'
import ClsTable from './components/ClsTable'
import Home     from './components/Home'
import CheckBoxTableApp     from './components/CheckBoxTableApp'
import TodoList     from './components/TodoList'


const routing = (
  <Router>
    <div>
      <Route path="/" exact={true} component={TodoList} />
      <Route path="/git" exact={true} component={GitHubUser} />
      <Route path="/function" exact={true} component={FunTable} />
      <Route path="/class" exact={true} component={ClsTable} />
      <Route path="/home" exact={true} component={Home} />
      <Route path="/checkbox" exact={true} component={CheckBoxTableApp} />

    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
