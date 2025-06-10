import React, { useState } from 'react'
import { motion } from "framer-motion";
import FormInput from './FormInput';
import { Loader, LockIcon, Mail, MailIcon, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordBar from './PasswordBar';
import { useAuthStore } from '../store/authStore.js';

const Signup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { signup, error, isLoading } = useAuthStore();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await signup(name, email, password);
            navigate("/verify");
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <motion.div 
        initial={{opacity: 0.5, y: 50}}
        animate={{ opacity: 1, y: 1 }}
        transition={{ duration: 1.5 }}
        className='container mx-2 my-2 max-w-md w-full backdrop-blur-xl bg-gray-600/40 rounded-2xl overflown-hidden'>

    <div className='p-8'>
        <h2 className='text-3xl font-bold mb-10 text-center bg-gradient-to-r from-gray-300
         to-gray-600 bg-clip-text text-transparent'>Create Account</h2>

        <form onSubmit={handleSignup}>
            <FormInput icon={User} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <FormInput icon={MailIcon} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <FormInput icon={LockIcon} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

        {/* password strength bar */}
        <PasswordBar password={password} />

        <motion.button className='mt-5 w-full px-3 py-3 bg-gray-950 text-gray-400
        font-bold rounded-lg shadow-lg hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2
        focus:ring-gray-700 transition-200 cursor-pointer'
        whileHover={{scale: 1.02}}
        whileTap={{scale: 1.0 }}
        type='submit'
        disabled={isLoading}>
            {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Sign Up"}
        </motion.button>
        </form>
    </div>

    {/* login link section */}
    <div className='px-9 py-4 rounded-b-2xl bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className="text-sm text-gray-400">Already have an account? {""}
            <Link to={"/login"} className='text-gray-100 hover:underline hover:text-white'>Login</Link>
        </p>
    </div>
    </motion.div>
  )
}

export default Signup