import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js';

import Card from './components/card';

class App extends Component {

  // im thinking it would be cool (and easier)
  // to have the highlight mechanism be just a comment / text thing,
  // then when you go to the webpage it has all your "untagged recent highlights"
  // then you can then sift back through and label.

  constructor(props){
    super(props);

    this.state = {
      posts: {}
    }
  }

  // ability to be writing a paper and link in the blocks that you highlight DIRECTLY IN...

  componentDidMount(){
    var db = firebase.database();
    var ref = db.ref('/posts/');
    ref.on('value', (snapshot) => {
      var posts = snapshot.val();
      console.log(posts);
      this.setState({
        posts: posts
      })
    })
  }

  renderPosts(){
    return (
    Object.keys(this.state.posts).map((key) => {
      const post = this.state.posts[key];
      // im thinking we could create a card component here...
      return (
        <Card
          key={key}
          post={post}
        />
      )
    })
   )
  }

  render() {
    return (
      <div className="App">
        {this.renderPosts()}
      </div>
    );
  }
}

export default App;
