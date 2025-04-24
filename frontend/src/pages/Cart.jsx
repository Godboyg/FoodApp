
import React, { useState } from 'react'
import "../App.css"
import Header from '../Components/Header'
import { useSelector , useDispatch } from 'react-redux';
import { increaseQuantity , decreaseQuantity , clearCart } from '../redux/cartSlice';
import axios from "axios"
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

function Cart() {
   const dispatch = useDispatch();
   const [ order , setOrder ] = useState(false)
   const [ isVisible , setIsVisible ] = useState(false)
   const [ name , setName ] = useState()
   const [ number , setNumber ] = useState()
    const cartItems = useSelector((state) => state.cart.items);
    console.log("cartItems",cartItems);
    const totalPrice = cartItems.reduce((total, item) => {
     return total + item.price * item.quantity;
    }, 0);

    const handleOrder = async(e) => {
      e.preventDefault();
      try {
        setOrder(true);
        console.log("clicked");
        const res = await axios.get(`${apiUrl}/protected` , {
          withCredentials : true
        });
        console.log("response",res.data.currentUser);
        if(res.status === 200){
         console.log("looged in");
         setIsVisible(true);
         const store = await axios.post(`${apiUrl}/storeOrder`, { cartItems } , {
          withCredentials : true
         });
         console.log("res from setOrder",store);
        }
      } catch (error) {
        setIsVisible(false);
        console.log("error unauthenticated");
      }
    }

    const handlePlaceOrder = async(e) => {
      e.preventDefault();
      try {
        setName("");
        setNumber("");
        console.log("name number",name,number.length);
        if(number.length > 10 || number.length < 10){
          console.log("invalid number");
          return;
        }else{
          console.log("valid number");
          const res = await axios.post(`${apiUrl}/menu/cart/storeUserInfo` , { name , number } , {
            withCredentials: true,
          });
          console.log("resposne ",res.data);
          setIsVisible(true);
        }
      } catch (error) {
        console.log("error",error);
      }
    }

    const handleIncrease = (item) => {
      console.log("increased");
      dispatch(increaseQuantity(item.id));
    }

    const handleSetOrder = (e) => {
      e.preventDefault();
      dispatch(clearCart());
      setOrder(false)
    }

  return (
    <div className="p-6 h-screen relative">
        <Header />
        <div className="px-8 py-5 text-white">
          <div className="flex items-center justify-between">
           <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
           <Link to="/menu/cart/order"><button className='h-11 w-24 bg-green-600 rounded-md text-white'>See Orders</button></Link>
          </div>
          {cartItems.length === 0 ? (
           <p>Your cart is empty.</p>
          ) : (
            <>
           <ul className='border-b border-cyan-200'>
             {cartItems.map((item, index) => (
              <li key={index} className="mb-2">
                <div className="h-12 flex items-center p-3 justify-between bg-gray-900">
                  <div className="">
                    {item.name} - ₹{item.price}
                    {/* {item.name} - ${item.price} × {item.quantity} = ${item.price * item.quantity} */}
                  </div>
                  <div className="text-white flex gap-2">
                    <p onClick={() => dispatch(decreaseQuantity(item.id))}>-</p>
                    {item.quantity}
                    <p onClick={() => handleIncrease(item)}>+</p>
                  </div>
                </div>
              </li>
             ))}
           </ul>
           <div className="mt-4 flex items-center justify-between font-bold text-xl">
             <p>Total</p>
             <p>₹{totalPrice}</p>
           </div>
           <div 
           className="absolute bottom-10 max-sm:bottom-20 max-sm:left-8 rounded-md font-bold text-2xl bg-green-500 p-3 hover:cursor-pointer max-sm:w-84 max-sm:text-center"
           onClick={handleOrder}
           >
             Place Order
           </div>
           <div className={`absolute top-0 left-0 h-screen flex items-center justify-center w-full transition-all duration-300 ease-linear p-5 ${ order ? "opacity-95 inset-0 backdrop-blur-lg" : "scale-0 opacity-0"}`}>
              {
                isVisible ? (
                  <div className="">
                    <div className='absolute top-20 right-20' onClick={handleSetOrder}><svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-10 h-10 text-gray-600 hover:text-red-500 transition"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg></div>
                    <div className="flex flex-col items-center justify-center p-6">
                      <svg
                         xmlns="http://www.w3.org/2000/svg"
                         className="w-24 h-24 text-green-500"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor"
                         strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                       <p className="mt-4 text-xl font-semibold text-green-600">Order Placed Successfully!</p>
                    </div>
                  </div>
                ) : (
                  <>
                  <div className='absolute top-20 right-20' onClick={() => setOrder(false)}><svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-10 h-10 text-gray-600 hover:text-red-500 transition"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg></div>
              <div className="h-[50vh] shadow-md relative w-[30vw] max-sm:h-[30vh] max-sm:w-[80vw] rounded-md max-sm:rounded-xl p-5 bg-black">
                <div className="">
                  <input type="text" className='w-full h-12 mt-5 rounded-xl border-none outline-none p-3' placeholder='Enter Name....' value={name} onChange={(e) => setName(e.target.value)}/>
                  <input type="number" className='w-full h-12 mt-5 rounded-xl border-none outline-none p-3' placeholder='Enter Number....' value={number} onChange={(e) => setNumber(e.target.value)}/>
                  <button onClick={handlePlaceOrder} className='absolute left-2 bottom-5 h-12 w-94 max-sm:w-80 text-center bg-green-500 rounded-md font-bold text-xl max-sm:text-2xl hover:cursor-pointer'>
                    Order
                  </button>
                </div>
              </div>
              </>
                )
              }
            </div>
           </>
          )}
         </div>
    </div>
  )
}

export default Cart;
