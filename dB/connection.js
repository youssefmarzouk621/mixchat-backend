const mongoose = require('mongoose');

const URI ="mongodb+srv://dbYoussef:TCYvRcsjNcpcVZZz@mixchatcluster.mwvgy.mongodb.net/mixchatdb?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;