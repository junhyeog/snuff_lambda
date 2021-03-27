const mongoose = require('mongoose');
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

const restaurantModel = mongoose.model('restaurants', schema);

const makeConn = new Promise((res, rej) => {
  mongoose.connect("mongodb+srv://cluster0.vxfvn.mongodb.net", {
    user: "antemrdm",
    pass: "<pass>",
    dbName: "snuff",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
  }).then((mong) => {
    // console.log(mong);
    console.log(mong.connection.name);
    res();
  }).catch((err) => {
    console.log(err);
  });


  // mongoose.Promise = global.Promise;
  // mongoose.connect("mongodb+srv://antemrdm:<pass>@cluster0.vxfvn.mongodb.net/snuff", { useNewUrlParser: true, useUnifiedTopology: true, });
  // const db = mongoose.connection;
  // db.once('open', function () { console.log('[-] Database Connected'); });
});

async function f() {
  await makeConn;
  console.log(11111);
}


f();
console.log(2222);