var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const addon = require("./build/Release/module");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", function(req, res) {
  res.send("wowie");
});

/* 
 * body: 
 * {
 *   puzzle: <array>
 *   type: <enum {
 *              10,
 *              20,
 *              30,
 *              40
 *          }>
 * }
*/
app.post("/solve", function(req, res) {
  res.status(200).json(addon.solver(req.body.puzzle, req.body.type));
  // addon.solver()
});

app.post("/check", function(req, res) {
  res
    .status(200)
    .json(addon.checker(req.body.puzzle, req.body.to_check, req.body.type));
  // addon.solver()
});

app.listen(3000, function() {
  console.log("app listening on port 3000!");
});
