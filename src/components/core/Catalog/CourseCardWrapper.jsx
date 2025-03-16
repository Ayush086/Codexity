import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import GetAvgRating from '../../../utils/avgRatingCalculator';
import RatingStars from '../../common/RatingStars';


const CourseCardWrapper = ({course, Height}) => {

  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);

  }, [course])
  
  return (
    <div>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div>
            <img src={course?.thubnail} alt="course-thumnail" className={`${Height} w-full rounded-lg object-cover`}/>
          </div>
          <div>
            <h2>{course?.courseName}</h2>
            <h4><span>By</span>{course?.instructor?.firstName} {" "} {course?.instructor?.lastName}</h4>
            <div>
              <span>{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span>{course?.ratingAndReviews?.length} ratings</span>
            </div>
            <p>{course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CourseCardWrapper
