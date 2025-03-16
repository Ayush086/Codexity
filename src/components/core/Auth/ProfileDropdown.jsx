import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../../services/operations/authAPI';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

import { FaChevronDown } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";

const ProfileDropdown = () => {

  const {user} = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  // not registered user 
  if(!user) return null;

  return (
    <button className='relative' onClick={() => setOpen(true)}>

      <div className='flex items-center gap-x-1 text-richblack-100'>
        <img src={user?.image} alt={`profile-${user?.firstName}`}
          className='aspect-square w-[40px] rounded-lg object-cover'
        />
        <FaChevronDown />
      </div>
      {
        open && (
          <div
            onClick={(e) => e.stopPropagation()}
            className='absolute top-[111%] right-[.04rem] z-[100] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800'
            ref={ref} >
              
              <Link to='/dashboard/my-profile' onClick={() => setOpen(false)}>
                <div className='flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
                  <LuLayoutDashboard className='text-lg'/>
                  Dashboard
                </div>
              </Link>

              <div
                onClick={() => {
                  dispatch(logout(navigate))
                  setOpen(false)
                }}
                className='flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25' 
              >
                <TbLogout className="text-lg"/> 
                Logout    
              </div>
          </div>
        )
      }
    </button>
  )
}

export default ProfileDropdown
