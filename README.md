# Blog API

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - 
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
- **Security**: HTTP is secure against Cross-Site Scripting (XSS), brute force and other malicious attacks.
- **Logging**: Request to endpoints, error and information are logged and store in a log file.
- **Additional features**: The number of time a blog is read is recorded. Also, there's an algorithm that estimate the expected read time for a blog.


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


## Usage

Once the server is running, you can use a tool like Postman or curl to interact with the API endpoints.


## Endpoints



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
- [joi](https://github.com/howardmann/validation)
- [jsonwebtoken](https://github.com/evanshortiss/express-joi-validation)
- [mongoose](https://github.com/madhums/node-express-mongoose-demo)
- [morgan](https://github.com/expressjs/morgan)
- [morgan-json](https://github.com/indexzero/morgan-json)
- [nodemon](https://github.com/remy/nodemon) (for development)
- [passport](https://github.com/jaredhanson/passport)
- [passport-jwt](https://github.com/mikenicholson/passport-jwt)
- [passport-local](https://github.com/jaredhanson/passport-local)
- [winston](https://github.com/bithavoc/express-winston)


## Contact

Email: [zaladeokin@gmail.com](https://mailto:zaladeokin@gmail.com)  
Phone: (+234)8135994222