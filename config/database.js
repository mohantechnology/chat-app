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
      console.info('Connection to database sucessful');
    } catch (err) {
      console.error("Failed to Connect with database"); 
      await sleep(1000);
      await  connectToDatabase();
    }
  }

  await connectToDatabase();
 
};

// // If the Node process ends, close the Mongoose connection
// process.on('SIGINT', function() {
//   closeConnection()
// });

// async function closeConnection(){
//   mongoose.connection.close(function () {
//     console.info('Mongoose disconnected on app terminatio');
//     process.exit(0);
//   });
// }

// [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
//   process.on(eventType,closeConnection);
// })
module.exports = DatabaseSetup;
