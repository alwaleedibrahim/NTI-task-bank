const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const { DB_URI, DB_NAME } = process.env;
const myConnection = (cb) => {
  MongoClient.connect(DB_URI, {}, (err, client) => {
    if (err) return cb(err, false, false);
    const db = client.db(DB_NAME);
    cb(false, client, db);
  });
};
module.exports = myConnection;
