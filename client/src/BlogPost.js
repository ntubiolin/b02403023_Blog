import React, { Component } from 'react';
import ListOfArticles from './ListOfArticles';
import ArticleBody from './ArticleBody';
const request = require('request');
const LOCALHOST = 'http://localhost:3000';

export default class BlogPost extends Component {
  constructor(props){
    super(props);
    this.state = {
      posts: [],
      username: this.props.match.params.username,
      postId: parseInt(this.props.match.params.postId,10),
      thisPost:{
        title:"testTitle",
        createdTime:"20180614",
        author:"LIN LIN",
        content:"LALALA"
      }
    };
    
  }
  componentDidMount() {
    this.fetchPost();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.postId !== this.props.match.params.postId) {
      console.log(">>> update Post");
      this.fetchPost();
      this.setState({
        postId: parseInt(this.props.match.params.postId, 10)
      });
    }
  }
  fetchPost = ()=>{
    request.get({
      url: LOCALHOST + "/posts",
      qs: { name: this.props.match.params.username }
    },
      (error, response, body) => {
        if (error) console.log("ERR in BlogPost response")
        console.log(">>> In BlogPost fetch response...")
        let resultObj = JSON.parse(body);
        if (resultObj.myPostStatus === 'success') {
          //console.log(resultObj.posts);
          console.log(this.state.postId);
          this.setState({ posts: resultObj.posts, thisPost: resultObj.posts.filter(x => x.postId == this.state.postId)[0] });
          console.log(">>> BlogPost state:");
          console.log(this.state);

        }
      });
  }
  render(){
    return(
      <div className = "Blog container-fluid" >
        <div className="row">
          <div className="col-sm">
            <ArticleBody post={this.state.thisPost}/>
            <div>
              <hr/>
              <h6>more related articles:</h6>
            </div>
            <ListOfArticles posts={this.state.posts}/>
          </div>
          <div className="col-sm-1">
          </div>
        </div>
      </div>
    );
  };
  
}