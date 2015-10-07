import moment from 'moment';

class MessagesController {
  constructor (cursor) {
    this.cursor = cursor;
  }

  setCurrentUser(uid) {
    this.cursor.refine('currentUserId').set(uid);
  }

  getCurrentUserCursor() {
    return findContactCursorByUID(this.cursor.refine('currentUserId').value, this.cursor.refine('contacts'));
  }

  sendMessage (text, uid) {
    var contactCursor = findContactCursorByUID(uid, this.cursor.refine('contacts'));

    contactCursor.refine('messages').push([buildMessage(text)]);
    contactCursor.refine('composeText').set('');

    this.writeToService(text, contactCursor.refine('id').value);
  }


  writeToService (text, uid) {
    console.log('Sending message \'' + text + '\'' + ' to uid: '+ uid);
    // todo message back
  }
}

function findContactCursorByUID(uid, contactsCursor) {
  var userRecordIndex = _.findIndex(contactsCursor.value, {id: uid});
  return contactsCursor.refine(userRecordIndex);
}

function buildMessage(text, myself, imageHref) {
  return {
    myself: !!myself,
    time: moment().format(),
    text: text,
    imageHref: imageHref
  };
}

module.exports = MessagesController;