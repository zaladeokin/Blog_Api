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
  - [Get All Users](#get-all=users)
  - [Get a User](#get-a-user)
- [Error Handling](#error-handling)
- [Dependencies](#dependencies)
- [Contact](#contact)

## Introduction

The Blog API is a RESTful service built with Express.js, designed to manage blog posts. It supports creating, reading, updating, and deleting blog posts, and provides endpoints for user to sign up and sign in into the blog app. Use [Blog_Api endpoints](https://blog-api-ui1e.onrender.com/) to test endpoints on live server.


## Features

- **RESTful**: RESTful API endpoints for CRUD operations on blogs and users.
- **User authentication**: Use JWT as authentication strategy and expire the token after 1 hour.
- **Pagination**: Endpoints that return list of data are paginated.
- **Blog state**: Blogs can be in two states(draft and published) and filterable by it.
- **Search**: Blogs are searchable by author, title and tags. Users are searchable by name.
- **Validation and error handling**: Middleware for request validation and proper error handling.
- **Security**: HTTP is secure against Cross-Site Scripting (XSS), brute force, and other malicious attacks.
- **Logging**: Request to endpoints, error, and information are logged and store in a log file.
- **Additional features**: The number of times a blog is read are recorded. Also, there's an algorithm that estimate the expected read time for a blog.


## Technologies Used

- MongoDB (atlas)
- Express.js
- Node.js
- HTML


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

6. Test:
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
        "email" : "user@email.com",
        "first_name" : "Firstname",
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
- **Description:** Updates an existing user data(email, firstname, and lastname). The user Id must be pass as parameter. Note, Password can not be updated via this endpoint but must be provided for additional authentication (2FA).
- **Request Body:**
```json
    {
        "email" : "user1@email.com",
        "first_name" : "Firstnames",
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
    - **page**(optional) : The current page, default is 1.
    - **limit**(optional) : Number of users to return per page, default is 20.
    - **keyword**(optional) :  string to filter list of users.
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
            "email" : "joyce1@email.com",
            "first_name": "Joyce",
            "last_name": "Richardo"
        }
    }
```

### Get All Published Blogs

- **URL:** `/api/v1/blogs`
- **Method:** `GET`
- **Query Parameters**:
    - **page**(optional) : The current page, default is 1.
    - **limit**(optional) : Number of users to return per page, default is 20.
- **Description:** Retrieves the list of blogs with author's information. Blogs are order by (highest) read_count, (lowest) reading_time and (latest) timestamp
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


## Error Handling
Errors are returned in the following format:
```json
    {
        "success": false,
        "message": "Blog does not exist."
    }
```
The API set an appropiate status code and returns a JSON for different scenarios. The following properties are set when an error occur:

- **success**: The value is set to **false** when an error occurred, otherwise **true**.
- **message** contains information about the error.
- *Note*: On successful request, additional properties may be added depending on the endpoint been called.


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


## Contact

Email: [zaladeokin@gmail.com](https://mailto:zaladeokin@gmail.com)  
Phone: (+234)8135994222