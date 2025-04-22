import React from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header({ istrue }) {
  console.log("is true",istrue);
  const cartItem = useSelector((state) => state.cart.items);
  const totalQuantity = cartItem.reduce((sum, item) => sum + item.quantity, 0);
  console.log("all quantity",totalQuantity)

  return (
    <div className="p-10 bg-black text-white flex items-center justify-between">
        <Link to="/menu"><h1 className='font-black text-xl hover:cursor-pointer'>Eatoes</h1></Link>
        {
          istrue && (
            <div className="p-3 h-1 w-1 max-sm:w-2 max-sm:h-2 max-sm:right-13 absolute right-60 top-13 rounded-full flex items-center justify-center bg-red-300 font-bold text-black">
              {totalQuantity}
            </div>
          )
        }
        <Link to="/menu/cart"><svg xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 24 24"
             strokeWidth={1.5} stroke="currentColor"
             className="w-7 h-7 hover:cursor-pointer">
           <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 3h1.5l1.664 10.007a2.25 2.25 0 002.237 1.943h8.698a2.25 2.25 0 002.237-1.943L20.25 6.75H6.375" />
           <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.5 17.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-7.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
           </svg>
        </Link>
    </div>
  )
}

export default Header