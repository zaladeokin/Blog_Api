const express = require('express');
const BlogValidationMW= require("../validators/blog_validator");
const blogController = require("../controllers/blog_controller");

const blogRouter= express.Router();

// Authentication handler.
const authHandler= require("../authentication/authMW");
    

// Get Blogs(Publish/draft) of a author
blogRouter.get("/myblogs", authHandler, blogController.getAuthorBlogs);

// Search an author's Blogs  by title and tags.
blogRouter.get("/myblogs/search/:param", authHandler, blogController.searchAuthorBlogs);

// Get a Blog(Publish/draft) of an author by Id
blogRouter.get("/myblogs/:id", authHandler, blogController.getAuthorBlogsById);

// Search Blogs  by author, title and tags.
blogRouter.get("/search/:param", blogController.searchPublishedBlogs);


// Get all published Blogs
blogRouter.get("/", blogController.getAllPublishedBlogs);

// Get published Blog by Id
blogRouter.get("/:id", blogController.getPublishedBlogById);

// Create a Blog
blogRouter.post("/", authHandler, BlogValidationMW.BlogValidationMW, blogController.addBlog);

// Publish a Blog
blogRouter.put("/publish/:id", authHandler, blogController.publishBlog);

// Update a Blog Info
blogRouter.put("/:id", authHandler, BlogValidationMW.BlogValidationMW, blogController.editBlog);

// Delete a Blog Info
blogRouter.delete("/:id", authHandler, blogController.deleteBlogById);




module.exports = blogRouter;