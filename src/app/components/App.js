import React from 'react';

import Firebase from 'firebase';

import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';

import AppWrapper  from './AppWrapper';

let palette = getMuiTheme().palette;

const muiTheme = getMuiTheme({
  listItem: {
    rightIconColor: palette.primary1Color
  }
});

const App = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    user: React.PropTypes.object,
  },

  componentWillMount() {
    const _this = this;
    var ref = new Firebase("https://dazzling-inferno-1669.firebaseio.com");
    ref.onAuth(function(authData) {
      console.log('onauth', authData)
      if (authData) {
        const user = {
          provider: authData.provider,
          displayName: authData.google.displayName,
          img: authData.google.profileImageURL
        };

        _this.setState({ user: user });

        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        ref.child("users").child(authData.uid).set(user);
      } else {
        ref.authWithOAuthRedirect("google", function(error) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            // We'll never get here, as the page will redirect on success.
          }
        });
      }
    });
  },

  getInitialState() {
    return {
      muiTheme: muiTheme,
      user: null,
    };
  },

  getChildContext() {
    return {
      muiTheme: muiTheme,
      user: this.state.user,
    };
  },

  render() {
    if (!this.state.user) {
      return (
        <h1>You need to authentificate first</h1>
      );
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <AppWrapper content={this.props.children} />
      </MuiThemeProvider>
    );
  }
});

export default App;
