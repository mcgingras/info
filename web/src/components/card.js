import React from 'react';

const card = (props) => {

  return(
    <div className="card">
        <label>Highlight</label>
        <p>{props.post.highlight}</p>
        <label>Comment</label>
        <p>{props.post.comment}</p>
    </div>
  )

}

export default card;
