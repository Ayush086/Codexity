import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast'

import { IoMdAddCircleOutline } from "react-icons/io";
import { IoCaretBackOutline } from "react-icons/io5";
import { MdArrowRight } from "react-icons/md";

import IconBtn from '../../../../common/IconBtn';
import NestedView from './NestedView';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';

const CourseBuilderForm = () => {

  const dispatch = useDispatch();

  const {register, handleSubmit, setValue, formState: {errors}} = useForm();
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);

  const {token} = useSelector((state) => state.auth)
  const {course} = useSelector((state) => state.course);

  useEffect(() => {
    console.log("course builder form updated")
  }, [course])

  function cancelEdit() {
    setEditSectionName(null);
    setValue("sectionName", "");
  }

  function goBack() {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  function goToNext() {
    // check structure and perform validation
    if(course?.courseContent?.length === 0) {
      toast.error("Atleast one section is needed")
    }
    if(course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error('Atleast one lecture is needed in each section')
      return;
    }

    // course structure is well
    dispatch(setStep(3));
  }

  const submitHandler = async (data)  => {
    setLoading(true);
    let result;

    // if editing existing course
    if(editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token)
    }
    // if not then obviously creating new course
    else {
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      }, token)
    }

    
    // update values (input section)
    if(result) {
      console.log("course created: ", result);
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    } else {
      console.log('course creation failed, result not found');
      console.log(result);
    }

    setLoading(false);
  }

  // edit toggle
  const changeInSectionName = (sectionId, sectionName) => {
    // console.log("Inside changeInSectionName");
    // console.log("editSectionName: ", editSectionName);
    if(editSectionName === sectionId) {
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue('sectionName', sectionName);
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <h1 className="text-2xl font-semibold text-richblack-5">Course Builder</h1>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* new section */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">Section Name<sup>*</sup></label>
          <input type="text" id='sectionName'
            placeholder='Add a section'
            {...register("sectionName", {required: true})}
            className='w-full input-dark'
          />
          {
            errors.sectionName && (
              <span>section name is required</span>
            )
          }
        </div>

          {/* create/edit btn */}
        <div className='flex items-end gap-x-4'>
          <IconBtn 
            type='submit' 
            disabled={loading}
            text={editSectionName ? "Edit Section": `Create Section`}
            outline={true}
            customClasses={"text-white"}
          >
            <IoMdAddCircleOutline size={20} className="text-yellow-50"/>
          </IconBtn>
          {
            editSectionName && (
              <button type='button' onClick={cancelEdit} className='text-sm text-richblack-400 underline'>
                cancel edit
              </button>
            )
          }
        </div>
      </form>

      {/* course structure viewer */}
      {
        course.courseContent.length > 0 && (
          <NestedView handleChangeEditSectionName={changeInSectionName}/>
        )
      }
      <div className='flex justify-between gap-x-4'>
        <button onClick={goBack} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
          <IoCaretBackOutline /> Back
        </button>
        <IconBtn text="Next" disable={loading} onclick={goToNext}> <MdArrowRight /> </IconBtn>
      </div>

    </div>
  )
}

export default CourseBuilderForm
