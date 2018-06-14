import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './ArticleBody.css';
import { ENGINE_METHOD_DIGESTS } from 'constants';

var Article = {
  author:"Bunch Lin",
  title:"Title",
  content:"I walked into a kitchen... ",
  date:"20180530",
  tag:"car", 
  comments:[
    {
      author:"Hack Hsu",
      comment:"Great",
      star:6
    },
    {
      author:"Hack Hsu",
      comment:"Great",
      star:6
    }
  ],
  star:5
}

export default class ArticleBody extends Component {
  render(){
    console.log(">>> In AtticleBody");
    console.log(this.props.post);
    return(
      <div className="blog-post">
        <h2 class="blog-post-title">{this.props.post.title}</h2>
        <p class="blog-post-meta">{this.props.post.createdTime}<Link to={"/blogs/" + this.props.post.author}> {this.props.post.author}</Link></p>
        <p>{this.props.post.content}</p>
      </div>
    );
  }
}