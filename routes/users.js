const router = require('express').Router();

router.get("/", (req, res) => {
  res.send("User route is working");
});
router.get("/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});
router.post("/", (req, res) => {
  res.send("Create a new user");
});

module.exports = router;