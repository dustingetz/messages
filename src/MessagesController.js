import moment from 'moment';

class MessagesController {
  constructor (pubnubConfig, cursor) {
    this.cursor = cursor;
    this.channel = 'demo_tutorial';

    this.PUBNUB_demo = PUBNUB.init(pubnubConfig);

    this.PUBNUB_demo.subscribe({
      channel: this.channel,
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
      channel : this.channel,
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
        this.cursor.refine('messages').push(messages);
      },
      include_token: true
    });
  }

  unsubscribe() {
    var uid = this.cursor.refine('currentUserId').value;
    this.writeToService(uid + ' unsubscribed', uid, PUBNUB.uuid());
    this.PUBNUB_demo.unsubscribe({
      channel: this.channel
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
      channel: this.channel,
      message: {
        messageText: text,
        uid: uid,
        messageId: msgId
      }
    });
  }
}

module.exports = MessagesController;