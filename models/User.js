let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:4,
        max:10,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:15
    },
    description:{
        type:String,
        max:40
    }
},
{timestamps:true}
)

module.exports = mongoose.model('AllUser' , userSchema)