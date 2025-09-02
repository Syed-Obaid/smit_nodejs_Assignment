const mongoose = require('mongoose');

const uri = 'mongodb://syedbaid5_db_user:dbobaid@ac-xj7j4si-shard-00-00.bl7w47p.mongodb.net:27017,ac-xj7j4si-shard-00-01.bl7w47p.mongodb.net:27017,ac-xj7j4si-shard-00-02.bl7w47p.mongodb.net:27017/?replicaSet=atlas-4weuct-shard-0&ssl=true&authSource=admin';

async function connectDB(){
    await mongoose.connect(uri)
}

module.exports = {
    connectDB
}