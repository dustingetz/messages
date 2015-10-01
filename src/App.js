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
    var contact = this.props.contactCursor.value
    return (
        <li>
          <div><h5>{contact.name}</h5></div>
          <div>{contact.presence}</div>
        </li>
    )
  }
});

var ContactList = React.createClass({
  render: function () {
    var contactList = this.props.cursor;
    var list = contactList.value.map((a, i) => {
      return <ContactListElement contactCursor={contactList.refine(i)}/>;
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

    var rows = this.state.contacts[this.state.currentUser].messages.map(row);

    var spinner = <div />;

    return (
        <div className="chatdemo">
          <Infinite ref="infinite"
                    className="chat"
                    maxChildren={15}
                    flipped={true}
                    containerHeight={400}
                    infiniteLoadBeginBottomOffset={50}
                    onInfiniteLoad={_.noop}
                    loadingSpinnerDelegate={spinner}
                    isInfiniteLoading={this.state.isInfiniteLoading}
                    diagnosticsDomElId="diagnostics"
              >
            {rows}
          </Infinite>
          <ContactList cursor={cursor.refine('contacts')} />
          <pre className="diagnostics" id="diagnostics"></pre>
          <div style={{clear: 'both'}}/>
        </div>
    );
  }
});

module.exports = MessagesApp;
