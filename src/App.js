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
    var content = this.props.imageHref
        ? <img src={this.props.imageHref} style={{height:'auto'}}/>
        : <span>{this.props.text}</span>;

    var classNames = "message" + (this.props.myself ? " sent-message" : " received-message");

    return (
        <div className={classNames}>
          <div className="msg-content">{content}</div>
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
            <span>Emoticon | Image</span>
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
    var currentUserCursor = this.props.currentUserCursor;
    var rows = currentUserCursor.refine('messages').value.map((record, i) => {
        return(
            <Message
                myself={record.myself}
                text={record.text}
                key={i}
                time={record.time}
                imageHref={record.imageHref}/>
        );
    });

    var spinner = <div />;

    var sendMessage = _.partial(this.props.sendMessage, _, currentUserCursor.value.id);

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
          <Compose sendMessage={sendMessage} cursor={currentUserCursor.refine('composeText')}/>
        </div>

    )
  }
});

var MessagesApp = React.createClass({
  render() {
    var controller = this.props.messagesController;

    //var userRecordIndex = _.findIndex(this.props.cursor.refine('contacts').value, {id: this.props.cursor.refine('currentUserId').value});
    //var currentUserCursor = this.props.cursor.refine('contacts', userRecordIndex);

    return (
        <div className="messages-app">
          <MessageDisplay
              isInfiniteLoading={this.props.cursor.refine('isInfiniteLoading').value}
              sendMessage={controller.sendMessage.bind(controller)}
              currentUserCursor={controller.getCurrentUserCursor()} />
          <ContactList
              contactsCursor={this.props.cursor.refine('contacts')}
              setCurrentUser={controller.setCurrentUser.bind(controller)}/>
          <pre className="diagnostics">
            { JSON.stringify(this.props.cursor.value, undefined, 2) }
          </pre>
        </div>
    );
  }
});

module.exports = MessagesApp;
