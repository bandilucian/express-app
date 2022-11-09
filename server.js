const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION Shutting down ...');
  console.log(err.name, err.message);
});

dotenv.config({ path: './config.env' });

const app = require('./app');
// console.log(process.env.NODE_ENV);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection established1');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App runnig on port ${port}...`);
});
// am create in scripts 'start'= 'nodemon server.js' si dupaccea putem doar scrie npm start sa
// activam serverul

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION Shutting down ...');
  console.log(err)
  server.close(() => {
    process.exit(1);
  });
}); // asa prindem problemele de server

