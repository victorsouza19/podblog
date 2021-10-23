const express = require("express");
const app = express();
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// view engine
app.set('view engine', 'ejs');

// body parser receive form POSTS
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//sessions 
app.use(session({
  secret: "podpassword4682blog",
  cookie: {maxAge: 28800000 }
}));

// Redis


// Static files
app.use(express.static('public'));

// database 
connection
  .authenticate().then(() => {
    console.log("Database connected!");
  }).catch((error) => {
    console.log(error);
  })


  // set controllers
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// routes
app.get("/", (req, res) => {
  let pagination = true;
  let limit = 6;

  Article.findAndCountAll({
    raw: true, 
    order: [['id', 'DESC']],
    limit: limit

  }).then(articles => {

    if (articles.count <= limit){
      pagination = false;
    }

    Category.findAll().then(categories => {

      res.render('index', {
        articles: articles,
        categories: categories,
        pagination: pagination
      });
    });
    
  });
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;

  Article.findOne({where: {slug: slug}}).then(article => {
    if(article != undefined){

      Category.findAll().then(categories => {

        res.render('article', {
          article: article,
          categories: categories
        });
      });

    } else {
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  })
});

app.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  let pagination = true;
  let limit = 6;

  Category.findOne({
    where: {slug: slug},
    include: [{model: Article}] 
  
  }).then(category => {
    if(category.articles.length <= limit){
      pagination = false;
    }
    
    if(category != undefined){

      Category.findAll().then(categories => {
        res.render("index", {
          articles: category.articles,
          categories: categories,
          pagination: pagination
        });
      });
    } else {
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  })
});

// server connect
app.listen(8082, () => {
  console.log("Server running on port 8082!");
});
