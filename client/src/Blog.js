import React, { Component } from 'react';
import './Blog.css';
import Header from './Header';
import BlogPost from './BlogPost';
import PostEditor from './PostEditor';
import OneBlog from './OneBlog';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const request = require('request');
const LOCALHOST = 'http://localhost:3000';
class Blog extends Component {
  constructor(props){
    super(props);
    this.state = {
      sessionId:'',
    }
  }
  setSessionId = (id)=>{
    
    this.setState({
      sessionId: id
    });
    console.log(">>> setSessionId: " + this.state.sessionId);
  }
  render() {
    var sessionId = this.state.sessionId;//XXX: this in 
    return (
      <div className="">
        <Router>
          <div>
            <Header setSessionId={this.setSessionId}/>
            <Route exact path="/" component={Home} />
            <Route exact path="/blogs/:username" render={(props) => <OneBlog sessionId={sessionId} {...props} />} />
            <Route exact path="/blogs/:username/:postId" render={(props) => <BlogPost {...props} />} />
            <Route path="/post/:username" render={(props) => <PostEditor sessionId={sessionId} {...props}/>} />
            <Route exact path="/blogs/" component={BlogPost} />
          </div>
        </Router>
        
      </div>
      
    );
  }
}

export default Blog;



class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      users:[]
    }
  }
  componentDidMount() {
    this.fetchUserList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.postId !== this.props.match.params.postId) {
      console.log(">>> update Post");
      this.fetchUserList();
      this.setState({
        postId: parseInt(this.props.match.params.postId, 10)
      });
    }
  }
  fetchUserList = () => {
    request.get({
      url: LOCALHOST + "/users",
    },
      (error, response, body) => {
        if (error) console.log("ERR in UserList response")
        console.log(">>> In UserList fetch response...")
        let resultObj = JSON.parse(body);
        console.log(resultObj);
        if (resultObj.getUserListStatus === 'success') {
          this.setState({ users: resultObj.names});
          console.log(">>> Blog userList state:");
          console.log(this.state);

        }
      });
  }
  render(){
    return (
      <div className="container">
        <h1>Welcome to Blooog</h1>
        <p>Hi you can click the login button on the top of this page to login so as to write new post on your own.</p>
        <p>Besides, you can click the link below to see existant blogs here.</p>
        {this.state.users.map((user) => <li><Link to={"/blogs/" + user.name}>{user.name}</Link></li>)}
      </div>
    );
  }
};

