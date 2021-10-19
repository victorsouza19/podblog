const express = require("express");
const Category = require("../categories/Category");
const router = express.Router();
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{model: Category}] // Faz a função do INNER JOIN categories
  },
    {raw: true}
    ).then(articles => {

    res.render("admin/articles/index", {
      articles: articles
    });
  });
});


router.get("/admin/articles/new", (req, res) => {

  Category.findAll().then(results => {
    res.render('admin/articles/new', {
      categories: results
    });

  })
});

router.post("/articles/save", (req, res) => {
  const { title, body, category } = req.body
  
  Article.create({
    title: title,
    slug: slugify(title, {lower: true}),
    body: body,
    categoryId: category,
  }).then(() => {
    res.redirect('/admin/articles');
  });
});

router.post("/articles/delete", (req, res) => {
  const id = parseInt(req.body.id);

  if(id != undefined){
    if(!isNaN(id)){
      Article.destroy({
        where: {id: id}
  
      }).then(() => {
        res.redirect("/admin/articles");
  
      })

    }else{ // if not a number
      res.redirect("/admin/articles")
    };
  }else{ // if null
    res.redirect("/admin/articles")
  }
});

router.get("/articles/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if(isNaN(id)){
    res.redirect("/admin/articles");
  } else {
    Article.findByPk(id).then(article => {
      if(article != undefined){
        res.render('admin/articles/edit', {
          article: article
        });
  
      } else {
        res.redirect("/admin/articles");
      }
    }).catch(error => {
      res.redirect("/admin/articles");
    });  
  }
});

router.post("/articles/update", (req, res) => {
  const { id, title, body, category} = req.body;

  Article.update({
    title: title, 
    body: body,
    slug: slugify(title, {lower: true}),
    categoryId: category}, { 
    where: {
      id: id
    } 
  }).then(() => {
    res.redirect('/admin/articles')
  });
});

module.exports = router;