import React from 'react';

import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';

import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import AddCircle from 'material-ui/lib/svg-icons/content/add-circle-outline';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';
import AppBar from 'material-ui/lib/app-bar';
import Title from 'react-title-component';
import spacing from 'material-ui/lib/styles/spacing';
import {StyleResizable} from 'material-ui/lib/mixins';
import Avatar from 'material-ui/lib/avatar';

import {Link} from 'react-router';

const AppWrapper = React.createClass({
  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
  },

  mixins: [
    StyleResizable,
    ReactFireMixin
  ],

  getInitialState() {
    this.state = {
      navDrawerOpen: false,
      addRoomOpen: false
    };
  },

  getStyles() {
    const palette = this.context.muiTheme.palette;
    const primary1Color = palette.primary1Color;
    const alternateTextColor = palette.alternateTextColor;

    const styles = {
      logo: {
        cursor: 'pointer',
        fontSize: 24,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        paddingLeft: spacing.desktopGutter,
        marginBottom: 8,
      },
      appBar: {
        position: 'fixed',
        zIndex: 1301,
        top: 0,
      },
      rightIconAvatar: {
        color: 'white',
        display: 'flex',
        alignItems: 'center',
      },
      avatar: {
        marginTop: 4,
        marginLeft: 10,
        marginRight: 10,
      },
      navDrawer: {
        zIndex:0,
      },
      menuHeader: {
        backgroundColor: alternateTextColor,
        color: primary1Color
      },
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
      },
    };

    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    }

    return styles;
  },

  handleTouchTapLeftIconButton() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  },


  handleOpen() {
    this.setState({addRoomOpen: true});
  },

  handleClose() {
    this.setState({addRoomOpen: false});
  },

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      return this.handleSubmit(e);
    }
  },

  handleSubmit(e) {
    if (!this.state.roomTitle) {
      return this.handleClose();
    }

    e.preventDefault();
    const room = this.firebaseRefs.rooms.push({
      roomTitle: this.state.roomTitle
    });
    this.setState({ roomTitle: "" });
    this.handleClose();
    window.location = `#/room/${room.key()}`
  },

  handleChange(event) {
    this.setState({
      roomTitle: event.target.value,
    });
  },

  componentWillMount() {
    var ref = new Firebase("https://dazzling-inferno-1669.firebaseio.com/rooms");
    this.bindAsArray(ref, "rooms");
  },

  getMenuStyle(roomKey) {
    const roomId = window.location.hash.split('/').pop();

    if (roomKey === roomId) {
      return {
        backgroundColor: this.context.muiTheme.palette.primary1Color,
        color: 'white',
      };
    } else {
      return {};
    }
  },

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    let menuItems = this.state.rooms.map((room) => {
      return (
        <MenuItem
          key={room['.key']}
          containerElement={<Link to={`room/${room['.key']}`} />}
          style={this.getMenuStyle(room['.key'])}
        >
          {room.roomTitle}
        </MenuItem>
      )
    })
    .reverse();

    const styles = this.getStyles();

    let {
      navDrawerOpen,
      addRoomOpen,
    } = this.state;

    let docked = false;
    let showMenuIconButton = true;

    if (this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      docked = true;
      navDrawerOpen = true;
      showMenuIconButton = false;

      styles.navDrawer = {
        zIndex: styles.appBar.zIndex - 1,
      };
      styles.root.paddingLeft = 256;
    }

    return (
      <div>
        <Title render="Chat" />
        <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          title={'Chat'}
          zDepth={0}
          iconElementRight={
            <div style={styles.rightIconAvatar}>
              <span style={{marginTop: 2}}>{this.context.user.displayName}</span>
              <Avatar src={this.context.user.img} style={styles.avatar} />
            </div>
          }
          style={styles.appBar}
          showMenuIconButton={showMenuIconButton}
        />

        <div style={(styles.root)}>
          <div style={(styles.content)}>
            {this.props.content}
          </div>
        </div>

        <LeftNav
          docked={docked}
          open={navDrawerOpen}
          onRequestChange={this.handleTouchTapLeftIconButton}
          style={styles.navDrawer}
        >
          <div style={styles.logo}>
            Chat
          </div>

          <MenuItem
            onTouchTap={this.handleOpen}
            style={styles.menuHeader}
            rightIcon={<AddCircle />}
          >
            Add a Room
          </MenuItem>
          {menuItems}

        </LeftNav>

        <Dialog
          title="Room name"
          actions={actions}
          modal={false}
          open={addRoomOpen || false}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="Room Name"
            onChange={this.handleChange}
            onKeyPress={this._handleKeyPress}
          />
        </Dialog>
      </div>
    );
  }
});

export default AppWrapper;
