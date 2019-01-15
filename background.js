// this file will run once on extension load
var config = {
  apiKey: "AIzaSyBkMWxc0YHlwFalLZCHTMeEJcDBBHp95_c",
  authDomain: "xanadu-info.firebaseapp.com",
  databaseURL: "https://xanadu-info.firebaseio.com",
  projectId: "xanadu-info",
  storageBucket: "xanadu-info.appspot.com",
  messagingSenderId: "508636680956"
};
const app = firebase.initializeApp(config);
const appDb = app.database().ref();
const db = app.database();


// instantiate global application state object for Chrome Storage and feed in firebase data
// Chrome Storage will store our global state as a a JSON stringified value.

const applicationState = { values: [] };

appDb.on('child_added', snapshot => {
  applicationState.values.push({
    id: snapshot.key,
    value: snapshot.val()
  });
  updateState(applicationState);
});

appDb.on('child_removed', snapshot => {
  const childPosition = getChildIndex(applicationState, snapshot.key)
  if (childPosition === -1) return
  applicationState.values.splice(childPosition, 1);
  updateState(applicationState);
});

appDb.on('child_changed', snapshot => {
  const childPosition = getChildIndex(applicationState, snapshot.key)
  if (childPosition === -1) return
  applicationState.values[childPosition] = snapshot.val();
  updateState(applicationState);
});

// updateState is a function that writes the changes to Chrome Storage
function updateState(applicationState) {
  chrome.storage.local.set({ state: JSON.stringify(applicationState) });
}

// getChildIndex will return the matching element in the object
function getChildIndex(appState, id) {
  return appState.values.findIndex(element => element.id == id)
}

// if your Chrome Extension requires any content scripts that will manipulate data,
// add a message listener here to access appDb:

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'addData':
      console.log(db);
      console.log(msg.data);
      db.ref('test/').set(msg.data);
      response('success');
      break;
    default:
      response('unknown request');
      break;
  }
});
