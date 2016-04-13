import React from 'react';

import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import Firebase from 'firebase';

import TextMessage from './TextMessage';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';

const Room = React.createClass({
  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
  },
  componentWillMount() {
    const roomId = this.props.params.roomId;
    // var listRef = new Firebase("https://dazzling-inferno-1669.firebaseio.com/presence/");
    // var userRef = listRef.push();
    this.getRoomsMessages(roomId);
  },
  componentWillReceiveProps(nextProps) {
    const roomId = nextProps.params.roomId;
    if (this.props.params.roomId !== roomId) {
      this.unbind("messages");
      this.getRoomsMessages(roomId);
    }
  },

  getRoomsMessages(roomId) {
    var ref = new Firebase(`https://dazzling-inferno-1669.firebaseio.com/messages/${roomId}`);
    this.bindAsArray(ref, "messages");
  },

  componentWillUnmount() {
    this.firebaseRef.off();
  },

  handleSubmit(e) {
    if (!this.state.message) {
      return;
    }

    e.preventDefault();
    this.firebaseRefs.messages.push({
      message: this.state.message,
      user: this.context.user,
    });
    this.setState({ message: "" });
  },

  handleChange(event) {
    this.setState({
      message: event.target.value,
    });
  },

  render() {
    let messages = this.state.messages.map((message) => {
      return (
        <ListItem
          leftAvatar={<Avatar src={message.user.img} />}
          primaryText={message.user.displayName}
          secondaryText={message.message}
          secondaryTextLines={2}
          key={message['.key']}
        />
      )
    });

    return (
      <div>
        <List>
          {messages}
        </List>
        <TextMessage
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          textValue={this.state.message}
        />
      </div>
    );
  }
});

reactMixin(Room.prototype, ReactFireMixin);

export default Room;
