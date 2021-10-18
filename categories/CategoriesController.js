const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories", (req, res) => {
  Category.findAll().then(results => {
    res.render("admin/categories/index", {
      categories: results
    });
  });
});

router.get("/admin/categories/new", (req, res) => {
  res.render('admin/categories/new');
});

router.post("/categories/save", (req, res) => {
  const { title } = req.body;

  if(title != undefined){
    Category.create({

      title: title,
      slug: slugify(title, {lower: true})

    }).then(() => {
      res.redirect("/admin/categories");

    })

  }else{
    res.redirect("/admin/categories/new")
  }
});

router.post("/categories/delete", (req, res) => {
  const id = parseInt(req.body.id);

  if(id != undefined){
    if(!isNaN(id)){
      Category.destroy({
        where: {id: id}
  
      }).then(() => {
        res.redirect("/admin/categories");
  
      })

    }else{ // if not a number
      res.redirect("/admin/categories")
    };
  }else{ // if null
    res.redirect("/admin/categories")
  }
});

router.get("/categories/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if(isNaN(id)){
    res.redirect("/admin/categories");
  } else {
    Category.findByPk(id).then(category => {
      if(category != undefined){
        res.render('admin/categories/edit', {
          category: category
        });
  
      } else {
        res.redirect("/admin/categories");
      }
    }).catch(error => {
      res.redirect("/admin/categories");
    });  
  }
});

router.post("/categories/update", (req, res) => {
  const { id, title} = req.body;

  Category.update({
    title: title, 
    slug: slugify(title, {lower: true})}, { 
    where: {
      id: id
    } 
  }).then(() => {
    res.redirect('/admin/categories')
  });
});

module.exports = router;