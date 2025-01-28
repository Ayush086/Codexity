import React, { useEffect, useState } from 'react'

import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";

const RatingStars = ({Review_Count, Star_Size}) => {

    const [starCount, setStarCount] = useState({
        full: 0,
        half: 0,
        empty: 0,
    })

    useEffect(() => {
      const wholeStars = Math.floor(Review_Count) || 0
      setStarCount({
        full: wholeStars,
        half: Number.isInteger(Review_Count) ? 0 : 1,
        empty: Number.isInteger(Review_Count) ? 5 - wholeStars : 4 - wholeStars,
      })
    }, [Review_Count])
    
  return (
    <div>
      {
        [...new Array(starCount.full)].map((_, i) => {
            return <IoIosStar key={i} size={Star_Size || 20} />
        })
      }
      {
        [...new Array(starCount.half)].map((_, i) => {
            return <IoIosStarHalf key={i} size={Star_Size || 20} />
        })
      }
      {
        [...new Array(starCount.full)].map((_, i) => {
            return <IoIosStarOutline key={i} size={Star_Size || 20} />
        })
      }
    </div>
  )
}

export default RatingStars
