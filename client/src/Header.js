import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import './Header.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
var serverURL = "http://localhost:5000";

export default class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLogined: false,
      userName: "NA",
      userEmail: "xxx@a.com",
      userProfileURL: "http://",
      sessionKey:"LALALA"
    };
  }
  componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://apis.google.com/js/platform.js";    
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
    //<script src="https://apis.google.com/js/platform.js" async defer></script>
  
  }
  responseGoogle = (response) => {
    //console.log(response.tokenObj.id_token);
    fetch("/registration/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: response.tokenObj.id_token,
        email: response.profileObj.email,
        familyName: response.profileObj.familyName,
        givenName: response.profileObj.givenName,
        imageUrl: response.profileObj.imageUrl
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((result) =>{
      console.log(response);
      if(result.loginStatus === 'success'){
        console.log("change the bar");
        this.setState({
          isLogined:true,
          userName: response.profileObj.name,//.replace(/\s+/g, '_'),
          userEmail: response.profileObj.email,
          userProfileURL: response.profileObj.imageUrl,
          sessionKey:result.sessionId
        });
        this.props.setSessionId(result.sessionId);
        console.log(this.state)
        
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  render(){
    //XXX: login align right issue
    return(
      <div className="header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">Blooog</Link> 
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            
              
              <LoginBtn isLogined={this.state.isLogined} responseGoogle={this.responseGoogle}
                userName={this.state.userName} userEmail={this.state.userEmail}
                userProfileURL={this.state.userProfileURL}/>
         
            
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>
      </div>
    );
  }
}


const LoginBtn = (props)=>{
  console.log(props);
  var notLoginBtn =
    <ul className="navbar-nav mr-auto">
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="fas fa-user fa-fw"></i> Login
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          Login via:
            <div className="dropdown-item">
            <GoogleLogin
              clientId="996100624897-1o5d50v1lnk813m8vu1q71h5anov542v.apps.googleusercontent.com"
              onSuccess={props.responseGoogle}
              onFailure={props.responseGoogle}>
              <i className="fab fa-google"></i>  Google Login
            </GoogleLogin>
          </div>
        </div>
      </li>
    </ul>
  var loginedBtn = 
    <ul className="navbar-nav mr-auto">
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <img src={props.userProfileURL} class="avatar" alt="Pic"/>{props.userName}
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <div className="dropdown-item">
            <GoogleLogin
              clientId="996100624897-1o5d50v1lnk813m8vu1q71h5anov542v.apps.googleusercontent.com"
              onSuccess={props.responseGoogle}
              onFailure={props.responseGoogle}>
              <i className="fab fa-google"></i>  Log out
            </GoogleLogin>
          </div>
        </div>
      </li>
      <li class="nav-item">
        <Link to={"/post/" + props.userName} className="nav-link"><i className="fas fa-plus-circle fa-fw"></i>Write a new post</Link>
      </li>
      
    </ul>
  return(
    props.isLogined ? loginedBtn : notLoginBtn
  )
}