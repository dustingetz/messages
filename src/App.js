var Cursor = require('react-cursor').Cursor;
import _ from 'lodash';

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

var MessageDisplay = React.createClass({
  render() {
    var rows = this.props.currentUserObj.messages.map(row);

    var spinner = <div />;

    return (
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
    )
  }
});

var MessagesApp = React.createClass({
  getInitialState: function () {
    return {
      isInfiniteLoading: false,
      currentUser: 1,
      contacts: [
        {
          id: 1,
          name: "Joe",
          presence: "Online",
          messages: []
        },
        {
          id: 2,
          name: "Bob",
          presence: "Online",
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

    var currentUserObj = _.find(this.state.contacts, {id: this.state.currentUser});
    return (
        <div className="chatdemo">
          <MessageDisplay isInfiniteLoading={this.state.isInfiniteLoading} currentUserObj={currentUserObj}/>
          <ContactList contactsCursor={cursor.refine('contacts')} setCurrentUser={cursor.refine('currentUser').set}/>
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
