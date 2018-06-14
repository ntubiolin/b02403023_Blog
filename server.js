const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const moment = require('moment');
const crypto = require('crypto');
var DB_URL = "mongodb://webprogramming:w1e2b3p4ro@ds159400.mlab.com:59400/mymondb";
var now = moment();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var googleAPIURL = "996100624897-1o5d50v1lnk813m8vu1q71h5anov542v.apps.googleusercontent.com"
var generate_key = function () {
  var sha = crypto.createHash('sha256');
  sha.update(Math.random().toString());
  return sha.digest('hex');
};
var testSessionId = "181f6269ddec074bb8fd616a0783d5a0fd276706363c63808a7ea7ae1291c60c";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});
app.get('/posts', (req, res) => {
  console.log(">>> Retreving posts written by " + req.query.name);
  console.log(req.query);  
  MongoClient.connect(DB_URL, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    filterPostsByName(db, req.query.name, (posts) => {
      let returnJson = { myPostStatus: 'success', posts:posts[0].post };//XXX: [0].post is odd
      //console.log(">>> registration return obj:");
      console.log(returnJson);
      res.send(returnJson)
      db.close();
    })
  });
});
app.get('/users', (req, res) => {
  console.log(">>> Retreving all users");
  MongoClient.connect(DB_URL, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    getUserList(db, (names) => {
      //names = res.json(names)
      let returnJson = { getUserListStatus: 'success', names: names };//XXX: Failed post insertion is not handled
      console.log(">>> userList return obj:");
      console.log(names);
      res.send(returnJson)
      db.close();
    })
  });
});
app.post('/registration/', (req, res) => {
  //console.log(JSON.parse(req.body));
  //  console.log(req.body);
  let id_token = req.body.id_token;
  let sessionId = generate_key();
  console.log(">>> GOOGLE verification");
  axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token)
    .then(response => {
      if (response.data.aud === googleAPIURL){
        MongoClient.connect(DB_URL, function (err, db) {
          assert.equal(null, err);
          console.log("Connected successfully to server");
          let userData = {
            email: response.data.email,
            name: response.data.name,
            photoURL: response.data.picture,
          }
          insertUsrOnce(db, userData, sessionId, function () {
            db.close();
          });
        });
      }else{
        console.log(">>> WARNING: token source not verified!")
      }
      
      
    }
    ).then(() =>{
      let returnJson = { loginStatus: 'success', sessionId: sessionId };
      console.log(">>> registration return obj:");
      console.log(returnJson);
      res.send(returnJson)
      }
    )
    .catch((error) => {
      console.error(error);
      res.send({ loginStatus: 'failed' })
    });
  
});
app.post('/postSubmission/', (req, res) => {
  console.log(">>> Receive postSubmission");
  console.log(req.body);
  MongoClient.connect(DB_URL, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    let post = {
      author: req.body.author,
      title: req.body.title,
      content: req. body.content,
      createdTime: now.format("YYYY-MM-DD HH:mm:ss Z"),
      postId: req.body.generate_post_id
    }
    let sessionId = req.body.sessionId;
    insertPost(db, sessionId, post, ()=>{
      let returnJson = { submissionStatus: 'success'};//XXX: Failed post insertion is not handled
      //console.log(">>> registration return obj:");
      //console.log(returnJson);
      res.send(returnJson)
      db.close();
    })
  });

});
app.listen(port, () => console.log(`Listening on port ${port}`));

var insertUsrOnce = function (db,userData, sessionId, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  //TODO:  $set: { lastLoginTime: now.format("YYYY-MM-DD HH:mm:ss Z")}, and SESSION KEY
  collection.update(
    userData, 
    { 
      $set: {
        joinedTime: now.format("YYYY-MM-DD HH:mm:ss Z"),
        sessionId: sessionId
      }
    },
    {upsert : true}, function (err, result){
      assert.equal(err, null);
      callback(result);
  });
  
  // Insert some documents
  /*
  console.log(userData);
  collection.insert([
    userData
  ], function (err, result) {
    assert.equal(err, null);
    callback(result);
  });
  */
}
var insertPost = function (db, sessionId, post, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  //TODO:  $set: { lastLoginTime: now.format("YYYY-MM-DD HH:mm:ss Z")}, and SESSION KEY
  collection.update(
    { sessionId: sessionId },
    {
      $push: {
        post: post,
      }
    },
    { upsert: true }, function (err, result) {
      assert.equal(err, null);
      callback(result);
    });
}
var filterPostsByName = function (db, name, callback) {
  console.log(">>> In filterPost, and name: " + name);

  // Get the documents collection
  var collection = db.collection('documents');
  //TODO:  $set: { lastLoginTime: now.format("YYYY-MM-DD HH:mm:ss Z")}, and SESSION KEY
  collection.find(
    { name: name },
    { post : 1 , _id: 0}    
  ).toArray((err, result) => {
    assert.equal(err, null);
    console.log(result)
    callback(result);
  });

}
var getUserList = function (db, callback) {
  console.log(">>> In getUserList()");

  // Get the documents collection
  var collection = db.collection('documents');
  //TODO:  $set: { lastLoginTime: now.format("YYYY-MM-DD HH:mm:ss Z")}, and SESSION KEY
  collection.find(
    {},
    { name: 1, _id:0 }
  ).toArray(
    (err, result) => {
      assert.equal(err, null);
      console.log(result)
      callback(result);
    });

}