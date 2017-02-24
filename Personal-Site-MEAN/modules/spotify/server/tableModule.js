var MongoClient = require("mongodb").MongoClient;
var keys = require('./privateKeys');

/**
 * Connects to song database on MongoDB server hosted in Azure
 */
function connectToDb() {
    return new Promise(function (resolve, reject) {
        var url = keys.mongo_server + 'songs?ssl=true';
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                //console.log('Connected to db: ' + db.databaseName);
                resolve(db);
            }
            else {
                reject('Could not detect to db');
            }
        });
    });
}

/**
 * Given a year, returns the Billboard Hot 100 songs for that year, sorted by chart position
*/
exports.getYearList = function (year) {
    return new Promise(function (resolve, reject) {
        connectToDb().then(function (db) {
            var col = db.collection('songs');
            col.find({ 'Year': parseInt(year) }).sort([['Position', 1]]).toArray(function (err, docs) {
                if (err == null && docs.length > 0) {
                    resolve(docs);
                }
                else {
                    reject('Could not find year list');
                }
            });
        });   
    });
}

