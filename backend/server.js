const express = require('express');
const app = express();
const Menu = require("./db/mongoose.js");
const User = require("./db/userInfo.js");
const Order = require("./db/order.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const verifyToken = require('./verifyToken');
require("dotenv").config();

app.use(cors({
  origin : "https://dailyfoodapp.netlify.app",
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', async(req, res) => {

//     res.send('Hello');
//     const menu = new Menu({
//       "Appetizers": [
//         {
//           "name": "Spring Rolls",
//           "description": "Crispy rolls with fresh veggies",
//           "price": 5.99,
//           "imageUrl": "https://example.com/springroll.jpg",
//           "isAvailable": true,
//           "extras": [
//             { "name": "Sweet Chili Sauce", "price": 0.5 }
//           ],
//           "tags": ["starter", "vegetarian"]
//         },
//         {
//           "name": "Garlic Bread",
//           "description": "Toasted bread with garlic butter",
//           "price": 3.49,
//           "tags": ["starter", "veg"]
//         }
//       ],
//       "MainCourses": [
//         {
//           "name": "Butter Chicken",
//           "description": "Rich tomato-based gravy with butter and cream",
//           "price": 12.99,
//           "imageUrl": "https://example.com/butterchicken.jpg",
//           "isAvailable": true,
//           "extras": [
//             { "name": "Extra Naan", "price": 1.5 }
//           ],
//           "tags": ["spicy", "non-veg"]
//         },
//         {
//           "name": "Paneer Tikka Masala",
//           "description": "Spicy Indian curry with grilled paneer",
//           "price": 10.5,
//           "tags": ["vegetarian", "spicy"]
//         },
//         {
//           "name": "Veg Biryani",
//           "description": "Aromatic basmati rice with vegetables and spices",
//           "price": 9.5,
//           "tags": ["rice", "veg"]
//         }
//       ],
//       "Desserts": [
//         {
//           "name": "Gulab Jamun",
//           "description": "Warm milk balls soaked in syrup",
//           "price": 3.5,
//           "tags": ["sweet"]
//         },
//         {
//           "name": "Chocolate Lava Cake",
//           "description": "Rich chocolate cake with a molten center",
//           "price": 4.99,
//           "imageUrl": "https://example.com/lavacake.jpg",
//           "tags": ["chocolate", "dessert"]
//         }
//       ],
//       "Drinks": [
//         {
//           "name": "Mango Lassi",
//           "price": 2.99,
//           "tags": ["cold", "sweet"]
//         },
//         {
//           "name": "Masala Chai",
//           "description": "Traditional spiced Indian tea",
//           "price": 1.99,
//           "tags": ["hot", "tea"]
//         },
//         {
//           "name": "Cold Coffee",
//           "description": "Chilled coffee with ice and milk",
//           "price": 3.25,
//           "tags": ["cold", "coffee"]
//         }
//       ]
//     }
//     );
      
//       await menu.save();
//       console.log('Menu saved!');
// });

app.get('/protected', verifyToken, (req, res) => {
  const currentUser = req.user;
  res.json({ message : "user logged in" , currentUser});
  // res.send(`Hello, ${req.user.name}! This is a protected route.`);
});

app.get("/menu",async(req,res)=>{
    try{
        const response = await Menu.find();
        console.log("data in backend",response);
        res.send( response );
    }catch(err){
        res.json(res);
    }
})

app.post("/menu/search",async(req,res)=>{
  const { name } = req.body;

  try {
    const menuGroups = await Menu.find();
    const results = [];

    menuGroups.forEach(group => {
      Object.keys(group._doc).forEach(category => {
        const items = group[category];

        if (Array.isArray(items)) {
          const matched = items.filter(item =>
            item.name?.toLowerCase().includes(name.toLowerCase())
          );

          results.push(...matched.map(item => ({
            ...item,
            category
          })));
        }
      });
    })
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/debug-cookies', (req, res) => {
  res.json({ cookies: req.cookies });
});

app.post("/menu/cart/storeUserInfo",async(req,res) => {
  const { name , number } = req.body;

  const search = await User.findOne({ name , number });
  console.log("search",search);
  if(search){
    const token = jwt.sign({ _id: search.id , name , number } , process.env.Secret , { expiresIn : "5d"});
    res.cookie('jwttoken', token, {
      httpOnly: true,      
      secure: false,       
      sameSite: 'Lax', 
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });
    return res.json({ message : "user found" , token});
  }else{
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const token = jwt.sign({ _id : savedUser._id } , process.env.Secret , { expiresIn : "5d"});
    res.cookie('jwttoken', token, {
      httpOnly: true,     
      secure: false,       
      sameSite: 'Lax', 
      maxAge:  5 * 24 * 60 * 60 * 1000,
    });
    res.json({ message : "user Saved" , token});
  }
})

app.get("/getOrders", verifyToken ,async(req,res) => {
  const orders = await Order.find();
  const user = req.user;
  res.json({ message : "All Orders" , orders , user});
})

app.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

app.post("/storeOrder", verifyToken ,async(req,res) => {
  const { cartItems } = req.body;
  const newOrder = new Order({
    cartItems,
    by : req.user._id
  })
  await newOrder.save();
  res.json({ message : "order saved " , newOrder});
})

app.get('/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const allowedCategories = ['Appetizers', 'MainCourses', 'Desserts', 'Drinks'];
  
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
  
      const menu = await Menu.findOne(); 
  
      if (!menu || !menu[category]) {
        return res.status(404).json({ message: `No items found for ${category}` });
      }
  
      res.json(menu[category]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

 app.post('/logout', (req, res) => {
    res.clearCookie('jwttoken', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });
    res.json({ message: 'Logged out' });
  });

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
