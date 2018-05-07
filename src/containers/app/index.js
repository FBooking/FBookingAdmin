import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import 'antd/dist/antd.css';
import '../../assests/css/app.css'

import Dashboard from '../dashboard'
import Layout from '../layout';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Layout>
            <Route exact path="/dashboard/:tab" component={Dashboard} />
          </Layout >
        </Switch>
      </HashRouter >
    );
  }
}

export default App;
