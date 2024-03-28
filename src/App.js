import { Auth } from '@aws-amplify/auth';
import React, { Component } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import './App.css';
import 'semantic-ui-less/semantic.less';
import Ccp from './components/ccp';

// Component
class App extends Component {

  constructor(props) {
    super(props);
    this.configureAuth = this.configureAuth.bind(this);
  }

  componentDidMount() {
    this.configureAuth();
  }

  configureAuth() {
    Auth.configure(awsconfig);
  }

  render() {
    return (
      <div className="App">
        <Ccp />  
      </div>
    );
  }
}

export default withAuthenticator(App);
