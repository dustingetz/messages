import moment from 'moment';

class MessagesController {
  constructor (pubnubConfig, cursor) {
    this.cursor = cursor;

    this.PUBNUB_demo = PUBNUB.init(pubnubConfig);

    this.PUBNUB_demo.subscribe({
      channel: 'demo_tutorial',
      message: (m) => console.log(m),
      presence: (record) => console.log(record)
    });
  }

  loadMoreHistory () {
    this.PUBNUB_demo.history({
      channel : 'demo_tutorial',
      count : 10,
      callback : function(m){console.log(m)},
      include_token: true
    });
  }

  sendMessage (text, uid) {
    var message = buildMessage(text, uid)
    this.cursor.refine('messages').push([message]);
    this.cursor.refine('composeText').set('');

    this.writeToService(message);
  }


  writeToService (message) {
    this.PUBNUB_demo.publish({
      channel: 'demo_tutorial',
      message: message
    });
  }
}

function buildMessage(text, uid) {
  return {
    messageText: text,
    uid: uid,
    time: moment().format()
  };
}

module.exports = MessagesController;