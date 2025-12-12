import { Amplify }  from '@aws-amplify/core';
import awsconfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'semantic-ui-less/semantic.less';
import Ccp from './components/ccp';
//import { autoSignIn } from '@aws-amplify/auth';

// Component
function App(/* { signOut, user } */) {
  const [isConfigured, setIsConfigured] = useState(false);
  // Provide the Amazon Connect login/CCP URL via environment variable:
  // REACT_APP_CONNECT_CCP_URL=https://your-instance.my.connect.aws/connect/ccp-v2
  const CONNECT_LOGIN_URL = process.env.REACT_APP_CONNECT_CCP_URL;
  
  useEffect(() => {
    configureAuth();
    // If a Connect login URL is provided, redirect to it (replace history)
    if (CONNECT_LOGIN_URL) {
      window.location.replace(CONNECT_LOGIN_URL);
      return;
    }
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
      {CONNECT_LOGIN_URL ? (
        <div>
          <p>Redirecting to Amazon Connect login...</p>
          <p><a href={CONNECT_LOGIN_URL}>Go to Amazon Connect login</a></p>
        </div>
      ) : (
        isConfigured && <Ccp /* user={user} signOut={signOut} */ />
      )}
    </div>
  );
}

export default App;