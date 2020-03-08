const express = require("express");
// const mongoose = require('mongoose');
const { User } = require("../models/user");
const router = express.Router();
const { Blog, validateBlog } = require("../models/blog");
const { isAuthenticated, isAdmin } = require("../middleware/auth");


router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    console.log(blogs);
    res.send(blogs);
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

router.get("/blogdetails/:blogid", isAuthenticated, async (req, res) => {
  try {
    console.log(req.params.blogid);

    const blog = await Blog.findById(req.params.blogid);
    // const blog = await Blog.findOne({author_id: req.params.blogid});
    if (blog === null) {
      console.log("Blog with given id does not exists");
      res.status(404).send("Could not find the blog");
    } else {
      console.log(blog);
      res.send(blog);
    }
  } catch (error) {
    console.error(error);
    res.send("Could not found");
  }
});

router.get("/reviewblogs/", async (req, res) => {
  try {
    const blogs = await Blog.find({ approve: false });
    console.log(blogs);
    res.send(blogs);
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

router.post("/new/", isAuthenticated, async (req, res) => {
  const result = validateBlog(req.body);
  if (result.error) {
    console.log("Body", result);
    res.status(400).send(result.error.details[0].message);
  } else {
    try {
      req.body.approve = false;
      const blog = new Blog(req.body);

      const temp = await blog.save();
      console.log("Added successfully", temp);
      res.send(temp);
    } catch (error) {
      console.error(error);
      res.send("Error saving");
    }
  }
});

router.put("/update/:id", isAuthenticated, async (req, res) => {
  const result = validateBlog(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  const id = req.payload.id;
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(400).send("Blog does not exists");
  const author = blog.author.author_id;
  const user = await User.findById(id);
  if (!user) return res.send("No User Found");
  if (id != author) return res.send("You are not allowed to update this blog");
  let temp = await blog.updateOne(req.body);
  temp = await blog.save();
  res.send(temp);
});

router.post("/accept/:id", [isAuthenticated, isAdmin], async (req, res) => {
  const id = req.params.id;
  const selectedBlog = await Blog.findById(id);
  if (selectedBlog == null)
    return res.status(404).send("Blog with Id not found");
  if (selectedBlog.approve)
    return res.status(401).send("Blog is Already Approved");
  selectedBlog.approve = true;
  selectedBlog.save();
  res.send(selectedBlog);
});

router.delete("/:blogid", async (req, res) => {
  try {
    console.log(req.params.blogid);

    const blog = await Blog.findByIdAndDelete(req.params.blogid);

    if (blog === null) {
      console.log("Blog with given id does not exists");
      res.status(404).send("Could not find the blog");
    } else {
      console.log(blog);
      res.send("blog deleted");
    }
  } catch (error) {
    console.error(error);
    res.send("Error during deletion");
  }
});

module.exports = router;
