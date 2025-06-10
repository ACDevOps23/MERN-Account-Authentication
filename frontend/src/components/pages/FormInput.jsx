import React from 'react'

const FormInput = ({icon:Icon, ...props}) => {
  return (
    <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-auto">
            <Icon className="size-5 text-gray-400" />
        </div>
            <input {...props} className='w-full pl-10 pr-3 py-2 bg-gray-950 
                rounded-lg focus:outline-none border border-gray-700 focus:ring-2
              focus:ring-gray-700 text-white placeholder-gray-400 transition duration-200
               hover:text-white'/>
    </div>
  )
}

export default FormInput;
