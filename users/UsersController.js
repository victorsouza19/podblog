const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll({raw: true}).then(users => {
    res.render("admin/users/index", {
      users: users
    });
  });
  
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  let salt = bcrypt.genSaltSync(10);

  User.findOne({ where: {email: email}}).then(user => {

    if(user > 0){
      res.redirect("/admin/users/create");
    } else {

      if(password == passwordConfirm){
        let hash =  bcrypt.hashSync(password, salt);

        User.create({
          name: name,
          email: email,
          password: hash

        }).then(() => {
          res.redirect("/admin/users");

        }).catch(err => {
          res.redirect("/");

        });
      } else {
        res.redirect("/admin/users/create");
      }
    };
  }).catch(err => {
    res.redirect("/");
  });
});

router.post("/users/delete", (req, res) => {
  const id = req.body.id;

  User.destroy({ where: {id: id}}).then(() => {
    res.redirect("/admin/users");
  }).catch(err => {
    res.redirect("/");
  });
});

router.get("/users/edit/:id", (req, res) => {
  const id = req.params.id;

  User.findOne({where: {id: id}}).then(user => {
    res.render("admin/users/edit", {user: user});

  }).catch(err => {
    res.redirect("/");
  })
});

router.post("/users/update", (req, res) => {
  const { name, email, password, passwordConfirm, id } = req.body;

  let salt = bcrypt.genSaltSync(10);

  User.findOne({ where: {email: email}}).then(userRes => {
    if(userRes != undefined){
      userId = userRes.id;

      if(userId != id){
        res.redirect(`/users/edit/${id}`);
      } else {
        if (password == "" || passwordConfirm == ""){
          User.update({
            name: name,
            email: email},{
              
            where: {id: id}
  
          }).then(() => {
            res.redirect("/admin/users");
  
          }).catch(err => {
            res.redirect("/");
          });
        } else {
  
          if(password == passwordConfirm){
            let hash =  bcrypt.hashSync(password, salt);
    
            User.update({
              name: name,
              email: email,
              password: hash},{
                
              where: {id: id}
    
            }).then(() => {
              res.redirect("/admin/users");
    
            }).catch(err => {
              res.redirect("/");
    
            });
          } else {
            res.redirect(`/users/edit/${id}`);
          }
      };
      }
    } else {
      if (password == "" || passwordConfirm == ""){
        User.update({
          name: name,
          email: email},{
            
          where: {id: id}

        }).then(() => {
          res.redirect("/admin/users");

        }).catch(err => {
          res.redirect("/");
        });
      } else {

        if(password == passwordConfirm){
          let hash =  bcrypt.hashSync(password, salt);
  
          User.update({
            name: name,
            email: email,
            password: hash},{
              
            where: {id: id}
  
          }).then(() => {
            res.redirect("/admin/users");
  
          }).catch(err => {
            res.redirect("/");
  
          });
        } else {
          res.redirect("/admin/users/create");
        }
    };
    }
  }).catch(err => {
    res.redirect("/");
  });
});

module.exports = router;