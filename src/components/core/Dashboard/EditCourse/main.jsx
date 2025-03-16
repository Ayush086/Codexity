import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import RenderSteps from '../AddCourse/RenderSteps';
import Loader from '../../../common/Loader';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';

const EditCourse = () => {

    const dispatch = useDispatch();
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    

    // course id is passed in parameters
    const {courseId} = useParams();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const courseDetails = async() => {
        setLoading(true);

        const result = await getFullDetailsOfCourse(courseId, token);

        if(result?.courseDetails) {
            dispatch(setEditCourse(true));
            dispatch(setCourse(result?.courseDetails))
        }

        setLoading(false);
      }
    
      courseDetails();
    }, [])
    

    if(loading) {
        return (
            <div><Loader/></div>
        )
    }

  return (
    <div className='text-white'>
      <h1>Edit Course</h1>
      <div>
        {
            // not working check
            course ? (<RenderSteps />):(<p>Course Not Found</p>) 
        }
      </div>
    </div>
  )
}

export default EditCourse
