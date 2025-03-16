import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import { Pagination } from 'swiper'

import CourseCardWrapper from './CourseCardWrapper';


const CourseSlider = ({Courses}) => {
  return (
    <div>
      {
        Courses?.length ? (
          <div>
            <Swiper
              slidesPerView={3}
              loop={true}
              spaceBetween={30}
              pagination={true}
              // modules={[ Pagination]}
            >
              {
                Courses?.map((course, index) => (
                  <SwiperSlide key={index}>
                    <CourseCardWrapper course={course} Height={'h-[250px]'}></CourseCardWrapper>
                  </SwiperSlide>
                ))
              }
            </Swiper>
          </div>
        ) : (
          <p>No Course Found</p>
        )
      }
    </div>
  ) 
}

export default CourseSlider
