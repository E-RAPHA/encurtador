// mongo.js

const mongoose = require('mongoose');

const mongoURL = 'mongodb://mongodb:27017/'


mongoose.connect(mongoURL)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'erro de conexao ao MongoDB:'));

db.once('open', () => {
  console.log('conectado ao MongoDB!');
});


module.exports = db;

