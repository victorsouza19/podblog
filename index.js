const express = require("express");
const app = express();
const connection = require("./database/database");
categoriesController = require("./categories/CategoriesController");
articlesController = require("./articles/ArticlesController");

const Category = require("./articles/Article");
const Article = require("./categories/Category");

// body parser receive form POSTS
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Static files
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');

// database 
connection
  .authenticate().then(() => {
    console.log("Database connected!");
  }).catch((error) => {
    console.log(error);
  })


app.use("/", categoriesController);
app.use("/", articlesController);

// routes
app.get("/", (req, res) => {
  res.render('index');
});

// server connect
app.listen(8082, () => {
  console.log("Server running on port 8082!");
});
