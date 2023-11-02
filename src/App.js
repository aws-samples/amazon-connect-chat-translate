import React, { Component } from "react";
import Auth from "@aws-amplify/auth";
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from "./aws-exports";

import "./App.css";
import 'semantic-ui-less/semantic.less';

// Import components
import Ccp from "./components/ccp";

Auth.configure(awsconfig);

class App extends Component {
       render() {
              return (
                     <div className="App">
                        <Ccp />
                     </div>
              );
       }
}

export default withAuthenticator(App)
