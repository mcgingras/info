import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyBkMWxc0YHlwFalLZCHTMeEJcDBBHp95_c",
  authDomain: "xanadu-info.firebaseapp.com",
  databaseURL: "https://xanadu-info.firebaseio.com",
  projectId: "xanadu-info",
  storageBucket: "xanadu-info.appspot.com",
  messagingSenderId: "508636680956"
};
firebase.initializeApp(config);

export default firebase;
