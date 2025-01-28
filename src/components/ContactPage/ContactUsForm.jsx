import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import '../../App.css';

import apiconnector from '../../services/apiconnector'
import { contactusEndpoints } from '../../services/apis';
import { FiSend } from "react-icons/fi";

import countryCodes from '../../data/countrycode.json'

const ContactUsForm = () => {

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitSuccess}
  } = useForm();

  const submitForm = async(data) => {
    console.log("contact form data: \n", data);
    try {
      setLoading(true);
      // const response = await apiconnector("POST", contactusEndpoints.CONTACT_US_API, data);
      const response = {status: 'ok'}; // mock
      console.log("response: ", response);
      reset();

    } catch (error) {
      console.log('error occurred during form submission')
      console.error(error.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    if(isSubmitSuccess) {
      reset({email:"", firstname:"", lastname:"", message:"", phoneNo:""});
    }
  }, [reset, isSubmitSuccess])
  

  return (
    <form onSubmit={handleSubmit(submitForm)} className='flex flex-col gap-y-5 mt-2'>
      <div className='flex justify-between'>

        <div className='firstName flex flex-col gap-y-1'>
          <label htmlFor='firstname'> First Name </label>
          <input type="text"  name='firstname' id='firstname' placeholder='Enter First Name' className='input-dark'
            {...register('firstname', {required:true})}
          />
          {
            errors.firstname && (
              <span>Please Enter Your First Name</span>
            )
          }
        </div>

        <div className='lastName flex flex-col gap-y-1'>
          <label htmlFor='lastname'> Last Name </label>
          <input type="text"  name='lastname' id='lastname' placeholder='Enter Last Name'  className='input-dark'
            {...register('lastname')}
          />
        </div>

      </div>

      <div className="Email flex flex-col gap-y-1">
        <label htmlFor="email">Email Address</label>
        <input type="email" name='email' id='email' placeholder='Enter Email Address' className='input-dark'
          {...register('email', {required:true})} 
        />
        {
          errors.email && (
            <span> Please Enter your email </span>
          )
        }
      </div>

      <div className="phone-number flex flex-col gap-y-1 w-full">
        <label htmlFor="phonenumber">Phone Number</label>
        <div className='flex gap-x-5 w-full'>
          
          {/* dropdown */}
          <select name="countryCode" id="countryCode" className='w-[21.5%] input-dark'
            {...register('countryCode', {required:true})}
          >
            {
              countryCodes.map((element, index) => {
                return (
                  <option key={index} value={element.code} className='text-[#808080] text-sm italic w-1/4'>
                    {element.code} - {element.country}
                  </option>
                )
              })
            }
          </select>

          <input type="phone" name='phonenumber' id='phonenumber' placeholder='00000 00000'
          className='input-dark leading-4 w-full'
          { ...register('phoneNo', {
              required:{value: true, message: "Enter your Phone Number"}, 
              maxLength: {value:10, message: "Invalid Phone Number"},
              minLength: {value: 8, message: "Invalid Phone Number"}
            })
          }
          />
          {
            errors.phoneNo && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.phoneNo.message}
              </span>
            )
          }

        </div>
      </div>

      <div className="Message flex flex-col gap-y-1">
        <label htmlFor="message">Message</label>
        <textarea name="message" id="message" placeholder='Your Message goes here' className='input-dark' cols='30' rows='7'
        {...register('message', {required:true})}
        ></textarea>
        {
          errors.message && (
            <span> Please Enter the message</span>
          )
        }
      </div>

      <button type='submit' className='flex gap-x-2 items-end bg-blue-200 w-fit px-4 py-3 rounded-md font-semibold border-black text-richblack-900 hover:scale-95 mt-7'> 
        Send Message <FiSend className='text-xl' />
      </button>

    </form>
  )
}

export default ContactUsForm
