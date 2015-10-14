var DeepDiff = require('deep-diff');
import MessagesApp from './App';
import MessagesController from './MessagesController';


function entryPoint (pubnubConfig, uuid) {

  var store = atom.createAtom({
    isInfiniteLoading: false,
    currentUserId: uuid,
    composeText: '',
    present: [], // [uid]
    messages: [] // [{uid, time, messageText}]
  });

  window.cursor = ReactCursor.Cursor.build(store.deref(), store.swap);

  window.messagesController = new MessagesController(pubnubConfig, cursor);

  function queueRender (key, ref, prevVal, curVal) {
    console.log('state update: ', DeepDiff.diff(prevVal, curVal));
    var cursor = ReactCursor.Cursor.build(store.deref(), store.swap);
    messagesController.cursor = cursor;

    window.messages = React.render(
        <MessagesApp
            messagesController={messagesController}
            cursor={cursor} />, document.getElementById('root'));
  }

  store.addWatch('react-renderer', queueRender);
  queueRender('react-renderer', store, undefined, store.deref());

}

window.entryPoint = entryPoint;