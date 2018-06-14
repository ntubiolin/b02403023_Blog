import React, { Component } from 'react';
import "./PostEditor.css";
import { withRouter ,Link} from "react-router-dom";
const generate_post_id = ()=>{
  return Math.floor(Math.random() * 90000000000000000) + 10000000000000000;
}
class PostEditor extends Component {
  constructor(props){
    super(props);
    console.log(">>> postEditor sessioID: ");
    console.log(this.props);
    this.state = { 
      title: '',
      content: '',
      username: this.props.match.params.username,
      sessionId: this.props.sessionId,//XXX: this.state.sessionId would not update with this.props.sessionId
      isSubmit: false
    };
  }
  handleSubmit = (event) =>{
    event.preventDefault();
    if(this.state.title === "" || this.state.content === ""){
      alert("Title or content is empty! Please check your post again!");
    }else{
      console.log(">>> post a post:" + this.state.title);
      console.log(this.state.content);
      console.log(this.props.sessionId);
      fetch("/postSubmission/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: this.state.username,
          title: this.state.title,
          content: this.state.content,
          sessionId: this.props.sessionId,
          generate_post_id: generate_post_id()
        })
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          console.log(result);
          if (result.submissionStatus === 'success') {
            this.setState({ isSubmit: true });
            console.log(">>> Check isSubmit");
            console.log(this.state);
            this.props.history.push("/blogs/" + this.props.match.params.username);//FIXME: withRoute not working...
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  handleTitleChange = (event) =>{
    this.setState({ title: event.target.value });
    
  }
  handleContentChange = (event) => {
    this.setState({ content: event.target.value });
  }
  render(){
    var isSubmitBtn = this.state.isSubmit ? //XXX need to be turned back to original style
      <Link to={"/blogs/" + this.state.username} className="btn btn-primary done"/>
    : <button type="submit" className="btn btn-primary">Submit</button>
    return(
      <div className="container">
        <h1>
          Hi {this.props.match.params.username}! Let's edit you own post!
        </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="titleInput">Post title</label>
            <input type="text" className="form-control" id="titleInput" placeholder="Enter title here..." value={this.state.title} onChange={this.handleTitleChange}/>
          </div>  
          <div className="form-group">
            <label htmlFor="FormControlTextarea">Content</label>
            <textarea className="form-control" id="FormControlTextarea" rows="10" value={this.state.content} onChange={this.handleContentChange}></textarea>
          </div>
          {isSubmitBtn}
        </form>
      </div>
    );
  }
}
export default withRouter(PostEditor);