import { useState } from 'react'
import { motion } from 'framer-motion';
import { MailIcon, LockIcon, LoaderIcon } from 'lucide-react';
import FormInput from './FormInput';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async(e) => {
    e.preventDefault();
    await login(email, password);
}

  return (
    <motion.div 
      initial={{opacity: 0.5, y: 100}}
      animate={{ opacity: 1, y: 1 }}
      transition={{ duration: 1.5 }} 
      className='container mx-2 max-w-md w-full backdrop-blur-xl bg-gray-600/40 rounded-2xl overflown-hidden'>
        <div className='p-8'>
          <h2 className='text-3xl font-bold mb-10 text-center bg-gradient-to-r from-gray-300
         to-gray-600 bg-clip-text text-transparent'>Login</h2>

         <form onSubmit={handleLogin}> 
          <FormInput icon={MailIcon} type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <FormInput icon={LockIcon} type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
         
          <Link to={"/forgot-password"} className='text-sm text-gray-400 hover:text-white'>Forgot your password?</Link>

          {error && <p className='text-red-500 text-sm mb-2'>{error}</p> }

         <motion.button className='w-full mt-5 py-3 px-3 rounded-xl font-bold bg-gray-950 text-gray-400
          focus:ring-2 focus:ring-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none cursor-pointer'
          whileHover={{scale: 1.02}}
          whileTap={{scale: 1.0 }}
          type="submit"
          disabled={isLoading}> 
              {isLoading ? <LoaderIcon className='w-6 h-6 animate-spin mx-auto' /> : "Login"}
         </motion.button>
         </form>
        </div>

         <div className='px-9 py-4 rounded-b-2xl bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className="text-sm text-gray-400">Don't have an account? 
                    <Link to={"/sign-up"} className='text-gray-100 hover:underline hover:text-white'>Sign Up</Link>
                </p>
            </div>
    </motion.div>    
  )
}

export default Login;