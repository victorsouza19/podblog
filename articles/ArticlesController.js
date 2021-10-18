const express = require("express");
const router = express.Router();

router.get("/articles", (req, res) => {
  res.send("Articles route")
});


router.get("/admin/articles/new", (req, res) => {
  res.send("New article!");
});

module.exports = router;