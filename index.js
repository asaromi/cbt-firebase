var admin = require('firebase-admin');
var serviceAcc = require('./service_account.json');
admin.initializeApp({
    credential : admin.credential.cert(serviceAcc),
    databaseURL : "https://asaromi-dev.firebaseio.com"
});

admin.database.enableLogging(true);
var db = admin.database();
var invoicesRef = db.ref('/users');