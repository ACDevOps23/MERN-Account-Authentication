import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useAuthStore } from '../store/authStore';
import FormInput from './FormInput';
import { LockIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {

    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const { isLoading, resetPassword } = useAuthStore();
    const { token } = useParams();
    const navigate = useNavigate();

    const [isMatch, setisMatch] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPass) {
            setisMatch(false);
            return;
        }

        try {
            await resetPassword(token, password);
            console.log("working");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch(error) {
            throw new Error(401, "Error with restting your password");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mx-2 max-w-md w-full bg-gray-800 border-2 rounded-2xl overflow-hidden'>

            <div className='p-7'>
                <h2 className='text-3xl font-bold mb-5 text-center bg-gradient-to-r from-gray-300 to-gray-600
                        bg-clip-text text-transparent'>Reset Password</h2>
                {/* {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
                {message && <p className='text-gray-500 text-sm mb-4'>{message}</p>} */}
                <form onSubmit={handleSubmit}>
                    <FormInput icon={LockIcon} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
                    <FormInput icon={LockIcon} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm New Password" />
                    {!isMatch && <p className='text-sm text-red-500 flex justify-center items-center mb-4'>Password does not match</p>}
                    <motion.button
                        className='w-full py-3 px-3 rounded-xl font-bold bg-gray-950 text-gray-400
                    focus:ring-2 focus:ring-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none cursor-pointer'
                        type='submit'
                        disabled={isLoading}>
                        New Password
                    </motion.button>
                </form>
            </div>

        </motion.div>
    )
}

export default ResetPassword;