import moment from 'moment';
import shortUid from './shortUid';


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
      presence: (record) => {
        //{action: "leave", timestamp: 1444788460, uuid: "5a6892db-3166-4a5b-b4b5-1add070aeae6", occupancy: 2}
        //{action: "join", timestamp: 1444788466, uuid: "5a6892db-3166-4a5b-b4b5-1add070aeae6", occupancy: 3}
        //{action: "join", timestamp: 1445381773, data: Object, uuid: "462de233-d814-45ba-bfd3-2a77f0febae6", occupancy: 1}
        //{action: "state-change", timestamp: 1445385846, data: Object, uuid: "eea3cc59-df00-4a58-a8c9-fa9fb6ba535d", occupancy: 2}
        if (record.action === "leave") {
          const newValue = _.reject(this.cursor.refine('present').value, {uid: record.data.uid});
          this.cursor.refine('present').set(newValue);
        } else if (record.action === "join") {
          if (!!record.data) {
            this.cursor.refine('present').push([record.data]);
          }
        } else {
          console.log('Unknown action: ', record);
        }
      },
      state: {
        uid: this.cursor.refine('currentUserId').value,
        name: `Name-${shortUid()}`,
        status: 'Online'
      }
    });

    this.PUBNUB_demo.here_now({
      channel : this.channel,
      callback : (m) => {
        this.cursor.refine('present').set(m.uuids.map(x => x.state));
      },
      state: true
    });

    this.loadMoreHistory();
  }

  updateName() {
    this.PUBNUB_demo.state({
      channel  : this.channel,
      state    : {
        uid: this.cursor.refine('currentUserId').value,
        name: `Name-${shortUid()}`,
        status: 'Online'
      },
      callback : function(m){console.log(m)},
      error    : function(m){console.log(m)}
    });
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
      end: (this.cursor.refine('messages').value[0] || {}).time,
      include_token: true
    });
  }

  unsubscribe() {
    var uid = this.cursor.refine('currentUserId').value;
    this.writeToService(uid + ' unsubscribed', uid, `message-${shortUid()}`);
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