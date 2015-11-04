var DeepDiff = require('deep-diff');
import rot13 from './rot13';
import shortUid from './shortUid';
import MessagesApp from './App';
import MessagesController from './MessagesController';


function entryPoint (pubnubConfig) {

  var pubnubConfig = {
    publish_key: rot13(pubnubConfig.publish_key_encrypted),
    subscribe_key: rot13(pubnubConfig.subscribe_key_encrypted),
  };

  var store = atom.createAtom({
    currentUserId: `user-${shortUid()}`,
    composeText: '',
    present: [], // [user state]
    loadedAllHistory: false,
    messages: [] // [{uid, messageId, time, messageText}]
  });

  window.cursor = ReactCursor.Cursor.build(store.deref(), store.swap);

  window.messagesController = new MessagesController(pubnubConfig, cursor);

  window.onbeforeunload = () => { messagesController.unsubscribe(); }

  function queueRender (key, ref, prevVal, curVal) {
    console.log('state update: ', DeepDiff.diff(prevVal, curVal));
    window.cursor = ReactCursor.Cursor.build(store.deref(), store.swap);
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