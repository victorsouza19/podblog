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
  secret: "podpasswordblog4682",
  cookie: {maxAge: 30000 }
}));


// Static files
app.use(express.static('public'));

// database 
connection
  .authenticate().then(() => {
    console.log("Database connected!");
  }).catch((error) => {
    console.log(error);
  })


app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// routes
app.get("/", (req, res) => {
  Article.findAll({
    raw: true, 
    order: [['id', 'DESC']],
    limit: 5

  }).then(articles => {

    Category.findAll().then(categories => {

      res.render('index', {
        articles: articles,
        categories: categories
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

  Category.findOne({
    where: {slug: slug},
    include: [{model: Article}] 
  
  }).then(category => {
    if(category != undefined){

      Category.findAll().then(categories => {
        res.render("index", {
          articles: category.articles,
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

// server connect
app.listen(8082, () => {
  console.log("Server running on port 8082!");
});
