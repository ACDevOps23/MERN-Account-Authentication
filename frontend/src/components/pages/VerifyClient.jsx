import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuthStore } from '../store/authStore';
import { Loader } from 'lucide-react';

const VerifyClient = () => {
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const currentInput = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newState = [...otpCode];

    if (value.length > 1) { // if the value entered by the user is more than one character (i.e., the user types or pastes something longer than a single digit)
      const code = value.slice(0, 6).split(""); // ensures the value is sliced to a maximum of 6 characters and split into an array of individual characters (digits). 
      // For example, if the value is "123456", this will convert it into the array ["1", "2", "3", "4", "5", "6"]
      for (let i = 0; i < 6; i++) { // iterates over all 6 digits of the OTP
        newState[i] = code[i] || ""; //  assigns the corresponding digit from the code array to newState[i]. If code[i] is undefined (i.e., fewer than 6 characters in value), it assigns an empty string "" to that position.
      }
      setOtpCode(newState); // The state (otpCode) is then updated with the new newState.  assigns the corresponding digit from the code array to newState[i]. If code[i] is undefined (i.e., fewer than 6 characters in value), it assigns an empty string "" to that position.

      // managing focus after updating OTP fields (pasted character case)
      const lastIndexFilled = newState.findIndex((digit) => digit !== ""); // This finds the first index in newState where the digit is not an empty string (""). This tells us the position of the last filled input field.
      const focusIndex = lastIndexFilled < 5 ? lastIndexFilled + 1 : 5; // This calculates the next input field that should receive focus. If lastIndex is less than 5 (i.e., there are still unfilled fields), it focuses the next field (lastIndex + 1). If lastIndex is 5 (meaning all fields are filled), it keeps the focus on the last field.
      currentInput.current[focusIndex].focus(); // access the next input element d focuses it. It moves the cursor to the next input field, improving the user experience.
    } else { // If the entered value is just a single character 
      newState[index] = value; // assigns the entered value to the newState array at the position specified by the index (i.e., the current OTP field).
      setOtpCode(newState); //  updates the otpCode state with the modified newState.

      // Moving Focus to the Next Input Field (Single Character Case)
      if (value && index < 5) { // This checks if the user has entered a valid value (value) and if the current input field is not the last one (index < 5).
        currentInput.current[index + 1].focus(); // If both conditions are true, it moves the focus to the next input field (index + 1), allowing the user to continue typing the next digit of the OTP.
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) { // if backspace is pressed and the current ref is empty (and index position is greater than 0 (1st key - otherwise you cant go back)
        currentInput.current[index - 1].focus(); // go to the previous digit ref
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = otpCode.join("");

    try {
      await verifyEmail(verificationCode);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    
  }

  // auto submit when all fields are filled
  useEffect(() => {
    const filledCount = otpCode.filter(digit => digit !== "").length; // checks if every input is filled 
      if (filledCount === 6) {
        handleSubmit(new Event("submit"));
      }    
  }, [otpCode]);

  return (
    <div className='max-w-md w-full bg-gray-800 backdrop-filter backdrop-blur-2xl
      rounded-2xl overflow-hidden'>
      <motion.div 
      initial={{opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='bg-gray-800 backdrop-filter backdrop-blur-xl rounded-2xl p-8 w-full max-w-md'>
        
        <h2 className='text-3xl font-bold mb-9 text-center bg-gradient-to-r from-gray-300 to-gray-600
       bg-clip-text text-transparent'>Verify your Email</h2>
      
      <form className='space-y-6'>
        <div className='flex justify-between'>
          {otpCode.map((digit, index) => ( // return an input of 6 digits 
            <input 
              key={index} 
              ref={(el) => (currentInput.current[index] = el)} 
              type="text"
              maxLength="6"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className='w-12 h-12 text-center rext-2xl font-bold bg-gray-700 text-white 
              border-2 border-gray-400 rounded-lg focus:border-gray-500 focus:outline-none' />
          ))}
        </div>

        {error && <p className="text-red-500 font-semibold mt-2">{error}</p> }

        <motion.button className='mt-5 w-full px-3 py-3 bg-gray-950 text-gray-400
        font-bold rounded-lg shadow-lg hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2
        focus:ring-gray-700 transition-200 cursor-pointer'
        whileHover={{scale: 1.02}}
        whileTap={{scale: 1.0 }}
        type='submit'
        disabled={isLoading}>
           { isLoading ? <Loader className='mx-auto animate-spin' /> : "Verify" }
        </motion.button>
      </form>
      </motion.div>
    </div>
  )
}

export default VerifyClient;