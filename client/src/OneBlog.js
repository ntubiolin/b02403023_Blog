import React, { Component } from 'react';
import "./OneBlog.css";
import { withRouter ,Link} from "react-router-dom";
const request = require('request');
const LOCALHOST = 'http://localhost:3000';
class OneBlog extends Component {
  constructor(props){
    super(props);
    this.state = { 
      posts:[],
      username: this.props.match.params.username,
      sessionId: this.props.sessionId,//XXX: this.state.sessionId would not update with this.props.sessionId
    };
    console.log(">>> Constructing OneBlog, sessionId:" + this.props.sessionId);
    request.get({
      url: LOCALHOST + "/posts",
      qs: { name: this.props.match.params.username }
    },
      (error, response, body) => {
        if(error)console.log("ERR in OneBlog response")
        console.log(">>> In OneBlog fetch response...")
        //let resultObj = JSON.parse(body);
        let resultObj = JSON.parse(body);
        console.log(resultObj.myPostStatus);
        
        if (resultObj.myPostStatus === 'success') {
          console.log(resultObj.posts);
          this.setState({ posts: resultObj.posts });
          console.log(">>> OneBlog state:");
          console.log(this.state);
        }
      });
  }
  componentDidMount(){
    console.log(">>> In componentDidMount");
    
    
    
  }
  
  render(){
    console.log(">>> In OneBlog rendering")
    console.log(this.state.posts);
    return(
      <div className="container">
        <div className="jumbotron">
          <h1>
            Welcome to {this.props.match.params.username}'s blog
          </h1>
          <p>Here is the list of all my posts!</p>
        </div>
        <div className="row">
          {this.state.posts.map((article) =>  <ArticleCard {... article}/>)}
        </div>
      </div>
    );
  }
}
export default withRouter(OneBlog);
const ArticleCard = (props) =>{
  return(
    <div className="col-6 col-lg-4">
      <h2>{props.title}</h2>
      <p>{props.content}</p>
      <p>
        <Link class="btn btn-secondary" to={"/blogs/"+ props.author+ "/" + props.postId} >View details »</Link>
      </p>
    </div>
  );
}
