import React from 'react';

import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';

class TextMessage extends React.Component {
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      return this.props.onSubmit(e);
    }
  }

  render() {
    return (
      <div>
        <TextField
          onChange={this.props.onChange}
          onKeyPress={this._handleKeyPress}
          hintText="Message..."
          value={this.props.textValue}
        />
        <FlatButton
          label="Send"
          onTouchTap={this.props.onSubmit}
          primary={true}
        />
      </div>
    );
  }
}

export default TextMessage;
