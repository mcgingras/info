import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js';

class App extends Component {

  // im thinking it would be cool (and easier)
  // to have the highlight mechanism be just a comment / text thing,
  // then when you go to the webpage it has all your "untagged recent highlights"
  // then you can then sift back through and label.
  
  componentDidMount(){
    var db = firebase.database();
    var ref = db.ref('/posts/');
    ref.on('value', (snapshot) => {
      var posts = snapshot.val();
      console.log(posts);
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Xandu
        </header>
      </div>
    );
  }
}

export default App;
