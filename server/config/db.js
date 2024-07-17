const mongoose = require('mongoose');
var debug = require('debug')('bookstore:server');

const connectDB = async () => {

    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        debug(`database connected:  ${conn.connection.host}`);

    } catch(err){
        console.log(err);
    }

}

module.exports = connectDB;