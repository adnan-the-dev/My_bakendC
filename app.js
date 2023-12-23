let AllUser = require("./models/User")
const mongoose = require('mongoose')
const express = require('express');
const bcypt = require('bcrypt')
const dotenv = require('dotenv');
const morgan = require ('morgan');
const cors = require('cors')

const app = express()
app.use(cors())
app.use(morgan("common"));


dotenv.config();

const { MONGO_URL } = process.env
console.log(MONGO_URL, 'hgsaghgfhj');


app.use(express.json())

// mongoo connection
mongoose.connect(MONGO_URL).then(() => {
    console.log('succesfully connected to database');
    app.listen(8800, () => {
        console.log("server is running");
    })
}).catch((err) => {
    console.log("an error occured", err);
})

// register API

app.post('/register', async (req, res) => {
    try {
        const salt = await bcypt.genSalt(10)
        const bcryptPssword = await bcypt.hash(req.body.password, salt)

        const user = new AllUser({
            username: req.body.username,
            email: req.body.email,
            password: bcryptPssword
            // password: req.body.password
        })
       const saveUser = await user.save()
        return res.json(saveUser)
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message:e.message || "some error ecured"
        })
    }
})
// Login API

app.post('/login', async (req, res) => {
    try {
        const user = await AllUser.findOne({email:req.body.email});
        !user && res.status(404).send("user not found")

        const checkPassword = await bcypt.compare(req.body.password, user.password)
        !checkPassword && res.status(400).json("wrond password")
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

//delete user
app.delete('/:id', async (req, res) => {
    try {
        const user = await AllUser.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send("Account not found.");
        }
        res.send("Account has beec deleted")
    } catch (e) {
        return res.json(e)
    }
})
//update user
app.put('/update-user/:id', async (req, res) => {
    try {
       const {username , email} = req.body
       const newUser = {username , email}
        const user = await AllUser.findByIdAndUpdate(req.params.id,  {$set: newUser})
        return res.status(200).json({status:"Success" , result:user} )
    } catch (e) {
        return res.status(500).json(e)
    }
})

//get all user
app.get('/users', async (req, res) => {
    try {
        const users = await AllUser.find()
        return res.json(users)
    } catch (e) {
        return res.status(500).json(e)
    }
})
