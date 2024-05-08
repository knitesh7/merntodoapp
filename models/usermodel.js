const {Schema,model} = require("mongoose")


const todoSchema = Schema({
    val:{type:String,required:true},
    done:{type:Boolean},
    createdAt:{type:String}
    // userId:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'users'
    // }
})

const userSchema = Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    image:{type:String},
    todos:[todoSchema]
})

const userModel = model("users",userSchema)

module.exports = userModel