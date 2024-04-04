import { Amplify }  from '@aws-amplify/core';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'semantic-ui-less/semantic.less';
import Ccp from './components/ccp';
//import { autoSignIn } from '@aws-amplify/auth';

// Component
function App({ signOut, user }) {
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    configureAuth();
    //signedIn();
  }, []);

  const configureAuth = () => {
    Amplify.configure(awsconfig);
    setIsConfigured(true);
  };
  //const signedIn = async () => {
    //await autoSignIn();
  //};

  return (
    <div className="App">
      {isConfigured && <Ccp user={user} signOut={signOut} />}
    </div>
  );
}

export default withAuthenticator(App);