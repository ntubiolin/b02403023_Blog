var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var insertDocuments = function (db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    { a: 1 }, { a: 2 }, { a: 3 }
  ], function (err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
var findDocuments = function (db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
// Connect to the db
MongoClient.connect("mongodb://localhost:27017/mymondb", function (err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function () {
    findDocuments(db, function () {
      db.close();
    });
  });
});
