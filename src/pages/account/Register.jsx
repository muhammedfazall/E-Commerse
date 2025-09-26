import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { userApi } from "../../api";
import { showToast } from "../../lib/toast";

export default function Register() {
    const navigate = useNavigate();
    const [newUser,setNewUser] = useState({name:"",
                                     email:"",
                                     role:"User",
                                     password:"",
                                     cart:[],
                                     wishList:[],
                                     orders:[],
                                     createdAt:new Date().toISOString().split('T')[0],
                                     isBlocked:false,
                                     })


    const handleChange = (e) => {
        const { id, value} = e.target;
        setNewUser((prev) => ({
            ...prev,
            [id]:value,
        }))
    }

    const handleSubmit= (e) => {
        e.preventDefault();
        axios.post(userApi,newUser);
        console.log("newUser:",newUser);
        showToast.success("Registration Successfull");
        navigate('/login');
        }
       

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" 
          onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
               Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  type="text"
                  value={newUser.name}
                  onChange={handleChange}
                  required
                  className="block w-full bg-white px-3 py-1.5 text-base
                  text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-700 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleChange}
                  required
                  className="block w-full bg-white px-3 py-1.5 text-base 
                  text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-700 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleChange}
                  required
                  className="block w-full bg-white px-3 py-1.5 text-base
                  text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-700 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center bg-black px-3 py-1.5 text-sm/6
                font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
