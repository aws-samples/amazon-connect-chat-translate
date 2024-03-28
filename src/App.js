import * as Amplify from 'aws-amplify';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import React, { useState, useEffect } from 'react';
import awsconfig from './aws-exports';
import './App.css';
import 'semantic-ui-less/semantic.less';
import Ccp from './components/ccp';

// Component
function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    configureAuth();
  }, []);

  const configureAuth = () => {
    Amplify.configure(awsconfig);
    setIsConfigured(true);
  };

  return (
    <div className="App">
      {isConfigured && <Ccp user={user} />}
    </div>
  );
}

export default withAuthenticator(App);