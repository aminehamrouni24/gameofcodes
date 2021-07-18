const UserModel=require('../models/User')

//always in relation with the datbase
const ObjectID=require('mongoose').Types.ObjectId;


// @route GET api/user/
// @desc consult users
// @access Private
module.exports.getAllUsers= async(req,res)=>{
    const users = await UserModel.find().select('-password')
    res.status(201)
    .json( users )

    console.log(users)
}

// @route GET api/user/:id
// @desc consult user infos
// @access Private

module.exports.userInfo=(req,res)=>{
    const{id}=req.params;
    if(!ObjectID.isValid(id))
    return res.status(400).send(`Unknown id : ${id}`)
    UserModel.findById(id,(err,docs)=>{
      if(!err)res.send(docs);
      else console.log(err)
    }).select('-password')

}

// @route PUT api/user/:id
// @desc update the bio field only 
// @access Private
module.exports.updateUser=async(req,res)=>{
    const{id}=req.params;
    if(!ObjectID.isValid(id))
    return res.status(400).send(`Unknown id : ${id}`)
    try{
      await UserModel.findOneAndUpdate(id,{
          $set:{bio:req.body.bio}
      },
      {new:true, upsert:true, setDefaultOnInsert:true},
      (err,docs)=>{
          if(!err)return res.status(200).json({status:true,data:docs})
          if(err)return res.status(500).json({status:false,message:'this is an update error'})
  
      }
      )
    }catch(err){
       if(err)throw err
       res.status(500).json({status:false,message:'could not achieve the update'})
    }

}


// @route GET api/user/:id
// @desc consult user infos
// @access Private

module.exports.userInfo=(req,res)=>{
    const{id}=req.params;
    if(!ObjectID.isValid(id))
    return res.status(400).send(`Unknown id : ${id}`)
    UserModel.findById(id,(err,docs)=>{
      if(!err)res.send(docs);
      else console.log(err)
    }).select('-password')

}

// @route DELETE api/user/:id
// @desc delete user
// @access Private
module.exports.deleteUser= async (req,res)=>{
    const{id}=req.params;
    if(!ObjectID.isValid(id))
    return res.status(400).send(`Unknown id : ${id}`)
    try{
      await UserModel.deleteOne({_id:id})
      res.status(201).json({status:true,message:'User deleted successfully'})
    }catch(err){
       if(err)throw err
       res.status(500).json({status:false,message:'could not delete the user'})
    }

}

// @route PATCH api/user/follow/:id
// @desc update the follow array user
// @access Private
module.exports.follow= async (req,res)=>{
    const{id}=req.params;
    if(!ObjectID.isValid(id)|| !ObjectID.isValid(req.body.idToFollow))
    return res.status(400).send(`Unknown id : ${id}`)
    try{
        //add followers list
        await UserModel.findByIdAndUpdate(id,
            {$addToSet:{following: req.body.idToFollow}},
            {new:true,upsert:true},
            (err,docs)=>{
                if(!err) res.status(201).json(docs)
                else return res.status(400).json({status:false,message:'could not follower'})
            }
            )
        //add following list
        await UserModel.findByIdAndUpdate(req.body.idToFollow,
            {$addToSet:{followers:id}},
            {new:true,upsert:true},
            (err,docs)=>{
                
                if(err) return res.status(400).json({status:false,message:'could not following'})
            }
            )    

    }catch(err){
       if(err)throw err
       res.status(500).json({status:false,message:'could not make the following action'})
    }

}

// @route PATCH api/user/unfollow/:id
// @desc update the follow array user
// @access Private
module.exports.unfollow= async (req,res)=>{
    const{id}=req.params;
    if(!ObjectID.isValid(id)|| !ObjectID.isValid(req.body.idToUnfollow))
    return res.status(400).send(`Unknown id : ${id}`)
    try{
        //remove from followers list
        await UserModel.findByIdAndUpdate(id,
            {$pull:{following: req.body.idToUnfollow}},
            {new:true,upsert:true},
            (err,docs)=>{
                if(!err) res.status(201).json(docs)
                else return res.status(400).json({status:false,message:'could not unfollower'})
            }
            )
        //remove from  unfollowing list
        await UserModel.findByIdAndUpdate(req.body.idToUnfollow,
            {$pull:{followers:id}},
            {new:true,upsert:true},
            (err,docs)=>{
                
                if(err) return res.status(400).json({status:false,message:'could not following'})
            }
            )    

    }catch(err){
       if(err)throw err
       res.status(500).json({status:false,message:'could not make the unfollowing action'})
    }

}