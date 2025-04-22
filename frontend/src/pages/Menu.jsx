import React, { useEffect, useState } from 'react';
import "../App.css"
import axios from "axios"
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

const categories = ['Appetizers', 'MainCourses', 'Desserts', 'Drinks'];

const apiUrl = import.meta.env.VITE_API_URL;
console.log("backend",apiUrl);

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState('Appetizers');
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState();
  const [value, setValue] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (value.trim() === '') {
        setMenuItems([]);
        return;
      }

      try {
        const response = await axios.post("/api/menu/search" , { name: value })
        console.log("menu item",menuItems[0]);
        console.log("data", response.data[0]);
        setMenuItems(response.data);
        setSearchItems(response.data);
        for(let i of searchitems){
          console.log("search items index",i);
        }
      } catch (err) {
        console.error('Error fetching search:', err);
      }
    };

    fetchResults();
  }, [value]);

  const handleAddToCart = (item) => {
    try {
      const cartItem = {
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,           
        image: item.imageUrl || '',
      };
      setVisible(true);
      dispatch(addCart(cartItem));      
      // console.log("item to add in cart",item);
    } catch (error) {
      console.log("err",error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/menu`); 
        console.log("data from backend",res);
        setMenuItems(res.data);
      } catch (err) {
        console.error('Error fetching full menu:', err);
        setMenuItems([]);
      }
    };
    fetchAll();
  }, [!value]);
  const searchByCategory = async () => {
    setSearching(true);
    try {
      const res = await fetch(`/api/menu/${category}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching category:', err);
      setMenuItems([]);
    }
    setSearching(false);
  };

  // const addToCart = (item) => {
  //   setCart(prevCart => [...prevCart, item]);
  // };

  const handleValue = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <Header istrue={visible}/>
      <h2 className="text-2xl mb-6">Menu</h2>
      <div className="mb-3 flex items-center gap-2 p-3 rounded-2xl border border-cyan">
      <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-5 w-5 text-gray-300"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
  />
      </svg>
      <input type="text" className='border-none outline-none w-full' placeholder='Search Item' value={value} onChange={handleValue}/>
      </div>
      {Array.isArray(menuItems) && menuItems?.length > 0 ? (
            menuItems.map((menu, menuIndex) => (
              <div key={menuIndex} className="mb-6">
                <h2 className="text-2xl font-semibold">Menu {menuIndex + 1}</h2>
                {Object.keys(menu).map((category, index) => (
                  category !== '_id' && category !== 'createdAt' && category !== '__v' && (
                    <div key={index} className="mb-4">
                      <h3 className="text-lg font-semibold">{category}</h3>
                      {Array.isArray(menu[category]) && menu[category].length > 0 ? (
                        menu[category].map((item, i) => (
                          <div key={i} className="border border-gray-600 p-2 mb-2">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p>{item.description}</p>
                            <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="bg-blue-500 text-white py-1 px-4 rounded mt-2 hover:bg-blue-600"
                            >
                              Add to Cart
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No items available</p>
                      )}
                    </div>
                  )
                ))}
              </div>
            ))
        ) : (
          // <p>Loading menu...</p>
          <p>No item available...</p>
       )}
    </div>
  );
};

export default Menu;
