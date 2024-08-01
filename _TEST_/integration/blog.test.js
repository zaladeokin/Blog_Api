const supertest= require("supertest");
const app= require("../../app");
const MongoDB= require('mongoose');

const request= supertest(app);

let token;

beforeAll(async ()=>{
    let input= {
        "email" : "zaladeokin@gmail.com",
        "password": "qwert1"
    }
    const auth= await request.post("/api/v1/auth/login").send(input).set('Accept', 'application/json');
    token= auth.body.token;
}, 15000);


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

describe("Auth endpoints", ()=>{
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

describe("User endpoints", ()=>{
    describe("Create user", ()=>{
        beforeEach(()=>{
            jest.clearAllMocks();
        });
        test.skip("Successful signup", async ()=>{
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

describe("Blog endpoints", ()=>{

    describe("Create a blog", ()=>{
        test("Blog title must be unique", async ()=>{
            let input= {
                "title": "Grace at UK",
                "description": "A Journey of Discovery and Growth.",
                "tags": ["Tour", "Discovery", "UK"],
                "body": "Stepping into the United Kingdom, I felt a mix of excitement and nervousness. The historic landmarks, diverse cultures, and renowned educational institutions beckoned me. As I embarked on this journey, I was filled with hopes and dreams, ready to explore and embrace the experiences that awaited me.\nMy first few days in the UK were a whirlwind of activity. From navigating the bustling streets of London to familiarizing myself with the British accent, every moment was a learning experience. The iconic red buses and telephone booths were a charming contrast to the modern skyscrapers. Finding my way around using the Underground, or the \"Tube,\" became a daily adventure.\nOne of the main reasons for my move to the UK was to pursue higher education. The academic environment here is both challenging and inspiring. The professors are experts in their fields, and the diversity of the student body offers a rich tapestry of perspectives. Engaging in discussions, participating in group projects, and attending lectures have all contributed to my intellectual growth.\nThe UK is a melting pot of cultures, and I made it a point to immerse myself in as many experiences as possible. Visiting museums, attending theatre performances, and exploring historic sites like Stonehenge and the Tower of London were just a few highlights. I also indulged in traditional British cuisine, from fish and chips to afternoon tea, savoring the unique flavors.\nBuilding connections was a key aspect of my journey. I joined various student organizations and attended networking events, which helped me form friendships and professional relationships. These connections have been invaluable, providing support and enriching my experience.\nLike any journey, mine had its share of challenges. Adjusting to a new environment, dealing with homesickness, and managing academic pressures were all part of the experience. However, these challenges taught me resilience and adaptability. Seeking support from friends, mentors, and university resources helped me navigate these hurdles.\nLiving in the UK has been transformative. It has broadened my horizons, fostering a deeper understanding of global cultures and perspectives. I've become more independent, confident, and open-minded. This journey has not only enriched my academic knowledge but also contributed significantly to my personal growth."
            }
            const res= await request.post("/api/v1/blogs").send(input).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(409);
        });
        test.skip("Successful request", async ()=>{
            let input= {
                "title": "Building Your Portfolio (Revised -" + Date.now() + ")",
                "description": "A Step-by-Step Guide to building an impressive portfolio",
                "tags": ["portfolio", "skills"],
                "body": "Creating a portfolio is essential for showcasing your skills, experience, and accomplishments to potential employers, clients, or collaborators. Whether you're a designer, developer, writer, or any other professional, a well-crafted portfolio can set you apart in a competitive market. Here’s a step-by-step guide to help you build an impressive portfolio.\n\n1. Define Your Goals: Before you start building your portfolio, it’s important to define what you want to achieve.\n2. Choose the Right Platform: electing the right platform for your portfolio is crucial.\n3. Curate Your Best Work: Quality over quantity is key when selecting pieces to include in your portfolio. Choose projects that best demonstrate your skills, creativity, and range.\n4. Showcase Your Skills and Experience: In addition to project samples, include sections that highlight your skills, experience, and achievements.\n5. Create a Clean and Professional Design: The design of your portfolio should be clean, professional, and easy to navigate.\n6. Optimize for SEO: To ensure your portfolio gets noticed, optimize it for search engines.\n7. Keep It Updated: A portfolio is a living document that should evolve as you complete new projects and gain new skills. Regularly update your portfolio with your latest work and accomplishments to keep it current and relevant.\n8. Promote Your Portfolio: Once your portfolio is ready, promote it through various channels.\n\nBuilding a portfolio is an ongoing process that requires careful planning, curation, and maintenance. By following these steps, you can create a portfolio that effectively showcases your skills and achievements, helping you stand out in your field and achieve your professional goals. Happy building!"
            }
            const res= await request.post("/api/v1/blogs").send(input).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(201);
        });
        test("Input validator", async()=>{
            let input= {
                "title": "Building Your Portfolio (Revised -" + Date.now() + ")"
            }
            const res= await request.post("/api/v1/blogs").send(input).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
        });
    });

    describe("Edit a blog", ()=>{
        /**
         * Two blogs for test case
         * 
         * [
         *  {
         *      id: "66aa9de889bd47fadf9c0b5e",
         *      title: "Building Your Portfolio",
         *      author: "66a6a41fed0f4b484c935469",
         *      ...
         *  },
         *  {
         *      id: "66aaa396235adcdd5094e4bb",
         *      title: "Last Day of Regret",
         *      author: "66a6a38eed0f4b484c935466",
         *      ...
         *  }
         * ]
         */
        let updatedInfo={
            "title": "Building Your Portfolio.",
            "description": "A Step-by-Step Guide to building an impressive portfolio",
            "tags": ["portfolio", "skills"],
            "body": "Creating a portfolio is essential for showcasing your skills, experience, and accomplishments to potential employers, clients, or collaborators. Whether you're a designer, developer, writer, or any other professional, a well-crafted portfolio can set you apart in a competitive market. Here’s a step-by-step guide to help you build an impressive portfolio.\n\n1. Define Your Goals: Before you start building your portfolio, it’s important to define what you want to achieve.\n2. Choose the Right Platform: electing the right platform for your portfolio is crucial.\n3. Curate Your Best Work: Quality over quantity is key when selecting pieces to include in your portfolio. Choose projects that best demonstrate your skills, creativity, and range.\n4. Showcase Your Skills and Experience: In addition to project samples, include sections that highlight your skills, experience, and achievements.\n5. Create a Clean and Professional Design: The design of your portfolio should be clean, professional, and easy to navigate.\n6. Optimize for SEO: To ensure your portfolio gets noticed, optimize it for search engines.\n7. Keep It Updated: A portfolio is a living document that should evolve as you complete new projects and gain new skills. Regularly update your portfolio with your latest work and accomplishments to keep it current and relevant.\n8. Promote Your Portfolio: Once your portfolio is ready, promote it through various channels.\n\nBuilding a portfolio is an ongoing process that requires careful planning, curation, and maintenance. By following these steps, you can create a portfolio that effectively showcases your skills and achievements, helping you stand out in your field and achieve your professional goals. Happy building!"
        }
        test("Check if blogId exist or valid for an author", async ()=>{
            const res= await request.put("/api/v1/blogs/eeaaa396235adcdd5094e4aac").send(updatedInfo).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
        });
        test("Author can only edit their own blog", async ()=>{
            const res= await request.put("/api/v1/blogs/66aaa396235adcdd5094e4bb").send(updatedInfo).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(403);
        });
        test("Successful  request", async ()=>{
            const res= await request.put("/api/v1/blogs/66aa9de889bd47fadf9c0b5e").send(updatedInfo).set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });

    describe("Publish a blog", ()=>{
        /**
         * Two blogs for test case
         * 
         * [
         *  {
         *      id: "66aa9de889bd47fadf9c0b5e",
         *      title: "Building Your Portfolio",
         *      author: "66a6a41fed0f4b484c935469",
         *      ...
         *  },
         *  {
         *      id: "66aaa396235adcdd5094e4bb",
         *      title: "Last Day of Regret",
         *      author: "66a6a38eed0f4b484c935466",
         *      ...
         *  }
         * ]
         */
        test("Check if blogId exist or valid for an author", async ()=>{
            const res= await request.put("/api/v1/blogs/publish/eeaaa396235adcdd5094e4aac").set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
        });
        test("Author can only publish their own blog", async ()=>{
            const res= await request.put("/api/v1/blogs/publish/66aaa396235adcdd5094e4bb").set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(403);
        });
        test("Successful  request", async ()=>{
            const res= await request.put("/api/v1/blogs/publish/66aa9de889bd47fadf9c0b5e").set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });

    test("Get published blogs", async ()=>{
        const res= await request.get("/api/v1/blogs/");
        expect(res.status).toBe(200);
    });

    describe("Get published blog by Id", ()=>{
        test("Handle incorrect Id", async ()=>{
            const res= await request.get("/api/v1/blogs/666f20975a0749eb704efcez9");
            expect(res.status).toBe(400);
        });
        test("successful request", async ()=>{
            /**
            * Blog for test case
            *  {
            *      _id: "66aa9de889bd47fadf9c0b5e",
            *      "title": "Building Your Portfolio."
            *  }
            */
            const res= await request.get("/api/v1/blogs/66aa9de889bd47fadf9c0b5e");
            expect(res.status).toBe(200);
        });
    });

    describe("Get an Author blogs", ()=>{
        test("Author must login to access this endpoint", async ()=>{
            const res= await request.get("/api/v1/blogs/myblogs/");
            expect(res.status).toBe(401);
        });
        test("successful request", async ()=>{
            const res= await request.get("/api/v1/blogs/myblogs/").set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });

    describe("Get an Author blog by Id", ()=>{
        test("Author must login to access this endpoint", async ()=>{
            const res= await request.get("/api/v1/blogs/myblogs/666f20975a0749eb704efcez9");
            expect(res.status).toBe(401);
        });
        test("Handle incorrect Id/ Can not access other authors blog", async ()=>{
            const res= await request.get("/api/v1/blogs/myblogs/666f20975a0749eb704efcez9").set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
        });
        test("successful request", async ()=>{
            /**
            * Blog for test case
            *  {
            *      _id: "66aa9de889bd47fadf9c0b5e",
            *      "title": "Building Your Portfolio."
            *  }
            */
            const res= await request.get("/api/v1/blogs/myblogs/66aa9de889bd47fadf9c0b5e").set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });

    describe("Search  published blogs", ()=>{
        test("Search parameter allowed are only author, title, and tags", async ()=>{
            const res= await request.get("/api/v1/blogs/search/any_other_params?keyword=portfolio");
            expect(res.status).toBe(400);
        });
        test("successful request", async ()=>{
            const res= await request.get("/api/v1/blogs/search/tags?keyword=portfolio");
            expect(res.status).toBe(200);
        });
    });

    describe("Search  an author blogs", ()=>{
        test("Author must login to access this endpoint", async ()=>{
            const res= await request.get("/api/v1/blogs/myblogs/search/tags/?keyword=blog");
            expect(res.status).toBe(401);
        });
        test("Search parameter allowed are only  title and tags", async ()=>{
            const res= await request.get("/api/v1/blogs/myblogs/search/any_other_params_including_author?keyword=portfolio").set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
        });
        test("successful request", async ()=>{
            const res= await request.get("/api/v1/blogs/myblogs/search/title?keyword=portfolio").set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });

    describe("Delete a blog", ()=>{
        test("Author must login to access this endpoint", async ()=>{
            const res= await request.delete("/api/v1/blogs/66aaa396235adcdd5094e4bb");
            expect(res.status).toBe(401);
        });
        test("Author can only delete their own blog", async ()=>{
            const res= await request.delete("/api/v1/blogs/66aaa396235adcdd5094e4bb").set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
        test.skip("successful request", async ()=>{
            const res= await request.delete("/api/v1/blogs/66aaa396235adcdd5094e4bb").set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });
});