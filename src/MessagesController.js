import moment from 'moment';

class MessagesController {
  constructor (pubnubConfig, cursor) {
    this.cursor = cursor;

    this.PUBNUB_demo = PUBNUB.init(pubnubConfig);

    this.PUBNUB_demo.subscribe({
      channel: 'demo_tutorial',
      message: (msg, envelope) => {
        var ts = envelope[1];
        var messagesCursor = this.cursor.refine('messages');
        var index = _.findIndex(messagesCursor.value, { messageId: msg.messageId });
        var newRecord = _.extend({}, msg, {time: ts});
        if (index === -1) {
          messagesCursor.push([newRecord]);
        }
        else {
          messagesCursor.refine(index).set(newRecord);
        }
      },
      presence: (record) => console.log(record)
    });

    this.loadMoreHistory();
  }

  loadMoreHistory () {
    this.PUBNUB_demo.history({
      channel : 'demo_tutorial',
      count : 10,
      callback : (history) => {

        /*
         0: Array[10]
         0: Object {
          message: Object
          timetoken: 14447847479410428
         }
         */
        var messages = _.map(history[0], (historyObj) => {
          return _.extend({}, historyObj.message, {time: historyObj.timetoken});
        });
        this.cursor.refine('messages').unshift(messages);
      },
      include_token: true
    });
  }

  sendMessage (text, uid) {
    var msgId = PUBNUB.uuid();
    var message = {
    messageText: text,
        uid: uid,
        messageId: msgId,
        time: moment().format()
  };
    this.cursor.refine('messages').push([message]);
    this.cursor.refine('composeText').set('');

    this.writeToService(text, uid, msgId);
  }


  writeToService (text, uid, msgId) {
    this.PUBNUB_demo.publish({
      channel: 'demo_tutorial',
      message: {
        messageText: text,
        uid: uid,
        messageId: msgId
      }
    });
  }
}

module.exports = MessagesController;