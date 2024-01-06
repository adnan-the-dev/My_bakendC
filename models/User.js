let mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
let userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 4,
        max: 10,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 15
    },
    description: {
        type: String,
        max: 40
    },
    tokens: [
        {
            token: {
                type: String,
                require: true,
            }
        }
    ]
},
    { timestamps: true }
)

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token; 
    } catch (err) {
        console.log(err)
    }
}
module.exports = mongoose.model('AllUser', userSchema)