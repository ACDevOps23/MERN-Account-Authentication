import { Check, X } from 'lucide-react';
import React from 'react';

const grex = (password) => {
     const criteria = [
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
    ];
    return criteria;
    }

const PasswordCriteria = ({password}) => {
    const criteria = grex(password);

    return (
        <div className='mt-2 space-y-1'>
            {criteria.map((item) => (
                <div key={item.label} className='flex items-center text-xs'>
                    {item.met ? (<Check className='size-4 text-green-500 mr-2' />) : 
                    ( <X className='size-4 text-gray-500 mr-2' />)}
                    <span className={item.met ? "text-green-500" : "text-gray-500"}>{item.label}</span>
                </div>
            ))}
        </div>
    )
}

const PasswordBar = ({password}) => {

    const criteria = grex(password);

    const getStrength = () => {
        let strength = 0;
    
        criteria.forEach((item) => {
            if (item.met) {
                strength += 1;
            }
        });

        return strength;
    }

    const passwordStrength = getStrength(password);

    const getStrenthText = (strength) => {
        var type = ""; 
        var colour = "";

        if (strength === 1) { type = "Very Weak"; colour = "bg-red-500"; }
        else if (strength === 2) { type = "Weak"; colour = "bg-red-500"; }
        else if (strength === 3) { type = "Good"; colour = "bg-green-200"; }
        else if (strength === 4) { type = "Strong"; colour = "bg-green-400"; }
        else if (strength === 5) { type = "Secure"; colour = "bg-green-700"};
 
        return {type: type, colour: colour};
    }

    const strengthText = getStrenthText(passwordStrength);
  
    return (
    <div className='mt-2'>
        <div className='flex justify-between items-end mb-1'>
            <span className='text-xs text-gray-400'>Password Strength</span>
            <span className='text-xs text-gray-400'>{strengthText.type}</span>
        </div>
        <div className='flex space-x-1'>
            {[...Array(5)].map((_, index) => (
                <div key={index} className={`h-1 w-1/4 rounded-full transition-colors duration-300
                    ${index < passwordStrength ? strengthText.colour : "bg-gray-600"}
                `}
              />
            ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    )
}

export default PasswordBar;