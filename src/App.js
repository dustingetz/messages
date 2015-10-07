import _ from 'lodash';
import moment from 'moment';

var ChatRow = React.createClass({

  propTypes: {
    myself: React.PropTypes.bool,
    text: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired
  },

  render: function () {
    var maybeImg = this.props.imageHref
        ? <img src={this.props.imageHref} style={{height:'auto'}}/>
        : null;

    return (
        <div className="infinite-list-item">
          <time>{this.props.time}</time>
          <span>{this.props.text}</span>
          <div>{maybeImg}</div>
        </div>
    );
  }
});

function row (record, i) {
  return <ChatRow myself={record.myself}
                  text={record.text}
                  key={i}
                  time={record.time}
                  imageHref={record.imageHref}/>;
}

var ContactListElement = React.createClass({
  render() {
    var contact = this.props.contactCursor.value;

    var updateUserFn = () => {
      this.props.setCurrentUser(contact.id);
    };

    return (
        <li>
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
        <div>
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
        <textarea onKeyDown={this.onKeyDown} onChange={this.onChange} value={this.props.cursor.value} />
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
    var rows = currentUserCursor.refine('messages').value.map(row);

    var spinner = <div />;

    var sendMessage = _.partial(this.props.sendMessage, _, currentUserCursor.value.id);

    return (
        <div>
          <Infinite ref="infinite"
                    className="chat"
                    maxChildren={15}
                    flipped={true}
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
        <div className="chatdemo">
          <MessageDisplay
              isInfiniteLoading={this.props.cursor.refine('isInfiniteLoading').value}
              sendMessage={controller.sendMessage.bind(controller)}
              currentUserCursor={controller.getCurrentUserCursor()} />
          <ContactList contactsCursor={this.props.cursor.refine('contacts')} setCurrentUser={controller.setCurrentUser.bind(controller)}/>
          <div style={{clear: 'both'}}/>
          <pre className="diagnostics">
            { JSON.stringify(this.props.cursor.value, undefined, 2) }
          </pre>
          <div style={{clear: 'both'}}/>
        </div>
    );
  }
});

module.exports = MessagesApp;
