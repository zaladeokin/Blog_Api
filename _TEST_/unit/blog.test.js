const { getAllPublishedBlogs, getPublishedBlogById, getAuthorBlogs, getAuthorBlogsById, searchPublishedBlogs, searchAuthorBlogs, addBlog, editBlog, publishBlog, deleteBlogById }= require("../../controllers/blog_controller");
const BlogModel = require('../../models/blog');

jest.mock('../../models/blog');

//res obj
const res= {
    status: jest.fn((n)=> n),
    json: jest.fn((n)=> n)
}

const next= jest.fn(n=> n);

//blogs stub
// Total: 3   (1 draft 2 publish)
const blogsData= [
    {
        "_id": "6693a800c2acbb05a1a63797",
        "title": "Grace at UK.",
        "description": "My trip to UK.",
        "author": {
            "_id": "666f1ff79181431b43edc052",
            "first_name": "Grace",
            "last_name": "Favor"
        },
        "state": "published",
        "read_count": 4,
        "reading_time": 10.5,
        "tags": [
            "Test",
            "blog",
            "UK"
        ],
        "timestamp": "2024-07-14T10:27:12.286Z"
    },
    {
        "_id": "66805b931fc1c063514d1d18",
        "title": "Building your portfolio.",
        "description": "web development masterclass",
        "author": {
            "_id": "666f20975a0749eb704efce4",
            "first_name": "Zacchaeus",
            "last_name": "Aladeokin"
        },
        "state": "draft",
        "read_count": 0,
        "reading_time": 12.5,
        "tags": [
            "software",
            "blog",
            "portfolio"
        ],
        "timestamp": "2024-06-29T19:08:03.776Z"
    },
    {
        "_id": "66935e4a7fc4dddc8de2ab71",
        "title": "Last day of regret.",
        "description": "A motivational story",
        "author": {
            "_id": "666f1ff79181431b43edc052",
            "first_name": "Joyce",
            "last_name": "Richardo"
        },
        "state": "published",
        "read_count": 5,
        "reading_time": 9,
        "tags": [
            "story",
            "blog",
            "motivation",
            "christianity"
        ],
        "timestamp": "2024-07-14T05:12:41.811Z"
    }
];

describe("Get published blogs", ()=>{
    const ModelMock={
        //return  result for test("Return blog with default pagination")
        populate: jest.fn(()=> blogsData.filter((blog)=> blog.state === "published"))
    }
    const ModelMock1={
        populate: jest.fn(()=> {
            //return  result for test("Return blogs with custom pagination with limit= 1, page= 2")
            let result= blogsData.filter((blog)=> blog.state === "published")[1];
            return [result];
        })
    }
    BlogModel.countDocuments.mockImplementation(()=> blogsData.filter((blog)=> blog.state === "published").length);
    test("Return blog with default pagination", async ()=>{
        BlogModel.find.mockImplementationOnce(()=> ({ sort: jest.fn(()=>  ModelMock) }));
        let req={
            query: {}
        }
        await getAllPublishedBlogs(req, res, next);
        let blogs= blogsData.filter((blog)=> blog.state === "published");
        expect(res.json).toHaveBeenCalledWith({
            success: true, 
            blogs: blogs,
            limit: 20,
            current_page: 1,
            total_pages: 1,
        });
    });
    test("Return blogs with custom pagination with limit= 1, page= 2", async ()=>{
        BlogModel.find.mockImplementationOnce(()=> ({ sort: jest.fn(()=>  ModelMock1) }));
        let req= {
            query: {
                limit: 1,
                page: 2
            }
        }
        await getAllPublishedBlogs(req, res, next);
        let blogs= blogsData.filter((blog)=> blog.state === "published")[1];
        expect(res.json).toHaveBeenLastCalledWith({
            success: true, 
            blogs: [blogs],
            limit: 1,
            current_page: 2,
            total_pages: 2,
        });
    });
    test("Error handling", async ()=>{
        BlogModel.find.mockImplementationOnce(()=> {
             throw "An error occurred"
        });
        let req= {
            query: {}
        }
        await getAllPublishedBlogs(req, res, next);
        expect(next).toHaveBeenCalledWith({
            status: 400,
            success: false,
            message: "An error occurred"
        });
    });
});

describe("Get published blog by Id", ()=>{
    beforeAll(()=>{
        jest.clearAllMocks();
    });
    BlogModel.findByIdAndUpdate.mockImplementation();
    test("Can't access blog in draft state/ handle invalid blog Id", async ()=>{
        let req={
            params: { id: "wrong_id" }
        }
        BlogModel.findOne.mockImplementationOnce(()=> ({
            populate: jest.fn(()=> {
                let result= blogsData.filter((blog)=> blog.state === "published" && blog._id ===req.params.id);
                result= result.length === 0 ? undefined : result[0];
                return result;
            })
        }));
        await getPublishedBlogById(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Blog does not exist."
        });
    });
    test("Return published blog with valid Id", async ()=>{
        let req={
            params: { id: "6693a800c2acbb05a1a63797" }
        }
        BlogModel.findOne.mockImplementationOnce(()=> ({
            populate: jest.fn(()=> {
                let result= blogsData.filter((blog)=> blog.state === "published" && blog._id ===req.params.id);
                result= result.length === 0 ? undefined : result[0];
                return result;
            })
        }));
        await getPublishedBlogById(req, res, next);
        let blog= blogsData.filter((blog)=> blog.state === "published" && blog._id ===req.params.id)[0]
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            blog: blog
        });
    });
    test("Error handling", async ()=>{
        BlogModel.findOne.mockImplementationOnce(()=> {
             throw "An error occurred"
        });
        let req= {
            params: {id: ""}
        }
        await getPublishedBlogById(req, res, next);
        expect(next).toHaveBeenCalledWith({
            status: 400,
            success: false,
            message: "An error occurred"
        });
    });
});

describe("Get an author blogs", ()=>{
    beforeAll(()=>{
        jest.clearAllMocks();
    });
    let req={
        query: {},
        user: { _id: "666f1ff79181431b43edc052" }
    }
    BlogModel.countDocuments.mockImplementation(()=> blogsData.filter((blog)=> blog.author._id === req.user._id).length);

    test("Return blogs either in published or draft state", async ()=>{
        BlogModel.find.mockImplementationOnce(()=> ({ sort: jest.fn(()=>  blogsData.filter((blog)=> blog.author._id === req.user._id)) }));
        await getAuthorBlogs(req, res, next);
        let blogs= blogsData.filter((blog)=> blog.author._id === req.user._id);
        expect(res.json).toHaveBeenCalledWith({
            success: true, 
            blogs: blogs,
            limit: 20,
            current_page: 1,
            total_pages: 1
        });
    });

    test("Error handling", async ()=>{
        BlogModel.find.mockImplementationOnce(()=> {
             throw "An error occurred"
        });
        await getAuthorBlogs(req, res, next);
        expect(next).toHaveBeenCalledWith({
            status: 400,
            success: false,
            message: "An error occurred"
        });
    });
});
