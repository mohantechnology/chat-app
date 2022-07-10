// require('dotenv').config();
const mongoose = require('mongoose');

const DatabaseSetup = () => {
  const  DB_LINK   = process.env.NODE_ENV === "test" ? process.env.TEST_DB_LINK : process.env.DB_LINK; 
  const options = {
    retryWrites: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    w: 'majority',
  };

  mongoose.connect(DB_LINK, options)
    .then(( ) => {
      // eslint-disable-next-line no-console
      console.log('Connection to database sucessful');
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      // console.log("Failed to Connect with database");
      // console.log(err);
      setTimeout(() => {
        console.error('Retrying to connect with database.....');
        DatabaseSetup();
      }, 3000);
    });
};
module.exports = DatabaseSetup;
