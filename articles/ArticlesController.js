const express = require("express");
const Category = require("../categories/Category");
const router = express.Router();
const Article = require("./Article");
const slugify = require("slugify");
const { Router } = require("express");

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

router.get("/articles/page/:num", (req, res) => {
  var page = req.params.num;
  var offset = 0;

  if(isNaN(page) || page == 1){
    offset = 0;
  } else {
    offset = (parseInt(page) -1) * 5;
  }

  Article.findAndCountAll({
    limit: 5,
    offset: offset,
    order: [['id', 'DESC']]
  }).then(articles => {
    let next;

    if (offset + 5 >= articles.count){
      next = false;
    } else {
      next = true;
    };

    let result = {
      page: parseInt(page),
      next: next,
      articles: articles
    };

    Category.findAll().then(categories => {
      res.render('admin/articles/page', {
        result: result,
        categories: categories
      })
    });

    
  });
});

router.get("/admin/articles/new", (req, res) => {

  Category.findAll({ order: [
    ['title', 'ASC']
  ]}).then(results => {
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
    Article.findByPk(id, {include: [{model: Category}]}).then(article => {
      if(article != undefined){
        Category.findAll({raw: true, order: [
          ['title', 'ASC']
        ]}).then(categories => {
          res.render('admin/articles/edit', {
            article: article,
            categories: categories
          });
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
  }).catch(err => {
    res.redirect('/admin/articles');
  })
});

module.exports = router;