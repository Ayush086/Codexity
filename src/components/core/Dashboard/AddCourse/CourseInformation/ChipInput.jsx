import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { IoCloseSharp } from "react-icons/io5";

const ChipInput = ({label, name, placeholder, register, errors, setValue, getValues}) => {

  const {editCourse, course} = useSelector((state) => state.course);

  const [chips, setChips] = useState([]); // to save all created tags
  
  useEffect(() => {
    if(editCourse) {
      setChips(course?.tag);
    }

    register(name, {required: true, validate: (value) => value.length > 0});
  }, [])

  useEffect(() => {
    setValue(name, chips)
  }, [chips]);
  
  const handleEnter = (event) => {
    // if enter/, key is pressed then create a new tag entry
    if(event.key === "Enter" || event.key === ",") {
      event.preventDefault();

      const tagValue = event.target.value.trim(); // get input
      if(tagValue && !chips.includes(tagValue)) { // if new chip then add to tag list
        const newTags = [...chips, tagValue]; // update list
        setChips(newTags);
        event.target.value = "" // set input field to empty string
      }
    }
  }

  const handleDelete = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex) // remove clicked tag from tag list
    setChips(newChips);
  }

  return (
    <div className='flex flex-col space-y-2'>

      <label htmlFor={name} className='text-sm text-richblack-5'>
        {label}<sup>*</sup>
      </label>
      <div className='flex w-full flex-wrap gap-y-2'>
        {/* show all created tags */}
        {
          chips.map((chip, index) =>(
            <div key={index} className='m-1 flex items-center rounded-full bg-richblue-500 px-2 py-1 text-sm text-richblack-5'
            >
              {chip}
              {/* delete btn for tag */}
              <button type='button' 
                onClick={() => handleDelete(index)} 
                className='ml-2 focus:outline-none'
              > 
                <IoCloseSharp className='text-sm text-pink-400'/> 
              </button>
            </div>
          ))
        }

        {/* create new tag */}
        <input 
          type="text" 
          id={name} 
          name={name} 
          placeholder={placeholder} 
          onKeyDown={handleEnter} 
          className='input-dark w-full'
        />

      </div>

        {/* handle error */}
      {
        errors[name] && (
          <span className='ml-2 text-xs tracking-wide text-pink-200'>{label} is required</span>
        )
      }

    </div>
  )
}

export default ChipInput
