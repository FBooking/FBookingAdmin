import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import 'antd/dist/antd.css';
import '../../assests/css/app.css'

import Dashboard from '../dashboard'

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Dashboard} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
