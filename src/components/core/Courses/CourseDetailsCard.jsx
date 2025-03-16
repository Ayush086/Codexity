import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import copy from 'copy-to-clipboard';

import { BsCurrencyRupee } from "react-icons/bs";
import { TbShoppingCartPlus } from "react-icons/tb";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { FaShareFromSquare } from "react-icons/fa6";
import { TbMessageReport } from "react-icons/tb";

import { ACCOUNT_TYPE } from '../../../utils/constants'
import addToCart from '../../../slices/cartSlice'

const CourseDetailsCard = ({course, setConfirmationModal, handleBuyCourse}) => {

    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,
    } = course;

    function addToCartHandler() {
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error(`Instructor Can't Buy a Course`);
            return;
        }
        if(token) {
            dispatch(addToCart(course));
            return;
        }
        setConfirmationModal({
            text1: "User not logged in",
            text2: "Please Login to add course into your cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate('/login'),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

    function shareBtnHandler() {
        // copy the current url to clipboard
        const text = window.location.href;
        copy(text)
        toast.success('Link Copied to Clipboard')
        
    }

  return (
    <div className='flex flex-col gap-y-5'>

      <img src={ThumbnailImage} alt="course-thumbnail"  className='max-h-[300px] min-h-[180px] rounded-xl'/>

      <div>
        <BsCurrencyRupee />
        {" "} {CurrentPrice}
      </div>

      <div className='flex gap-x-4'>
        <button className='bg-blue-300 text-richblack-25'
            onClick={
                user && course?.studentsEnrolled.includes(user?._id) 
                    ? () => navigate('/dashboard/enrolled-courses') 
                    : handleBuyCourse
        }>
            {
                user && course?.studentsEnrolled.includes(user?._id) ? 
                    'Go to Course' : 
                    "Buy Now"
            }
        </button>

        {
            // if student is not enrolled in the course then show add to cart button
            (!course?.studentsEnrolled.includes(user?._id)) && (
                <button onClick={addToCartHandler}>
                    <TbShoppingCartPlus />
                </button>
            )
        }
      </div>

      <div>
        <p>30-Days free trial</p>
        <p> This Course Include: </p>
        <div className='flex flex-col gap-y-3'>
            {
                course?.instructions.map((item, index) => (
                    <div key={index} className='flex gap-x-2 text-richblue-300'>
                        <div><VscDebugBreakpointLog /></div>
                        <span>{item}</span>
                    </div>
                ))
            }
        </div>
        <div>
            <button onClick={shareBtnHandler} className='text-caribbeangreen-100 hover:text-caribbeangreen-200'>
                <FaShareFromSquare />
                {" "} share
            </button>
            <button className='hover:text-pink-300'>
                <TbMessageReport />
                {" "} report
            </button>
        </div>
      </div>

    </div>
  )
}

export default CourseDetailsCard
