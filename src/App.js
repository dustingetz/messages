var Cursor = require('react-cursor').Cursor;
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
      this.props.sendMessage(this.props.cursor.value, this.props.cursor.id);
    }
  }
});

var MessageDisplay = React.createClass({
  render() {
    var currentUserCursor = this.props.currentUserCursor;
    var rows = currentUserCursor.refine('messages').value.map(row);

    var spinner = <div />;

    var sendMessage = (text) => {
      currentUserCursor.refine('messages').push([buildMessage(text)]);
      currentUserCursor.refine('composeText').set('');

      this.props.sendMessage(text, currentUserCursor.refine('id').value);
    };

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

function buildMessage(text, myself, imageHref) {
  return {
    myself: !!myself,
    time: moment().format(),
    text: text,
    imageHref: imageHref
  };
}

function sendMessage (text, uid) {
  console.log('Sending message \'' + text + '\'' + ' to uid: '+ uid);
  // todo message back
}

var MessagesApp = React.createClass({
  getInitialState: function () {
    return {
      isInfiniteLoading: false,
      currentUserId: 1,
      contacts: [
        {
          id: 1,
          name: "Joe",
          presence: "Online",
          composeText: '',
          messages: []
        },
        {
          id: 2,
          name: "Bob",
          presence: "Online",
          composeText: '',
          messages: [
            {
              myself: true,
              time: '5:02pm',
              text: "bobobbobboo",
              imageHref: true ? "/stock-smiley-small.jpeg" : null
            },
            {
              myself: true,
              time: '5:02pm',
              text: "boasdbfoadsfbosadf",
              imageHref: true ? "/stock-smiley-small.jpeg" : null
            },
            {
              myself: true,
              time: '5:02pm',
              text: "bobadbfodsaf",
              imageHref: true ? "/stock-smiley-small.jpeg" : null
            }
          ]
        }
      ]
    };
  },

  render() {
    var cursor = this.cursor = Cursor.build(this);

    var userRecordIndex = _.findIndex(this.state.contacts, {id: this.state.currentUserId});
    var currentUserCursor = cursor.refine('contacts', userRecordIndex);



    return (
        <div className="chatdemo">
          <MessageDisplay
              isInfiniteLoading={this.state.isInfiniteLoading}
              sendMessage={sendMessage}
              currentUserCursor={currentUserCursor} />
          <ContactList contactsCursor={cursor.refine('contacts')} setCurrentUser={cursor.refine('currentUserId').set}/>
          <div style={{clear: 'both'}}/>
          <pre className="diagnostics">
            { JSON.stringify(this.state, undefined, 2) }
          </pre>
          <div style={{clear: 'both'}}/>
        </div>
    );
  }
});

module.exports = MessagesApp;
