import _ from 'lodash';
import moment from 'moment';
import './styles.less'

var Message = React.createClass({
  propTypes: {
    myself: React.PropTypes.bool,
    text: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired
  },

  render: function () {
    var classNames = "message" + (this.props.myself ? " sent-message" : " received-message");

    return (
        <div className={classNames}>
          <div className="msg-content">
            <span>{this.props.text}</span>
          </div>
          <time>{this.props.time}</time>
        </div>
    );
  }
});

var ContactListElement = React.createClass({
  render() {
    var contact = this.props.contactCursor.value;

    var updateUserFn = () => {
      this.props.setCurrentUser(contact.id);
    };

    return (
        <li className="contact">
          <a onClick={updateUserFn}>
            <h5>{contact.name}</h5>
            <span>{contact.presence}</span>
          </a>
        </li>
    )
  }
});

var ContactList = React.createClass({
  render: function () {
    var contactList = this.props.contactsCursor;
    var list = contactList.value.map((a, i) => {
      return <ContactListElement contactCursor={contactList.refine(i)} setCurrentUser={this.props.setCurrentUser}/>;
    });

    return (
        <div className="contact-list">
          <span><h1>Friends {contactList.value.length}</h1></span>
          <ul>{list}</ul>
        </div>
    );
  }
});

var randInt = (i) => {return 1;};

var Compose = React.createClass({
  render () {
    return (
        <div className="composition-area">
            <textarea
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
                value={this.props.cursor.value} />
        </div>
    );
  },

  onChange(e) {
    this.props.cursor.set(e.target.value);
  },

  onKeyDown (e) {
    if (e.keyCode == 13) {
      console.log('enter pressed');
      e.preventDefault();
      this.props.sendMessage(this.props.cursor.value);
    }
  }
});

var MessageDisplay = React.createClass({
  render() {
    var rows = this.props.messages.map((record, i) => {
        return(
            <Message
                myself={record.uid === this.props.currentUserId}
                text={record.messageText}
                key={i}
                time={record.time} />
        );
    });

    var spinner = <div />;

    var sendMessage = _.partial(this.props.sendMessage, _, this.props.currentUserId);

    return (
        <div className="message-display">
          <Infinite ref="infinite"
                    className="message-list"
                    maxChildren={15}
                    containerHeight={400}
                    infiniteLoadBeginBottomOffset={50}
                    onInfiniteLoad={_.noop}
                    loadingSpinnerDelegate={spinner}
                    isInfiniteLoading={this.props.isInfiniteLoading}
                    diagnosticsDomElId="diagnostics"
              >
            {rows}
          </Infinite>
          <Compose sendMessage={sendMessage} cursor={this.props.composeTextCursor}/>
        </div>

    )
  }
});

var MessagesApp = React.createClass({
  render() {
    var controller = this.props.messagesController;

    return (
        <div className="messages-app">
          <MessageDisplay
              isInfiniteLoading={this.props.cursor.refine('isInfiniteLoading').value}
              sendMessage={controller.sendMessage.bind(controller)}
              currentUserId={this.props.cursor.refine('currentUserId').value}
              messages={this.props.cursor.refine('messages').value}
              composeTextCursor={this.props.cursor.refine('composeText')}/>
          {/*<ContactList
              contactsCursor={this.props.cursor.refine('contacts')}
              setCurrentUser={controller.setCurrentUser.bind(controller)}/>*/}
          <pre className="diagnostics">
            { JSON.stringify(this.props.cursor.value, undefined, 2) }
          </pre>
        </div>
    );
  }
});

module.exports = MessagesApp;
