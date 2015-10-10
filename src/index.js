var DeepDiff = require('deep-diff');
import MessagesApp from './App';
import MessagesController from './MessagesController';

var stateAtom = atom.createAtom({
  isInfiniteLoading: false,
  currentUserId: 2,
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
          myself: false,
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
});

var cursor = ReactCursor.Cursor.build(stateAtom.deref(), stateAtom.swap);

var messagesController = new MessagesController(cursor);


function queueRender (key, ref, prevVal, curVal) {
  console.log('state update: ', DeepDiff.diff(prevVal, curVal));
  var cursor = ReactCursor.Cursor.build(stateAtom.deref(), stateAtom.swap);
  messagesController.cursor = cursor;

  window.messages = React.render(
      <MessagesApp
          messagesController={messagesController}
          cursor={cursor} />, document.getElementById('root'));
}

stateAtom.addWatch('react-renderer', queueRender);
queueRender('react-renderer', stateAtom, undefined, stateAtom.deref());


