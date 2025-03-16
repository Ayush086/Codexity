import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/ProfileAPI';

import Loader from '../../../common/Loader'
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

const Instructor = () => {

    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);



    useEffect(() => {
        // API Call
      const getCourseDataStats = async() => {
        setLoading(true);

        const instructorApiData = await getInstructorData(token);
        const result = await fetchInstructorCourses(token);

        // console.log('instructorApiData', instructorApiData);

        if(instructorApiData.length) {
            setInstructorData(instructorApiData);
        }

        if(result) {
            setCourses(result);
        }

        setLoading(false);
      }

      getCourseDataStats();
    }, [])

    const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)
    
  return (
    <div className='text-richblack-25'>
      <div>
        <h1>Hi, {user?.firstName}</h1>
        <p>Let's see your analytics</p>
      </div>

      { loading 
      ? ( <div> <Loader /> </div> )
      : courses.length > 0 
        ? (
          <div>

            {/* charts and visulizations */}
            <div>
              <InstructorChart courses={instructorData}/>

              {/* stats */}
              <div>
                <h2> Statistics </h2>

                <div>
                  <p>Total Courses</p> 
                  <p> {courses.length} </p>
                </div>

                <div>
                  <p>Total Learners</p>
                  <p> {totalStudents}</p>
                </div>

                <div>
                  <p>Total Income</p>
                  <p> {totalAmount}</p>
                </div>
              </div>

            </div>

            <div>
              <div>
                <p>Your Courses</p>
                <Link to='/dashboard/my-courses'> <p>view all</p> </Link>
              </div>
              <div>
                {
                  courses.slice(0, 3).map((course) => (
                    <div>
                      <img src={course.thumbnail} alt="" />
                      <div>
                        <p> {course.courseName} </p>
                        <div>
                          <p> {course.studentsEnrolled.length } students </p>
                          <p> | </p>
                          <p>Rs {course.price} </p>
                        </div>
                      
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

          </div>
        )
        : (
          <div>
            <p> You have not created any courses yet !</p>
            <Link to='/dashboard/addCourse'> Create Course</Link>
          </div>
        )
      }
    </div>
  )
}

export default Instructor
