const supertest= require("supertest");
const app= require("../../app");
const MongoDB= require('mongoose');

const request= supertest(app);


afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  MongoDB.connection.close()
  done()
});

test("Homepage", async ()=>{
    const res= await request.get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/)
});

describe("Auth endpoint", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    test("successful login", async ()=>{
        let input= {
            "email" : "zaladeokin@gmail.com",
            "password": "qwert1"
        }
            const res= await request.post("/api/v1/auth/login").send(input).set('Accept', 'application/json');
            expect(res.status).toBe(200);
    });
    test("Incorrect email/password", async ()=>{
        let input= {
            "email" : "zaladeokin@gmail.com",
            "password": "wrong_password"
        }
            const res= await request.post("/api/v1/auth/login").send(input).set('Accept', 'application/json');
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/incorrect/);
    });
});

describe.only("User endpoints", ()=>{
    describe.skip("Create user", ()=>{
        beforeEach(()=>{
            jest.clearAllMocks();
        });
        test("Successful signup", async ()=>{
            let input= {
                "email" : Date.now()+"test@gmail.com",
                "first_name" : "Test",
                "last_name": "John",
                "password": "qwert1",
                "repeat_password": "qwert1"
            }
            const res= await request.post("/api/v1/users").send(input).set('Accept', 'application/json');
            expect(res.status).toBe(201);
        });
        test("Email must be unique", async()=>{
            let input= {
                "email" : "zaladeokin@gmail.com",
                "first_name" : "new",
                "last_name": "name",
                "password": "qwert1",
                "repeat_password": "qwert1"
            }
            const res= await request.post("/api/v1/users").send(input).set('Accept', 'application/json');
            expect(res.status).toBe(409);
        });
        test("Input validator", async()=>{
            let input= {
                "email" : "noemail@gmail.com",
                "first_name" : "new",
                "password": "qwert1",
                "repeat_password": "qwert1"
            }
            const res= await request.post("/api/v1/users").send(input).set('Accept', 'application/json');
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/required/);
        });
    });

    describe("Update User", ()=>{
        /**
         * Two users Login details for test case
         * 
         * [
         *  {
         *      _id: "66a6a41fed0f4b484c935469",
         *      email: "zaladeokin@gmail.com"
         *  },
         *  {
         *      _id: "66a6a4bbed0f4b484c93546c",
         *      email: "favour56@gmail.com"
         *  }
         * ]
         */
        test("User can only update their own data", async ()=>{
            let updatedInfo= {
                "email" : "zaladeokinKK@gmail.com",
                "first_name" : "Zacchaeus",
                "last_name": "Aladeokin",
                "password": "qwert1"
            }
            let input= {
                "email" : "zaladeokin@gmail.com",
                "password": "qwert1"
            }
            const auth= await request.post("/api/v1/auth/login").send(input).set('Accept', 'application/json');
            const token= auth.body.token;
            const res= await request.put("/api/v1/users/66a6a4bbed0f4b484c93546c").send(updatedInfo).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(403);
        });
        test("2FA- Password to authorize modification", async ()=>{
            let updatedInfo= {
                "email" : "zaladeokinKK@gmail.com",
                "first_name" : "Zacchaeus",
                "last_name": "Aladeokin",
                "password": "wrong_password"
            }
            let input= {
                "email" : "zaladeokin@gmail.com",
                "password": "qwert1"
            }
            const auth= await request.post("/api/v1/auth/login").send(input).set('Accept', 'application/json');
            const token= auth.body.token;
            const res= await request.put("/api/v1/users/66a6a41fed0f4b484c935469").send(updatedInfo).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(401);
        });
        test("Successful request", async ()=>{
            let updatedInfo= {
                "email" : "zaladeokin@gmail.com",
                "first_name" : "Zacchaeus",
                "last_name": "Aladeokin",
                "password": "qwert1"
            }
            let input= {
                "email" : "zaladeokin@gmail.com",
                "password": "qwert1"
            }
            const auth= await request.post("/api/v1/auth/login").send(input).set('Accept', 'application/json');
            const token= auth.body.token;
            const res= await request.put("/api/v1/users/66a6a41fed0f4b484c935469").send(updatedInfo).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });

    test("Get all users", async ()=>{
        const res= await request.get("/api/v1/users");
        expect(res.status).toBe(200);
    });

    describe("Get user by Id", ()=>{
        test("Handle incorrect Id", async ()=>{
            const res= await request.get("/api/v1/users/666f20975a0749eb704efcez9");
            expect(res.status).toBe(400);
        });
        test("successful request", async ()=>{
            /**
            * user details for test case
            *  {
            *      _id: "66a6a4bbed0f4b484c93546c",
            *      email: "favour56@gmail.com"
            *  }
            */
            const res= await request.get("/api/v1/users/66a6a4bbed0f4b484c93546c");
            expect(res.status).toBe(200);
        });
    });
});
