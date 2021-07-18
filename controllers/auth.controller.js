const mongoose=require('mongoose');
const UserModel = require('../models/User');

const validateRegisterInput = require('../validators/login')




// @route POST api/user/register
// @desc Register user
// @access Public
module.exports.signUp=  async (req,res)=>{

    const {username,email,password,password2}=req.body;
    const {errors, isValid} = validateRegisterInput(req.body);
  
     
    try{
        if(!isValid) {
            return res.status(400).json(errors)
          }
      const existingEmail= await UserModel.findOne({email:email})
      if(existingEmail){ 
      errors.email = 'Email already exist';
      return res.status(400).json(errors);}

      else if(password!==password2){
          res.send('Please verify passwords')
      }
     else{
        const user =  await UserModel.create({username,email,password})
        return  res.status(201).json({status:true,message:'user created successfully', data:user})
     }

    }
    catch(err){
        if (err)throw err
        res.status(401).json({status:false,message:'could not create the user'})
    }
}