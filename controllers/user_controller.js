const UserModel = require('../models/user');

async function getAllUsers(req, res, next) {
    const keyword= req.query.keyword || false;
    let filter= undefined;
    if(keyword){//Search users by keyword
        const regX= new RegExp(keyword, 'i');
        filter= {
            $or:[
                {first_name: {$regex: regX}},
                {last_name: {$regex: regX}}
            ]
        }
    }

    try{//Model might throw error
        const no_of_rows= keyword ? await UserModel.countDocuments(filter) : await UserModel.countDocuments();
        let page= req.query.page || 1;
        const limit= req.query.limit || 20;//No of item per page
        const total_pages= no_of_rows > limit ? Math.ceil(no_of_rows/limit) : 1;
        if(page > total_pages) page= total_pages;
        const offset= (page - 1) * limit; //No of item to skip, i.e. index where to start next page

        const users= keyword ? await UserModel.find(filter, '_id first_name last_name', {skip: offset, limit: limit}).sort({first_name: 1, last_name: 1}) : await UserModel.find({}, '_id first_name last_name', {skip: offset, limit: limit}).sort({first_name: 1, last_name: 1});

        res.json({
            success: true, 
            users: users,
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

async function getUserById(req, res, next) {
   const userId= req.params.id;
  
   try{//Model might throw error 
        const user= await UserModel.findById(userId, '_id first_name last_name email');

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid user Id"
            });
        }

        res.json({
            success: true,
            user: user
        }); 
    }catch(err){
        next({
            status: 400,
            success: false,
            message: err
        });
    }
}

async function addUser(req, res, next) {
    const user= req.body

    try{//Model might throw error 
        const exist = await UserModel.countDocuments({ email: user.email });
        if(exist > 0){// Check if a user already exited
            next({
                status: 409,
                success: false,
                message: "Email has been registered by a user"
            });
            return;
        }

        //Register new user
        await UserModel.create(user)
        res.status(201)
        res.json({
            success: true,
            message: "User created successfully"
        });
    }catch(err){
        next({
            status: 500,
            success: false,
            message: err
        });
    }
}

async function updateUser(req, res, next) {
    let userId= req.params.id;
    //Ensures user can only update their own data
    if(userId != req.user._id){
        res.status(403);
        return res.json({
            success: false,
            message: "Action forbidden"
        });
    }
    // Get User new info
    const newInfo= req.body;
    
    try{//Model might throw error 
        // Use Password for authorizing update
        const user = await UserModel.findById(userId);
        const validate = await user.isValidPassword(newInfo.password);
        if(!validate){
            res.status(401);
            return res.json({
                success: false,
                message: "Incorrect password"
            });
        }

        //Update Infoo
        await UserModel.findByIdAndUpdate(userId, { $set: { email: newInfo.email, first_name: newInfo.first_name, last_name: newInfo.last_name }})

        res.json({
            success: true,
            message: "User information updated"
        });
    }catch(err){
        next({
            status: 500,
            success: false,
            message: err
        });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser
}