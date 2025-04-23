import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;
console.log("in order",apiUrl);

function Order() {
    const [ orders , setOrders ] = useState([]);
    const [ number , setNumber ] = useState();
    const [loading, setLoading] = useState(true);

    const getOrders = async() => {
      const res = await axios.get(`${apiUrl}/getOrders` , {
        withCredentials : true
      });
      console.log("all orders",res);
      setNumber(res.data.user.number);
      setOrders(res.data.orders);
    }

    useEffect(()=>{
        getOrders();
    },[])

    const istDate = new Date(orders.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short"
    });

    const deleteOrder = async (id) => {
        try {
          await axios.delete(`${apiUrl}/${id}`);
          setOrders(orders.filter((order) => order._id !== id));
        } catch (error) {
          console.error('Failed to delete order:', error);
        }
      };

    useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <p className="text-white text-xl">Loading your cart...</p>;
    }

  return (
    <div className="p-4">
        <Header />
        <div className="">
        {orders.length === 0 ? (
             <p className="text-center text-gray-300 mt-10">No current orders</p>
        ) : (
        orders.map((order) => (
         <div key={order._id} className="border p-4 my-2 rounded text-white">
         <div className="flex items-center justify-between">
          <h3 className="font-semibold">Order ID: {order._id}</h3>
          <div className="">
           <button className='bg-red-500 rounded-md p-2' onClick={() => deleteOrder(order._id)}>Delete</button>
           <p className="">{new Date(order.createdAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                             dateStyle: "medium",
                            timeStyle: "short"
                            })}
            </p>
            <p className='font-bold'>{number}</p>
          </div>
         </div>
         <p>Ordered by: {order.by}</p>

         <ul className="pl-4 list-disc">
           {order.cartItems.map((item, index) => (
            <li key={index}>
            {item.name} - ₹{item.price} × {item.quantity}
          </li>
         ))}
        </ul>
        </div>
        ))
         )}
        </div>
    </div>
)}


export default Order
