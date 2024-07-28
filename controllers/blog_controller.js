const BlogModel = require('../models/blog');

async function getAllPublishedBlogs(req, res, next) {
    /**
     * Get List of published blog.
     * This end-point is paginated and default to 20 blogs.
     * Blogs are order by (highest) read_count, (lowest) reading_time and (latest) timestamp
     */

    const filter= { state: 'published'}
    const { total_pages, page, limit, offset }= await blogPagination(req, filter, next);

    try{//Model might throw error
        const blogs= await BlogModel.find(filter, '-body -state -__v', {skip: offset, limit: limit})
        .sort({read_count: -1, reading_time: 1, timestamp: -1}).populate("author", "first_name last_name");

        res.json({
            success: true, 
            blogs: blogs,
            limit: limit,
            current_page: page,
            total_pages: total_pages
        });
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}

async function getPublishedBlogById(req, res, next) {
    /**
     * Get publihed blog by Id
     * Update read_count by 1
     */
    const blogId= req.params.id;

   try{//Model might throw error
        const blog= await BlogModel.findOne({_id: blogId, state: "published"}, '-__v -state').populate("author", "first_name last_name email");

        if(!blog){
            res.status(400)
            return res.json({
                success: false,
                message: "Blog does not exist."
            });
        }

        //Increase read_count by 1
        await BlogModel.findByIdAndUpdate(blogId, { $set: { read_count : blog.read_count + 1 }});

        res.json({
            success: true,
            blog: blog
        });
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}

async function getAuthorBlogs(req, res, next){
    /**
     * Get list of all blog created by a user whether it is in publish or draft state
     * A 'state' query parameter is used to get either published or draft blog. If not set, Both published and draft blogs will be returned.
     * This end-point is paginated and default to 20 blogs.
     * Blogs are order by (latest) timestamp, (highest) read_count, (lowest) and reading_time
     */

    const uid= req.user._id;
    const filter= { author: uid }
    if(req.query.state) filter.state= req.query.state;
    const { total_pages, page, limit, offset }= await blogPagination(req, filter, next);

    try{//Model might throw error
        const blogs= await BlogModel.find(filter, '-body -author -__v', {skip: offset, limit: limit})
        .sort({ timestamp: -1, read_count: -1, reading_time: 1});

        res.json({
            success: true, 
            blogs: blogs,
            limit: limit,
            current_page: page,
            total_pages: total_pages
        });
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}

async function getAuthorBlogsById(req, res, next) {
    const blogId= req.params.id;
    const uid= req.user._id;
    const filter= { _id: blogId, author: uid }

   try{//Model might throw error
        const blog= await BlogModel.findOne(filter, '-__v -author');

        if(!blog){
            res.status(400)
            return res.json({
                success: false,
                message: "Blog does not exist."
            });
        }

        res.json({
            success: true,
            blog: blog
        });
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}

async function searchPublishedBlogs(req, res, next){
    /**
     * Search Published blogs by parameters(author, title and tags);
     * This end-point is paginated and default to 20 blogs.
     * Blogs are order by (highest) read_count, (lowest) reading_time and (latest) timestamp
     * ..../search/author uses author's to search blog
     * ..../search/title uses blog's titles to search blog
     * ..../search/tags uses blog's tags to search blog
     */

    const param= req.params.param;
    const keyword= req.query.keyword || "";
    const regX= new RegExp(keyword, 'i');

    if(param !== "author" && param !== "title" && param !== "tags"){
        return next({
            status: 400,
            success: false,
            message: "Invalid  search parameter"
        });
    }

    
    try{//Model might throw error
        let filter;
        if(param === "author"){
            //Import UserModel to search for author with matching keyword  
            const UserModel = require('../models/user');
            const authorFilter= {
                $or:[
                    {first_name: {$regex: regX}},
                    {last_name: {$regex: regX}}
                ]
            }
            const authors= await UserModel.find(authorFilter, '_id');

            if(authors.length === 0){
                return res.json({
                    success: true, 
                    blogs: [],
                    limit: 0,
                    current_page: 1,
                    total_pages: 1
                });
            }
            //Convert result from array of Object to array of ObjectId
            let authorIds=[];
            for( let author of authors ){
                authorIds.push(author._id)
            }
            filter= {
                state: 'published',
                author: { $in: authorIds }
            }
        }else if(param === "tags"){
            filter= {
                state: 'published',
                [param]: { $elemMatch: {$regex: regX } }
            }
        }else{
            filter= {
                state: 'published',
                [param]: { $regex: regX }
            }
        }

        const { total_pages, page, limit, offset }= await blogPagination(req, filter, next);
        
        const blogs= await BlogModel.find(filter, '-body -state -__v', {skip: offset, limit: limit})
        .sort({read_count: -1, reading_time: 1, timestamp: -1}).populate("author", "first_name last_name");

        res.json({
            success: true, 
            blogs: blogs,
            limit: limit,
            current_page: page,
            total_pages: total_pages
        });
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}

async function searchAuthorBlogs(req, res, next){
    /**
     * Search blogs created by an author with parameters(title and tags);
     * This end-point is paginated and default to 20 blogs.
     * Blogs are order by (highest) read_count, (lowest) reading_time and (latest) timestamp.
     * ..../myblogs/search/title uses blog's titles to search an author blogs
     * ..../myblogs/search/tags uses blog's tags to search an author blogs
     */

    const param= req.params.param;
    const keyword= req.query.keyword || "";
    const regX= new RegExp(keyword, 'i');
    const uid= req.user._id;

    if(param !== "title" && param !== "tags"){
        return next({
            status: 400,
            success: false,
            message: "Invalid  search parameter"
        });
    }

    let filter;
    if(param === "tags"){
        filter= {
            author: uid,
            [param]: { $elemMatch: {$regex: regX } }
        }
    }else{
        filter= {
            author: uid,
            [param]: { $regex: regX }
        }
    }

    try{//Model might throw error
        const { total_pages, page, limit, offset }= await blogPagination(req, filter, next);
        
        const blogs= await BlogModel.find(filter, '-body -author -__v', {skip: offset, limit: limit})
        .sort({read_count: -1, reading_time: 1, timestamp: -1});

        res.json({
            success: true, 
            blogs: blogs,
            limit: limit,
            current_page: page,
            total_pages: total_pages
        });
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}

async function addBlog(req, res, next) {
    /**
     * When Blog is created, It will automatically be in Draft State
     * author, read_count, timestamp, and state is auto-generated by the server
     * Therefore, No need to validate the above properties in blog_validator.js
     */
    const blog= req.body;
    blog.author= req.user._id;
    blog.read_count= 0;
    blog.state= "draft"
    blog.timestamp= Date.now();

    try{//Model might throw error
        const exist = await BlogModel.countDocuments({ title: blog.title });
        if(exist > 0){// Check if a title has not been by a User
            next({
                status: 409,
                success: false,
                message: "Title has been used for a Blog."
            });
            return;
        }

        //Estimate read time in unit of seconds
        blog.reading_time= generateReadTime(blog.body);

        const result = await BlogModel.create(blog);
        res.status(201);
        res.json({
            success: true,
            message: "Blog created successfully",
            blog: result
        });
    }catch(err){
        next({
            status: 500,
            success: false,
            message: err
        });
    }
}

async function editBlog(req, res, next) {
    /**
     * When Blog is edited, State can be changed alongside with other parameter by the author
     * author, timestamp, reading_time and read_count can not be changed
     * Therefore, No need to validate the above properties(author, timestamp, reading_time and read_count) in blog_validator.js. However, Same validator is used to create and edit blog
     * read_time will be calculated again based on the number of words in blog.body
     */

    let blogId= req.params.id;
    let userId= req.user._id;
    const editedBlog= req.body;

    //Check if blog ID is valid and if Blog is created by user
    let authorized= await validateBlogIdAndUser(blogId, userId, res, next);
    if(!authorized) return;

    //Estimate read time in unit of seconds
    editedBlog.reading_time= generateReadTime(editedBlog.body);

    try{//Model might throw error
        //Update Infoo
        await BlogModel.findByIdAndUpdate(blogId, { $set: { title: editedBlog.title, description: editedBlog.description, state: editedBlog.state, tags: editedBlog.tags, body: editedBlog.body, reading_time:  editedBlog.reading_time }});

        res.json({
            success: true,
            message: "Blog edited successfully"
        });
    }catch(err){
        next({
            status: 500,
            success: false,
            message: err
        });
    }
}

async function publishBlog(req, res, next) {
    /**
     * Only Blog state is modify.
     * No input from user. Therefore, No need to validate any properties in blog_validator.js
     */
    let blogId= req.params.id;
    let userId= req.user._id;
    
    //Check if blog ID is valid and if Blog is created by user
    let authorized= await validateBlogIdAndUser(blogId, userId, res, next);
    if(!authorized) return;

    try{//Model might throw error 
        //publish Blog
        await BlogModel.findByIdAndUpdate(blogId, { $set: { state: "published" }});

        res.json({
            success: true,
            message: "Blog published successfully"
        });
    }catch(err){
        next({
            status: 500,
            success: false,
            message: err
        });
    }
}

async function deleteBlogById(req, res, next){
    const blogId= req.params.id;
    const uid= req.user._id;
    const filter= { _id: blogId, author: uid }
    try{//Model might throw error 
        const exist= await BlogModel.countDocuments(filter);

        if(exist === 0){
            res.status(404);
            return res.json({
                success: false,
                message: "Blog does not exist or belong to you"
            });
        }

        await BlogModel.findByIdAndDelete(blogId)

        res.json({
            success: true,
            message: "Blog deleted successfully"
        });
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}


/**
 * Helper Functions 
 * 
 * validateBlogIdAndUser() :: Check if blog ID is valid and ensures user can only edit their own blog
 * 
 * blogPagination() :: Calculate pagination parameters
 * 
 * generateReadTime() :: Estimate the reading time for a blog
 */

async function validateBlogIdAndUser(blogId, userId, res, next) {
    try{//Model might throw error due to Invalid blogId
        //Check if blog ID is valid and fetch author
        let author= await BlogModel.findById(blogId, 'author');

        if(!author){
            res.status(400);
            res.json({
                success: false,
                 message: "Blog does not exit"
            });
            return false;
        }

        //Ensures user can only edit their own blog
        if(userId != author.author){
            res.status(403);
            res.json({
                success: false,
                message: "Action forbidden"
            });
            return false;
        }
        return true;
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
        return false;
    }
}

async function blogPagination(req, filter= undefined, next) {
    try{//Model might throw error 
        const no_of_rows= filter !== undefined ? await BlogModel.countDocuments(filter) : await BlogModel.countDocuments();
        let page= req.query.page || 1;
        const limit= req.query.limit || 20;//No of item per page |  default to 20 blogs
        const total_pages= no_of_rows > limit ? Math.ceil(no_of_rows/limit) : 1;
        if(page > total_pages) page= total_pages;
        const offset= (page - 1) * limit; //No of item to skip, i.e. index where to start next page
        return { total_pages, page, limit, offset };
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}

function generateReadTime(body){
    //Remove excess white-space from content and return the number of words in the content
    const no_of_words= body.replace(/\s+/g,' ').trim().split(" ").length;
    //Assumes it takes 0.5 seconds to read a word
    const reading_time= no_of_words * 0.5
    return reading_time;
}


module.exports = { 
    getAllPublishedBlogs,
    getPublishedBlogById,
    getAuthorBlogs,
    getAuthorBlogsById,
    searchPublishedBlogs,
    searchAuthorBlogs,
    addBlog,
    editBlog,
    publishBlog,
    deleteBlogById
}