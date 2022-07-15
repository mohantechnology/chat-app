// require('dotenv').config();
const mongoose = require('mongoose');
const { sleep } = require('../utils/utilFunc');

const DatabaseSetup = async () => {
  const DB_LINK = process.env.NODE_ENV === "test" ? process.env.TEST_DB_LINK : process.env.DB_LINK;
  const options = {
    retryWrites: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    w: 'majority',
  };

  if( !DB_LINK){
    throw new Error ("Invalid DB_LINK value");
  }

  async function connectToDatabase() { 
    try {
      await mongoose.connect(DB_LINK, options);
      // eslint-disable-next-line no-console
      console.log('Connection to database sucessful');
    } catch (err) {
      console.error("Failed to Connect with database");
      // console.log(err);
      await sleep(1000);
      await  connectToDatabase();
    }
  }

  await connectToDatabase();

  //  await  mongoose.connect(DB_LINK, options)

  //  console.log("before sleep")

  //  await  sleep(1000);
  // console.log("before")

  // console.log("after")
  //   .then(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('Connection to database sucessful');
  // })
  // // eslint-disable-next-line no-unused-vars
  // .catch(async(err) => {
  //   // console.log("Failed to Connect with database");
  //   // console.log(err);
  //   // setTimeout(() => {
  //   //   console.error('Retrying to connect with database.....');
  //   //   DatabaseSetup();
  //   // }, 3000);

  // });
};
module.exports = DatabaseSetup;
