const express = require("express");
const app = express();
const connection = require("./database/database");
categoriesController = require("./categories/CategoriesController");
articlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

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
