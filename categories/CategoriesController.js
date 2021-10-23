const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories", adminAuth, (req, res) => {
  Category.findAll().then(results => {
    res.render("admin/categories/index", {
      categories: results
    });
  });
});

router.get("/admin/categories/new", adminAuth, (req, res) => {
  res.render('admin/categories/new');
});

router.post("/categories/save", adminAuth, (req, res) => {
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

router.post("/categories/delete", adminAuth, (req, res) => {
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

router.get("/categories/edit/:id", adminAuth, (req, res) => {
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

router.post("/categories/update", adminAuth, (req, res) => {
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