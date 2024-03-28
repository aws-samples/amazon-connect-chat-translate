import { Amplify } from '@aws-amplify/core';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'semantic-ui-less/semantic.less';
import Ccp from './components/ccp';

// Component
function App({ signOut, user }) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    configureAuth();
  }, []);

  const configureAuth = () => {
    Amplify.default.configure(awsconfig);
    setIsConfigured(true);
  };

  return (
    <div className="App">
      {isConfigured && <Ccp user={user} signOut={signOut} />}
    </div>
  );
}

export default withAuthenticator(App);