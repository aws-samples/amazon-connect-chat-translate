import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import React from 'react';
import './App.css';
import 'semantic-ui-less/semantic.less';
import Ccp from './components/ccp';

Amplify.configure(awsconfig);

function App({ signOut, user }) {
  return (
    <div className="App">
      {<Ccp user={user} signOut={signOut} />}
    </div>
  );
}

export default withAuthenticator(App);