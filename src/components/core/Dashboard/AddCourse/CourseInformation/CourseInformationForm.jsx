import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { MdCurrencyRupee } from "react-icons/md";
import {toast} from 'react-hot-toast';

import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse, setStep } from '../../../../../slices/courseSlice';
import ChipInput from './ChipInput';
import Upload from '../Upload';
import RequirementField from './RequirementField';
import IconBtn from "../../../../common/IconBtn";
import { COURSE_STATUS } from '../../../../../utils/constants';

const CourseInformationForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: {errors},
  } = useForm();

  const {token} = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const {course, editCourse} = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async() => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if(categories.length > 0){
        setCourseCategories(categories);
      }

      setLoading(false);
    }

    // if editing the existing course 
    if(editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseDescription", course.courseDescription);
      setValue('coursePrice', course.price);
      setValue('courseTags', course.tag);
      setValue('courseBenefits', course.whatYouWillLearn);
      setValue('courseCategory', course.category);
      setValue('courseRequirements', course.instructions);
      setValue('courseImage', course.thumbnail);
    }

    getCategories();
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues();
    if(currentValues.courseTitle !== course.courseName ||
      currentValues.courseDescription !== course.courseDescription || // check for the values if any error occurs
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true;
    }
    else return false;
  }

  // when clicked on next/save changes btn
  const submitHandler = async(data) => {

    if(editCourse) {
      if(isFormUpdated()){
        const currentValues = getValues();
        const formData = new FormData();

        formData.append('courseId', course._id);
        if(currentValues.courseTitle !== course.courseName){
          formData.append("courseName", data.courseTitle); 
        }
        if(currentValues.courseDescription !== course.courseDescription){
          formData.append("courseDescription", data.courseDescription); 
        }
        if(currentValues.coursePrice !== course.price){
          formData.append("price", data.coursePrice); 
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if(currentValues.courseBenefits !== course.whatYouWillLearn){
          formData.append("whatYouWillLearn", data.courseBenefits); 
        }
        if(currentValues.courseCategory._id !== course.category._id){
          formData.append("category", data.courseCategory); 
        }
        if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
          formData.append("instructions", JSON.stringify(data.courseRequirements)); 
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);

        if(result){
          dispatch(setStep(2));
          dispatch(setCourse(result))
        }
      }
      else {
        toast.error("No Changes made ");
      }
      return;
    }
    
    // what if creating a new course for first time
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseDescription);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append('thumbnailImage', data.courseImage);

    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if(result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
    console.log("Course Form Data.........", formData);
    console.log("result", result);
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className='rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8 text-richblack-25'>

        {/* title */}
      <div>
        <label htmlFor='courseTitle'> Course Title <sup>*</sup></label>
        <input type="text" id='courseTitle' placeholder='Enter Course Title' className='w-full input-dark'
          {...register('courseTitle', {required: true})}
        />
        {
          errors.courseTitle && ( <span>Course title is required</span>)
        }
      </div>

        {/* short description */}
      <div>
        <label htmlFor='courseDescription'> Course Description <sup>*</sup></label>
        <textarea id="courseDescription" placeholder='Enter a short description about course' className='w-full input-dark min-h-[140px]'
          {...register('courseDescription', {required: true})}
        ></textarea>
        {
          errors.courseDescription && ( <span>Course description is required</span>)
        }
      </div>

        {/* price */}
      <div className='relative'>
        <label htmlFor='coursePrice'> Course price <sup>*</sup></label>
        <input id='coursePrice' placeholder='Enter Course Price' className='w-full input-dark'
          {...register('coursePrice', {
            required: true,
            valueAsNumber: true,
          })}
        />
        <MdCurrencyRupee className='absolute top-1/2 left-1'/>
        {
          errors.coursePrice && ( <span>Course price is required</span>)
        }
      </div>

        {/* course category */}
      <div>
        <label htmlFor='courseCategory'> Course Category <sup>*</sup></label>
        <select id="courseCategory" defaultValue=""
           {...register('courseCategory', {required:true})}
        >
            
          <option value="" disabled>Choose a Category</option>  {/* default value */}
          {
            !loading && courseCategories.map((category, index) =>(
              <option key={index} value={category?._id}>{category?.name}</option>
            ))
          }
        </select>
        {
          errors.courseCategory && (<span>course category is required</span>)
        }
      </div>

        {/* tags */}
      <ChipInput 
        label="Tags"
        name="courseTags"
        placeholder="Enter tag name and press enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

        {/* thumbnail upload */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

        {/* course benefits */}
      <div>
        <label htmlFor="">Benefits of Course<sup className='text-pink-200'>*</sup></label>
        <textarea name="" 
          id="courseBenefits"
          placeholder='Enter benefits of the course'
          {...register('courseBenefits', {required: true})}
          className='min-h-[130px] w-full input-dark'
        ></textarea>
        {
          errors.courseBenefits && (
            <span> Course benefits are required </span>
          )
        }
      </div>

        {/* coure prerequisites */}
      <RequirementField 
        name='courseRequirements'
        label="Requirements/Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      <div>
        {
          editCourse && (
            <button onClick={() => dispatch(setStep(2))} className='flex items-center gap-x-2 bg-richblack-200'>
              Continue W/O Saving 
            </button>
          )
        }
        <IconBtn
          text={!editCourse ? "Next" : "Save Changes"}
        ></IconBtn>
      </div>

    </form>
  )
}

export default CourseInformationForm
