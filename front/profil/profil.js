const localHost = 'lohalhost';
const url = '15.236.164.81';

localStorage.getItem('token');
console.log(localStorage.getItem('token'));

import {MongoClient} from 'mongodb';

function getUsernameFromToken(token) {
    const url = 'mongodb://admin:admin@mongodb/admin?directConnection=true';
    const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

  client.connect(err => {
    const collection = client.db("connect4").collection("log");

    // Find the user with the given token
    collection.findOne({ token: token }, function(err, user) {
      if (err) throw err;

      // Return the username
      const username = user.name;
      console.log(username);
      return username;
    });

    client.close();
  });
}
