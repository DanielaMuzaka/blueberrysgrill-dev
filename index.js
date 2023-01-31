require("./config/env");
const mongoose = require("mongoose");
const app = require("./app");

const start = async () => {
  try {
    console.info(`Mongo url: ${process.env.MONGO_URI}`);
    // await mongoose.createConnection(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true
    // });
    
    await mongoose.connect(process.env.MONGO_URI);
    console.info(`Connected to MongoDb`);

    const PORT = process.env.SERVER_PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (err) {
    console.error(`Error connecting to MongoDB ${err}`);
  }
};

start()
