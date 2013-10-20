var mongoose = require('mongoose');

var usersColl = mongoose.Schema({
   name: String,
   uuid: String
});

var favsColl = mongoose.Schema({
	film: String,
	cinema: String,
	orario: String,
	preferenze: Array
});


function rubrica(callback, uuid) {

   mongoose.connect('mongodb://localhost/cinesrv');
   var db = mongoose.connection;

   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', function callback() {
   	console.log('I\'m in!');
   });

   db.close();
   callback('Well done!\n');
};

exports.rubrica = rubrica;