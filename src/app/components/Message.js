import React from 'react';

import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';

class Message extends React.Component {
  render() {
    return (
      <Card>
        <CardText>
          {this.props.text}
        </CardText>
      </Card>
    );
  }
}

export default Message;
