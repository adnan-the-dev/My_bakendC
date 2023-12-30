const AllUser = require("./models/User")
const Products = require("./models/AddProducts")
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
        res.send("Account has been deleted")
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
// ***********************Products_Api********************
// let products = [
//     {
//       name: "2 Piece Velvet",
//       price: "2,3",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC07248_7cb87d39-e8cc-4a0b-a030-009d81a81d06_533x.jpg?v=1701863047",
//     },
//     {
//       name: "2 Piece Velvet",
//       price: "9,699",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC08122_533x.jpg?v=1701671641",
//     },
//     {
//       name: "2 Piece Khaddar Suit",
//       price: "2,599",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC08076_533x.jpg?v=1701067463",
//     },
//     {
//       name: "Linen Kurti",
//       price: "3,799",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC03913_1_533x.jpg?v=1700725699",
//     },
//     {
//       name: "3 Piece Khaddar Suit",
//       price: "3,699",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC03165_fb961010-dbdf-4754-8e2b-c8a9f24985e3_533x.jpg?v=1701690290",
//     },
//     {
//       name: "Leather Coat",
//       price: "7,499",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC09949_533x.jpg?v=1701848439",
//     },
//     {
//       name: "Khaddar Shirt Printed",
//       price: "1,199",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC00789_533x.jpg?v=1701766180",
//     },
//     {
//       name: "Khaddar Shirt",
//       price: "2,899",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC08143_533x.jpg?v=1701163187",
//     },
//     {
//       name: "Embellished Mules",
//       price: "2,999",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC_2529_3299daa8-35df-4274-9c81-111887a7d5ca_533x.jpg?v=1702900701",
//     },
//     {
//       name: "3 Piece Organza Suit",
//       price: "2,4999",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC07423_11b3df96-39b9-49b0-9266-53406d598d21_533x.jpg?v=1701340903",
//     },
//     {
//       name: "3 Piece Velvet Suit",
//       price: "1,1999",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC01566_533x.jpg?v=1701162799",
//     },
//     {
//       name: "Classic Mules",
//       price: "3,199",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC_2597_adceb16d-0399-4e0b-bfe9-1da9371181d0_533x.jpg?v=1702904081",
//     },
//     {
//       name: "2 Piece Velvet Suit",
//       price: "9,899",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC06175_533x.jpg?v=1701863681",
//     },
//     {
//       name: "Diva-100ml",
//       price: "4,199",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC_2916_1594a857-65ff-4ea4-8d3b-d99a141888de_533x.jpg?v=1697287398",
//     },
//     {
//       name: "Envelope Handbag",
//       price: "3,399",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC_1055_89376a4c-50f4-4d4c-8149-c209e1b88057_533x.jpg?v=1701074924",
//     },
//     {
//       name: "Yarn Dyed Kurti",
//       price: "3,899",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC04085_1_533x.jpg?v=1700206438",
//     },
//     {
//       name: "Winter Cotton Shirt",
//       price: "3,799",
//       category: "",
//       description:
//         "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicingelit. Sint ea inventore mollitia impedit quia laboriosam eligendi aut nam recusandae ratione.Lorem ipsum dolor sit amet consectetur, adipisicing",
//       discount: "",
//       img: "https://www.limelight.pk/cdn/shop/files/DSC08527_533x.jpg?v=1701170313",
//     },
//   ]



//   Products.insertMany(products).then(() => {
//     console.log('added');
//   }).catch((err) => {
//    console.log(err);
//   })
  

app.post('/addProduct', async (req, res) => {
    try {
       const product = new Products ({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        discount: req.body.discount,
        images: req.body.images
        
       });
       const product_data = await product.save()
        return res.status(200).send({success:true , message:"product details" , result:product_data})
    } catch (e) {
        console.log(e);
        res.status(500).send({
           success:false, message:e.message || "some error ecured"
        })
    }
})

//get all products
app.get('/products', async (req, res) => {
    try {
        const product = await Products.find()
        return res.status(200).send({success:true,message:"all products",result:product})
    } catch (e) {
        return res.status(500).send({success:false,message:e.message || "some error ecured"})
    }
})

//delete products
app.delete('/products/:id', async (req, res) => {
    try {
        const prod = await Products.findByIdAndDelete(req.params.id)
        if(!prod){
            return res.status(404).send("Products not found.");
        }
        res.send("Products has been deleted")
    } catch (e) {
        return res.json(e)
    }
})