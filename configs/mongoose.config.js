const mongoose = require('mongoose');

mongoose.connect('mongodb://cluster0-shard-00-00-zcbxr.mongodb.net:27017/main', {
  user: 'test',
  pass: 'test',
  useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connection.on('connected', () => {
  console.log('mongo connected');
});

mongoose.connection.on('error', err => {
  console.log(err);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongodb connection closed');
});

process.on('SIGINT', () => {
  mongoose.connection.close( () => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

