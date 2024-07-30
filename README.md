# Blog API

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [Login User](#login-user)
  - [Signup a new User](#signup-a-new-user)
  - [Update User data](#update-user-data)
  - [Get All Users](#get-all-users)
  - [Get a User](#get-a-user)
  - [Create a Blog](#create-a-blog)
  - [Publish a Blog](#publish-a-blog)
  - [Edit a Blog](#edit-a-blog)
  - [Get All Published Blogs](#get-all-published-blogs)
  - [Get Published Blog by Id](#get-published-blog-by-id)
  - [Get an Author Blogs](#get-an-author-blogs)
  - [Get Author Blog by Id](#get-author-blog-by-id)
  - [Search Published Blogs](#search-published-blogs)
  - [Search an Author Blogs](#search-an-author-blogs)
  - [Delete a Blog by Id](#delete-a-blog-by-id)
- [Error Handling](#error-handling)
- [Dependencies](#dependencies)
- [Upcoming Features](#upcoming-features)
- [Contact](#contact)

## Introduction

The Blog API is a RESTful service built with Express.js, designed to manage blog posts. It supports creating, reading, updating, and deleting blog posts, and provides endpoints for user to sign up and sign in into the blog app. copy this link [https://blog-api-ui1e.onrender.com/](https://blog-api-ui1e.onrender.com/) to test endpoints on live server.

## Features

- **RESTful**: RESTful API endpoints for CRUD operations on blogs and users.
- **User authentication**: Use JWT as authentication strategy and expire the token after 1 hour.
- **Pagination**: Endpoints that return list of data are paginated.
- **Blog state**: Blogs can be in two states(draft or published) and filterable by it.
- **Search**: Blogs are searchable by author, title and tags. Users are searchable by name.
- **Validation and error handling**: Middleware for request validation and proper error handling.
- **Security**: HTTP is secure against Cross-Site Scripting (XSS), brute force, and other malicious attacks.
- **Rate limiting**: Requests are limited to 100 within 10 minutes per IP address
- **Logging**: Request to endpoints, error, and information are logged and store in a log file.
- **Additional features**: The number of times a blog is read are recorded. Also, there's an algorithm that estimate the expected read time for a blog.

## Technologies Used

- MongoDB (atlas)
- Express.js
- Node.js
- Jest
- Supertest

## Installation

1. Clone the repository:

```sh
    git clone https://github.com/zaladeokin/Blog_Api.git
```

2. Navigate to the project directory:

```sh
    cd Blog_Api
```

3. Install dependencies:

```sh
    npm install
```

4. Create a .env file in the root directory and add the following environment variables

   - EMAIL=zaladeokin@gmail.com
   - PHONE_NUMBER=+2348135994222
   - LINKEDIN=https://www.linkedin.com/in/zacchaeus-aladeokin-7b334a22a/
   - PORT=4000
   - CONN_URL=your_database_CONN_URL
   - JWT_SECRET=any_string_combinations

5. Start the server:

```sh
    node app.js
```

6. Test (Development only):

```sh
    npm test
```

## Usage

Once the server is running, you can use a tool like Postman or curl to interact with the API endpoints.

## Endpoints

### Login User

- **URL:** `/api/v1/auth/login`
- **Method:** `POST`
- **Description:** Login a user and generate a token for authentication. The token must be passed as a Bearer token in the Authourization Header of request to access protected endpoints.
- **Request Body:**

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Logged in Successfully.",
  "token": "token"
}
```

### Signup a new User

- **URL:** `/api/v1/users`
- **Method:** `POST`
- **Description:** Register a new user. Email must be unique(i.e not used by a existing user) and **password** and **repeat_password** must match for registration to be successful.
- **Request Body:**

```json
{
  "email": "user@email.com",
  "first_name": "Firstname",
  "last_name": "Lastname",
  "password": "password",
  "repeat_password": "password"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "User created successfully"
}
```

### Update User data

- **URL:** `/api/v1/users/:id`
- **Method:** `PUT`
- **Authorization**: Bearer Token
- **Description:** Updates an existing user data(email, firstname, and lastname). The user Id must be pass as parameter.
  - _Note_: Password can not be updated via this endpoint but must be provided for additional authentication (2FA).
- **Request Body:**

```json
{
  "email": "user1@email.com",
  "first_name": "Firstnames",
  "last_name": "Lastnames",
  "password": "password"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "User information updated"
}
```

### Get All Users

- **URL:** `/api/v1/users`
- **Method:** `GET`
- **Query Parameters**:
  - **page**(optional) : The current page, default to 1.
  - **limit**(optional) : Number of users to return per page, default to 20.
  - **keyword**(optional) : string to filter list of users.
- **Description:** Retrieves the list of users.
- **Response:**

```json
    {
        "success": true,
        "users": [
            {
                "_id": "userId",
                "first_name": "Joyce",
                "last_name": "Richardo"
            },
            ...
        ],
        "limit": 20,
        "current_page": 1,
        "total_pages": 1
    }
```

### Get a User

- **URL:** `/api/v1/users/:id`
- **Method:** `GET`
- **Description:** Retrieves a user information by Id.
- **Response:**

```json
{
  "success": true,
  "user": {
    "_id": "userId",
    "email": "joyce1@email.com",
    "first_name": "Joyce",
    "last_name": "Richardo"
  }
}
```

### Create a Blog

- **URL:** `/api/v1/blogs`
- **Method:** `POST`
- **Authorization**: Bearer Token
- **Description:** This endpoint create a new blog and automatically estimate _read_time_ (an average time(unit of seconds) to finish reading the blog). Newly created blog will be in a draft state and _read_count_ is set to zero
- **Request Body:**

```json
{
  "title": "Building your portfolio (part 1).",
  "description": "web development masterclass",
  "body": "Building a portfolio is essential for showcasing your skills and accomplishments, whether you're a creative professional, a developer, or someone in a different field. Here’s a quick guide to help you get started\n1. Identify Your Audience Understanding who will be viewing your portfolio is crucial. Tailor your content to meet their expectations and highlight the skills they value the most.\n2. Select Your Best Work Quality over quantity. Choose projects that demonstrate your expertise and versatility. Include a variety of work to show the range of your abilities.\n3. Showcase the Process Clients and employers love to see how you think Include sketches, drafts, and explanations of your process. This gives insight into your problem-solving skills and creativity.",
  "tags": ["software", "blog", "portfolio"]
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "blog": {
    "title": "Building your portfolio (part 1).",
    "description": "web development masterclass",
    "author": "666f20975a0749eb704efce4",
    "state": "draft",
    "read_count": 0,
    "reading_time": 10.5,
    "body": "Building a portfolio is essential for showcasing your skills and accomplishments, whether you're a creative professional, a developer, or someone in a different field. Here’s a quick guide to help you get started\n1. Identify Your Audience Understanding who will be viewing your portfolio is crucial. Tailor your content to meet their expectations and highlight the skills they value the most.\n2. Select Your Best Work Quality over quantity. Choose projects that demonstrate your expertise and versatility. Include a variety of work to show the range of your abilities.\n3. Showcase the Process Clients and employers love to see how you think Include sketches, drafts, and explanations of your process. This gives insight into your problem-solving skills and creativity.",
    "tags": ["software", "blog", "portfolio"],
    "timestamp": "2024-07-13T13:01:38.306Z",
    "_id": "6693a800c2acbb05a1a63797",
    "__v": 0
  }
}
```

### Publish a Blog

- **URL:** `/api/v1/blogs/publish/:id`
- **Method:** `PUT`
- **Authorization**: Bearer Token
- **Description:** This endpoint allows author to change the state of their blog from draft to published. Only published blogs are available to other users, and author are only allowed to publish blogs created by them.
- **Response:**

```json
{
  "success": true,
  "message": "Blog published successfully"
}
```

### Edit a blog

- **URL:** `/api/v1/blogs/:id`
- **Method:** `PUT`
- **Authorization**: Bearer Token
- **Description:** This endpoint allow author to modify blogs properties created by them. Author is not allowed to modify _timestamp_, _author_, _reading_time_ and _read_count_ properties. However, _read_time_ is recalculated and updated.
- **Request Body:**

```json
{
  "title": "Building your portfolio.",
  "description": "web development masterclass",
  "state": "published",
  "body": "Building a portfolio is essential for showcasing your skills and accomplishments, whether you're a creative professional, a developer, or someone in a different field. Here’s a quick guide to help you get started\n1. Identify Your Audience Understanding who will be viewing your portfolio is crucial. Tailor your content to meet their expectations and highlight the skills they value the most.\n2. Select Your Best Work Quality over quantity. Choose projects that demonstrate your expertise and versatility. Include a variety of work to show the range of your abilities.\n3. Showcase the Process Clients and employers love to see how you think Include sketches, drafts, and explanations of your process. This gives insight into your problem-solving skills and creativity.",
  "tags": ["software", "blog", "portfolio"]
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Blog edited successfully"
}
```

### Get All Published Blogs

- **URL:** `/api/v1/blogs`
- **Method:** `GET`
- **Query Parameters**:
  - **page**(optional) : The current page, default to 1.
  - **limit**(optional) : Number of users to return per page, default to 20.
- **Description:** Retrieves the list of blogs with author's information. Blogs are order by (highest) read_count, (lowest) reading_time and (latest) timestamp.
- **Response:**

```json
    {
        "success": true,
        "blogs": [
            {
                "_id": "6693a800c2acbb05a1a63797",
                "title": "Grace at UK.",
                "description": "My trip to UK.",
                "author": {
                    "_id": "666f1ff79181431b43edc052",
                    "first_name": "Grace",
                    "last_name": "Favor"
                },
                "read_count": 4,
                "reading_time": 10.5,
                "tags": [
                    "Test",
                    "blog",
                    "UK"
                ],
                "timestamp": "2024-07-14T10:27:12.286Z"
            },
            ...
        ],
        "limit": 20,
        "current_page": 2,
        "total_pages": 5
    }
```

### Get Published Blog by Id

- **URL:** `/api/v1/blogs/:id`
- **Method:** `GET`
- **Description:** Retrieves a blog by Id with author's information.
  - _Note_:
    - reading_time is recorded in unit of seconds.
    - For every request make to this endpoint, read_count is increased by 1 and update reflects on the next request.
- **Response:**

```json
{
  "success": true,
  "blog": {
    "_id": "66805b931fc1c063514d1d18",
    "title": "Building your portfolio.",
    "description": "web development masterclass",
    "body": "Building a portfolio is essential for showcasing your skills and accomplishments, whether you're a creative professional, a developer, or someone in a different field. Here’s a quick guide to help you get started\n1. Identify Your Audience Understanding who will be viewing your portfolio is crucial. Tailor your content to meet their expectations and highlight the skills they value the most.\n2. Select Your Best Work Quality over quantity. Choose projects that demonstrate your expertise and versatility. Include a variety of work to show the range of your abilities.\n3. Showcase the Process Clients and employers love to see how you think Include sketches, drafts, and explanations of your process. This gives insight into your problem-solving skills and creativity.",
    "author": {
      "_id": "666f20975a0749eb704efce4",
      "first_name": "Zacchaeus",
      "last_name": "Aladeokin",
      "email": "zaladeokin@gmail.com"
    },
    "read_count": 26,
    "reading_time": 300,
    "tags": ["software", "blog", "portfolio"],
    "timestamp": "2024-06-29T19:08:03.776Z"
  }
}
```

### Get an Author Blogs

- **URL:** `/api/v1/blogs/myblogs`
- **Method:** `GET`
- **Authorization**: Bearer Token
- **Query Parameters**:
  - **page**(optional) : The current page, default to 1.
  - **limit**(optional) : Number of users to return per page, default to 20.
  - **state**(optional) : Value can either be _draft_ or _published_. if **state** is not set, blogs in both draft and published state will be return.
- **Description:** Retrieves the list of blogs created by an author whether it is in publish or draft state. Blogs are order by (latest) timestamp, (highest) read_count, (lowest) and reading_time.
- **Response:**

```json
    {
        "success": true,
        "blogs": [
            {
                "_id": "6693a800c2acbb05a1a63797",
                "title": "Grace at UK.",
                "description": "My trip to UK.",
                "state": "draft",
                "read_count": 4,
                "reading_time": 10.5,
                "tags": [
                    "Test",
                    "blog",
                    "UK"
                ],
                "timestamp": "2024-07-14T10:27:12.286Z"
            },
            ...
        ],
        "limit": 20,
        "current_page": 1,
        "total_pages": 2
    }
```

### Get Author Blog by Id

- **URL:** `/api/v1/blogs/myblogs/:id`
- **Method:** `GET`
- **Authorization**: Bearer Token
- **Description:** Retrieves an author's blog by Id. Author can't access blog created by another user.
  - _Note_: reading_time is recorded in unit of seconds.
- **Response:**

```json
{
  "success": true,
  "blog": {
    "_id": "66805b931fc1c063514d1d18",
    "title": "Building your portfolio.",
    "description": "web development masterclass",
    "state": "draft",
    "body": "Building a portfolio is essential for showcasing your skills and accomplishments, whether you're a creative professional, a developer, or someone in a different field. Here’s a quick guide to help you get started\n1. Identify Your Audience Understanding who will be viewing your portfolio is crucial. Tailor your content to meet their expectations and highlight the skills they value the most.\n2. Select Your Best Work Quality over quantity. Choose projects that demonstrate your expertise and versatility. Include a variety of work to show the range of your abilities.\n3. Showcase the Process Clients and employers love to see how you think Include sketches, drafts, and explanations of your process. This gives insight into your problem-solving skills and creativity.",
    "read_count": 26,
    "reading_time": 300,
    "tags": ["software", "blog", "portfolio"],
    "timestamp": "2024-06-29T19:08:03.776Z"
  }
}
```

### Search Published Blogs

- **URL:** `/api/v1/blogs/search/:param`
- **Method:** `GET`
- **:param**: The parameter to search by (value can either be _author_, _title_, or _tags_).
- **Query Parameters**:
  - **keyword**: The search query string.
  - **page**(optional) : The current page, default to 1.
  - **limit**(optional) : Number of users to return per page, default to 20.
- **Description:** This endpoint allows users to search through plublished blogs using three parameter (author, title, tags). Result are ordered by (highest) read_count, (lowest) reading_time and (latest) timestamp.
- **example**:

```http
GET /api/v1/blogs/search/author?keyword=grace&limit=25&page=2
```

```http
GET /api/v1/blogs/search/title?keyword=development&limit=25&page=2
```

```http
GET /api/v1/blogs/search/tags?keyword=motivation&limit=25&page=2
```

- **Response:**

```json
    {
        "success": true,
        "blogs": [
            {
                "_id": "6693a800c2acbb05a1a63797",
                "title": "Grace at UK.",
                "description": "My trip to UK.",
                "author": {
                    "_id": "666f1ff79181431b43edc052",
                    "first_name": "Grace",
                    "last_name": "Favor"
                },
                "read_count": 4,
                "reading_time": 10.5,
                "tags": [
                    "Test",
                    "blog",
                    "UK"
                ],
                "timestamp": "2024-07-14T10:27:12.286Z"
            },
            ...
        ],
        "limit": 25,
        "current_page": 2,
        "total_pages": 2
    }
```

### Search an Author Blogs

- **URL:** `/api/v1/blogs/myblogs/search/:param`
- **Method:** `GET`
- **Authorization**: Bearer Token
- **:param**: The parameter to search by (value can either _title_ or _tags_).
- **Query Parameters**:
  - **keyword**: The search query string.
  - **page**(optional) : The current page, default to 1.
  - **limit**(optional) : Number of users to return per page, default to 20.
- **Description**: This endpoint allows author to search through blogs created by them using using two parameter (title, tags). Result are ordered by (highest) read_count, (lowest) reading_time and (latest) timestamp.
- **example**:

```http
GET /api/v1/blogs/myblogs/search/title?keyword=grace&limit=5&page=1
```

```http
GET /api/v1/blogs/myblogs/search/tags?keyword=UK&limit=5&page=1
```

- **Response:**

```json
    {
        "success": true,
        "blogs": [
            {
                "_id": "6693a800c2acbb05a1a63797",
                "title": "Grace at UK.",
                "description": "My trip to UK.",
                "author": {
                    "_id": "666f1ff79181431b43edc052",
                    "first_name": "Grace",
                    "last_name": "Favor"
                },
                "read_count": 4,
                "reading_time": 10.5,
                "tags": [
                    "Test",
                    "blog",
                    "UK"
                ],
                "timestamp": "2024-07-14T10:27:12.286Z"
            },
            ...
        ],
        "limit": 5,
        "current_page": 1,
        "total_pages": 2
    }
```

### Delete a Blog by Id

- **URL:** `/api/v1/blogs/:id`
- **Method:** `DELETE`
- **Authorization**: Bearer Token
- **Description:**: This endpoint allows Author to delete blog created by them.
- **Response:**

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

## Error Handling

Errors are returned in the following format:

```json
{
  "success": false,
  "message": "Blog does not exist."
}
```

Endpoints set an appropiate status code and returns a JSON for different scenarios. The following properties are set when an error occur:

- **success**: The value is set to **false** when an error occurred, otherwise **true**.
- **message** contains information about the error.
  - _Note_: On successful request, additional properties may be added depending on the endpoint been called.

## Dependencies

- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [body-Parser](https://github.com/expressjs/body-parser)
- [dotenv](https://github.com/motdotla/dotenv)
- [express](https://expressjs.com/)
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
- [helmet](https://github.com/helmetjs/helmet)
- [jest](https://github.com/jestjs/jest)
- [joi](https://github.com/howardmann/validation)
- [jsonwebtoken](https://github.com/evanshortiss/express-joi-validation)
- [mongoose](https://github.com/madhums/node-express-mongoose-demo)
- [morgan](https://github.com/expressjs/morgan)
- [morgan-json](https://github.com/indexzero/morgan-json)
- [nodemon](https://github.com/remy/nodemon) (for development)
- [passport](https://github.com/jaredhanson/passport)
- [passport-jwt](https://github.com/mikenicholson/passport-jwt)
- [passport-local](https://github.com/jaredhanson/passport-local)
- [supertest](https://github.com/visionmedia/supertest/packages)
- [winston](https://github.com/bithavoc/express-winston)

## Upcoming Features

- Reset password
- Change password
- Multimedia

## Contact

Email: [zaladeokin@gmail.com](https://mailto:zaladeokin@gmail.com)  
Phone: (+234)8135994222
