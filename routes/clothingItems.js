const router = require('express').Router();

router.get("/", (req, res) => {
  res.send("Clothing items route is working");
});
router.post("/", (req, res) => {
  res.send("Create a new clothing item");
});
//change this
router.delete("/:id", (req, res) => {
  res.send(`Delete clothing item with ID: ${req.params.id}`);
});

module.exports = router;