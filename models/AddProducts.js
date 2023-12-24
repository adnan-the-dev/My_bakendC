const mongoose = require('mongoose')

let productsSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    discount:{
        type:String,
        require:true
    },
    images:{
        type:String,
        require:true
    }
    
},
{timestamps:true}
)

module.exports = mongoose.model("Products" , productsSchema)