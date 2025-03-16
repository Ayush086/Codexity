import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"

import IconBtn from '../../../../common/IconBtn';
import { resetCourseState, setStep } from '../../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';

const PublishCourse = () => {

  const { register, handleSubmit, setValue, getValues } = useForm();
  
  const {token} = useSelector((state) => state.auth);
  const {course} = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(course?.status === COURSE_STATUS.PUBLISHED) {
      setValue('tick', true);
    }
  }, [])
  

  function goBack() {
    dispatch(setStep(2));
  }

  function goToCourses() {
    dispatch(resetCourseState());
    // navigate('/dashboard/my-courses);
  }

  async function handleCoursePublish() {
    // form not updated then no API call
    if(
      (course?.status === COURSE_STATUS.PUBLISHED && getValues('tick') === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues('tick') === false)
    ) {
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append('courseId', course._id);
    
    const courseStatus = getValues('tick') ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
    formData.append('status', courseStatus);
    
    // make API call
    setLoading(true);
    const result = await editCourseDetails(formData, token); // mark as published

    if(result) {
      goToCourses();
    }
    else {
      console.log('failed to publish course. api error')
    }

    setLoading(false);
  }

  function submitHandler() {
    handleCoursePublish();
  }

  return (
    <div className='rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>

      <div>
        
        <h1 className="text-2xl font-semibold text-richblack-5">Publish Course</h1>

        <form onSubmit={handleSubmit(submitHandler)}>
          {/* checkbox */}
          <div className="my-6 mb-8">
            <label htmlFor="tick"> 
              <input type="checkbox" id='tick'
                {...register('tick')}
                className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
              />
              <span className="ml-2 text-richblack-400">Make this course Public</span>
            </label>
          </div>

          <div className="ml-auto flex max-w-max items-center gap-x-4">
            <button disabled={loading} type='button' onClick={goBack} className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"> 
              Back 
            </button>
            <IconBtn disabled={loading} text='Publish'></IconBtn>
          </div>
          
        </form>

      </div>

    </div>
  )
}

export default PublishCourse
