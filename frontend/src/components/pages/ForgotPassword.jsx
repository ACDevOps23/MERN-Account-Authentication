import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore.js";
import FormInput from './FormInput';
import { MailIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();


  const handleSubmit = async(e) => {
    e.preventDefault();
    setSubmitted(true);
    await forgotPassword(email);

  }

  useEffect(() => {
    setSubmitted(isSubmitted)
  }, [isSubmitted]);

    return (
            <motion.div
            initial={{opacity: 1, y: 20}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} 
            className='mx-2 max-w-md w-full bg-gray-800 border-2 rounded-2xl overflow-hidden'>
                <div className='p-8'>
                    <h2 className='text-3xl font-bold mb-3 text-center bg-gradient-to-r from-gray-300 to-gray-600
                    bg-clip-text text-transparent'>Forgot Password</h2>
                    <p className='text-lg text-gray-400 flex justify-center items-center mb-6'>Enter your email</p>

                    {!isSubmitted ?  (
                           <form onSubmit={handleSubmit}>
                           <FormInput icon={MailIcon} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. name@email.com" required />
                           
                           <motion.button 
                               className='w-full py-3 px-3 rounded-xl font-bold bg-gray-950 text-gray-400
                               focus:ring-2 focus:ring-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none cursor-pointer'
                               whileHover={{scale: 1.02}}
                               whileTap={{scale: 1.0 }}
                               type="submit"
                               disabled={isLoading}>
                               {isLoading ? <LoaderIcon className='w-6 h-6 animate-spin mx-auto' /> : "Send"}
                           </motion.button>
                       </form>
                    ) : (
                        <div className='text-center'>
                            <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className='w-16 h-16 mx-auto flex items-center justify-center'>
                                    <MailIcon className='h-8 w-8 text-white' />
                            </motion.div>
                        
                            <p className='text-gray-300 mb-6'>
                                If an account exists for {email}, you will recieve a an email to reset your password momentarily
                            </p>
                        </div>
                    )}

                </div>
                <div className='flex justify-center items-center px-8 py-4 rounded-b-2xl bg-gray-900 bg-opacity-50'>
                        <Link to={"/login"} className='flex items-center text-sm text-gray-100 hover:underline hover:text-white'>
                        <ArrowLeft className='h-5 w-5  mr-2' />Back to Login</Link>
                </div>
                        
            </motion.div>
    )
;}

export default ForgotPassword;