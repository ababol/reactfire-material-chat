import React from 'react';

import Firebase from 'firebase';

import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import RaisedButton from 'material-ui/lib/raised-button';
import ActionAndroid from 'material-ui/lib/svg-icons/action/android';
import {darkWhite} from 'material-ui/lib/styles/colors';

import AppWrapper  from './AppWrapper';

let palette = getMuiTheme().palette;

const muiTheme = getMuiTheme({
  listItem: {
    rightIconColor: palette.primary1Color
  }
});

const firebaseRoot = new Firebase("https://dazzling-inferno-1669.firebaseio.com");

const App = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    user: React.PropTypes.object,
  },

  componentWillMount() {
    const _this = this;
    firebaseRoot.onAuth(function(authData) {
      if (authData) {
        const user = {
          provider: authData.provider,
          displayName: authData.google.displayName,
          img: authData.google.profileImageURL
        };

        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        firebaseRoot.child("users").child(authData.uid).set(user);

        _this.setState({ user: user });
      }
    });
  },

  login() {
    firebaseRoot.authWithOAuthRedirect("google", function(error) {
      console.log("Login Failed!", error);
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

  getStyles() {
    return {
      landing: {
        backgroundColor: palette.primary1Color,
        height: '100%',
        display: 'flex',
      },
      container: {
        margin: '0 auto',
        alignSelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 400
      },

      h1: {
        color: darkWhite,
        fontSize: 30,
        fontWeight: 400,
      },
      h2: {
        fontSize: 20,
        lineHeight: '28px',
        letterSpacing: 0,
        fontWeight: 100,
      },
      demoStyle: {
        margin: '16px 32px 0px 32px',
      },

      label: {
        color: palette.primary1Color,
      },
    }
  },

  render() {
    const styles = this.getStyles();
    let render = null;

    if (!this.state.user) {
      render = (
        <div style={styles.landing}>
          <div style={styles.container}>

            <h1 style={styles.h1}>reactfire-material-chat</h1>
            <h2 style={styles.h2}>
              Simple chat build with React, Firebase & material-ui
            </h2>
            <RaisedButton
              className="demo-button"
              label="Login"
              linkButton={true}
              onTouchTap={this.login}
              style={styles.demoStyle}
              labelStyle={styles.label}
            />
          </div>
        </div>
      );
    } else {
      render = (
        <AppWrapper content={this.props.children} />
      );
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        {render}
      </MuiThemeProvider>
    );
  }
});

export default App;
