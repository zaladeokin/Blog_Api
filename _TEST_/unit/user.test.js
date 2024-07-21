const { getAllUsers,getUserById, addUser, updateUser }= require('../../controllers/user_controller');
const UserModel = require('../../models/user');

jest.mock('../../models/user');

//res obj
const res= {
    status: jest.fn((n)=> n),
    json: jest.fn((n)=> n)
}

const next= jest.fn(n=> n);

const idLookUp= (id)=>{
    let result= usersData.filter((user)=> user._id === id);
    result= result.length === 0 ? undefined : result[0];
    return result;
}

//users stub
//userData.length= 3
const usersData=  [
    {
        "_id": "669578e29938bd2800dc1c1e",
        "first_name": "Joyce",
        "last_name": "Richardo",
        "email": "joyce1@gmail.com"
    },
    {
        "_id": "666f1ff79181431b43edc052",
        "first_name": "Grace",
        "last_name": "Favor",
        "email": "favour56@gmail.com"
    },
    {
        "_id": "666f20975a0749eb704efce4",
        "first_name": "Zacchaeus",
        "last_name": "Aladeokin",
        "email": "zaladeokin@gmail.com"
    }
]


describe('Get all users', ()=>{
    describe("Pagination", ()=>{
        UserModel.find.mockImplementation(()=> ({
            sort: jest.fn(()=> usersData)
        }));
        UserModel.countDocuments.mockImplementationOnce((n)=> usersData.length).mockImplementationOnce((n)=> usersData.length);
        test("Return users with default pagination", async ()=>{
            let req= {
                query: {keyword: false}
            }
            await getAllUsers(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                success: true, 
                users: usersData,
                limit: 20,
                current_page: 1,
                total_pages: 1
            });
        });
        test("Return users with custom pagination with limit= 1, page= 2", async ()=>{
            let req= {
                query: {
                    keyword: false,
                    limit: 1,
                    page: 2
                }
            }
            await getAllUsers(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                success: true, 
                users: usersData,
                limit: 1,
                current_page: 2,
                total_pages: 3
            });
        });
    });
    test("Error handling", async ()=>{
        UserModel.countDocuments.mockImplementationOnce(()=> {
             throw "An error occurred"
        });
        let req= {
                query: {keyword: false}
            }
        await getAllUsers(req, res, next);
        expect(next).toHaveBeenCalledWith({
            status: 400,
            success: false,
            message: "An error occurred"
        });
    });
});

describe("Get user by Id",()=>{
    beforeAll(()=>{
        jest.clearAllMocks();
    });
    UserModel.findById.mockImplementation(idLookUp)
    test("Invalid user Id", async ()=>{
        let req={
            params: { id: "wrong_id" }
        }
        await getUserById(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid user Id"
        })
    });
    test("Return user data for valid user Id", async ()=>{
        let req={
            params: { id: "666f20975a0749eb704efce4" }
        }
        await getUserById(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            user: {
                "_id": "666f20975a0749eb704efce4",
                "first_name": "Zacchaeus",
                "last_name": "Aladeokin",
                "email": "zaladeokin@gmail.com"
            }
        })
    });
    test("Error handling", async ()=>{
        UserModel.findById.mockImplementationOnce(()=> {
             throw "An error occurred"
        });
        let req={
            params: { id: "666f20975a0749eb704efcez" }
        }
        await getUserById(req, res, next);
        expect(next).toHaveBeenCalledWith({
            status: 400,
            success: false,
            message: "An error occurred"
        });
    });
});

describe("Add user", ()=>{
    beforeAll(()=>{
        jest.clearAllMocks();
    });
    UserModel.countDocuments.mockImplementation(({email})=>{
        let result= usersData.filter((user)=> user.email === email);
        return result.length;
    });
    UserModel.create.mockImplementation();
    test("Email must be unique(i.e not used by a existing user)", async ()=>{
        let req= {
            body:{ email: "zaladeokin@gmail.com" }
        }
        await addUser(req, res, next);
        expect(next).toHaveBeenCalledWith({
                status: 409,
                success: false,
                message: "Email has been registered by a user"
        })
    });
    test("Register a new user successfully",async ()=>{
        let req= {
            body:{ email: "new_user@gmail.com" }
        }
        await addUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "User created successfully"
        });
    });
    test("Error handling", async ()=>{
        UserModel.create.mockImplementationOnce(()=> {
             throw "An error occurred"
        });
        let req= {
            body:{ email: "zaladeokin_gmail.com" }
        }
        await addUser(req, res, next);
        expect(next).toHaveBeenLastCalledWith({
            status: 500,
            success: false,
            message: "An error occurred"
        });
    });
});

describe("Update user Info", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    UserModel.findById.mockImplementation(idLookUp);
    UserModel.findByIdAndUpdate.mockImplementation();
    test("User can only edit their own data", async ()=>{
        let req={
            params: { id: "666f20975a0749eb704efce4" },
            user: { _id: "669578e29938bd2800dc1c1e" }
        }
        await updateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Action forbidden"
        });
    });
    // test("Authenticate with password", async ()=>{
    //     let req={
    //         params: { id: "666f20975a0749eb704efce4" },
    //         user: { _id: "666f20975a0749eb704efce4" },
    //         body:{ password: "qwert1" }
    //     }
    //     await updateUser(req, res, next);
    //     expect(res.status).toHaveBeenCalledWith(401);
    // })
    // test("successfully  update user data")
    test("Error handling", async ()=>{
        UserModel.findById.mockImplementationOnce(()=> {
             throw "An error occurred"
        });
        let req={
            params: { id: "666f20975a0749eb704efce4" },
            user: { _id: "666f20975a0749eb704efce4" },
            body:{ password: "qwert1" }
        }
        await updateUser(req, res, next);
        expect(next).toHaveBeenLastCalledWith({
            status: 500,
            success: false,
            message: "An error occurred"
        });
    });
});



