const mongoose=require('mongoose');
const bcrypt = require('bcrypt');

const Schema =mongoose.Schema;

const UserSchema = new Schema({

    username:{
        type:String,
        required:true,
        trim:true},
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
         },
    password:{
        type:String,
        required:true,  
        },
    picture:{
        type:String,
        default:'./upload/picture.jpg'
        },  
    bio:{type:String} ,    
    followers:{type:[String]},
    following:{type:[String]},
    likes:{type:[String]},

    
    
},  {timestamps: true }
)

//run the function befor saving the user into database 
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password,salt);
    next();
})
module.exports=UserModel=mongoose.model('user',UserSchema);