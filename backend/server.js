const express = require('express');
const app = express();
const Menu = require("./db/mongoose.js");
const User = require("./db/userInfo.js");
const Order = require("./db/order.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const verifyToken = require('./verifyToken');
require("dotenv").config();

app.use(cors({
  origin : "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// app.get('/', async(req, res) => {

//     res.send('Hello');
//     const menu = new Menu({
//         // restaurantId: '661e79a06fa4e4b5fcf6f201',
//         Appetizers: [
//           {
//             name: 'Rolls',
//             description: 'Crispy rolls stuffed with vegetables.',
//             price: 99,
//             imageUrl: 'https://example.com/spring-roll.jpg',
//             tags: ['veg'],
//           }
//         ],
//         MainCourses: [
//           {
//             name: 'Paneer Masala',
//             description: 'Soft paneer in creamy tomato gravy.',
//             price: 199,
//             tags: ['veg', 'spicy']
//           }
//         ],
//         Desserts: [
//           {
//             name: 'Gulab Jamun',
//             description: 'Sweet syrupy Indian dessert.',
//             price: 69,
//           }
//         ],
//         Drinks: [
//           {
//             name: 'Mango Lassi',
//             description: 'Chilled mango yogurt drink.',
//             price: 79,
//           }
//         ]
//       });
      
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
        res.json(response);
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