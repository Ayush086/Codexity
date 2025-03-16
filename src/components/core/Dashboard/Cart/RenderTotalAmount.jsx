import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import IconBtn from '../../../common/IconBtn';
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';

import { BsCurrencyRupee } from "react-icons/bs";

const RenderTotalAmount = () => {

    const {total, cart} = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function buyHandler() {
        // TODO: razorpay API integration for payment gateway is supposed to be enabled and this function will make to take to payment gateway to buy course
        const courses = cart.map((course) => course._id);
        console.log("courses: ", courses);
        buyCourse(token, courses, user, navigate, dispatch)
    }

  return (
    <div className='min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800'>
      <p className='mb-1 text-sm font-medium text-richblack-300'>Total:</p>
      <p className='mb-6 text-2xl font-semibold text-blue-300'> <BsCurrencyRupee /> {total}</p>

      <IconBtn
        text='Buy Now'
        onclick={buyHandler}
        customClasses={'w-full justify-center'}
      ></IconBtn>
    </div>
  )
}

export default RenderTotalAmount
