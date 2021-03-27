const mongoose = require('mongoose');

exports.makeConn = new Promise((res, rej) => {

  mongoose.connect(process.env.mongodburl, {
    user: process.env.userid,
    pass: process.env.pass,
    dbName: process.env.dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: process.env.authSource
  }).then((mong) => {
    console.log(mong);
    console.log(mong.connection.name);
    res();
  }).catch((err) => {
    console.log(err);
  });
  /*
  console.log(`[-] dburl: ${process.env.dburl}`);
  console.log(`[-] dbName: ${process.env.dbName}`);
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.dburl, { useNewUrlParser: true, useUnifiedTopology: true, });
  const db = mongoose.connection;
  db.once('open', function () { console.log('[-] Database Connected'); });
  */
});

const schema = new mongoose.Schema({
  name: {
    type: String
  },
  url: {
    type: String
  },
  date: {
    type: String
  },
  locate: {
    type: String
  },
  foodtype: {
    type: String
  },
  tags: [{
    type: String
  }],
  summary: {
    type: String
  },
  imgs: [{
    type: String
  }],
  desc: {
    type: String
  }
});

exports.restaurantModel = mongoose.model('restaurants', schema);
