import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div className='text-richblack-25 tracking-wide'>
      We are passionate about revolutionizing the way we learn. Our innovative platform
      <HighlightText text={'combines technology'}></HighlightText>, 
      <span className='text-caribbeangreen-200'>{" "} expertise</span>
      , and community to create an 
      <span className='text-pink-300'> {" "} unparalled educational experience</span>.
    </div>
  )
}

export default Quote
