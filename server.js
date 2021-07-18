const express = require('express');
const userRoutes=require('./routes/user.routes')
const app =express();
require('dotenv').config({path:'./config/.env'});
const mongoose=require('mongoose');


//exporting the global variables
const PORT =process.env.PORT ||6000
const DB_URI = process.env.DB_URI


app.use(express.json())
app.use('/api/user' , userRoutes)


//linking the Database

mongoose.connect(DB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false

})
.then(()=>{
    console.log('Database is connected successfully')
})
.catch((err)=>{
    if(err)throw err 
})

//server on listen
app.listen(PORT, ()=>{
   console.log(`Server is up and listening on port: ${PORT}`)
     
}

)