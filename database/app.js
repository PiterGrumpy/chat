import express from 'express';
import mongoose from 'mongoose';
import { routes } from "./routes/main.js";
import { engine } from 'express-handlebars';

const PORT = 3000;
const app = express();

//Web Aplication Mongoose
app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", PORT);
})

//Mongoose
mongoose.connect(
  `mongodb://root:pass12345@mongodb:27017/databaseAPI?authSource=admin`,
  { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true },
  (err, res) => {
    if (err) console.log(`ERROR: connecting to Database.  ${err}`);
    else console.log(`Database Online`);
  }
);

// Import routes of our app
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define routes using URL path
app.use("/", routes);

