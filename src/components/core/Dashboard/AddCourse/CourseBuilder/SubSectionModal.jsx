import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {toast} from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { RxCross2 } from "react-icons/rx";

import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import Upload from '../Upload';
import IconBtn from '../../../../common/IconBtn';

const SubSectionModal = ({ modalData, setModalData, add = false, view = false, edit = false }) => {

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const { register, handleSubmit, setValue, formState: {errors}, getValues } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // can be viewed or edited if added
    if (view || edit) {
      setValue('lectureTitle', modalData.title);
      setValue('lectureDescription', modalData.description);
      setValue('lectureVideo', modalData.videoUrl);
    }
  }, [])

  // update values if any
  const isFormUpdated = () => {
    const currentValues = getValues();
    // if current values are not equal to save data values (then values are updated)
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDescription !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    }
    return false;
  }

  async function editSubSectionHandler() {
    const currentValues = getValues();
    const formData = new FormData();

    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);

    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDescription !== modalData.description) {
      formData.append("description", currentValues.lectureDescription);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }

    // API CALL
    setLoading(true);
    const result = await updateSubSection(formData, token);

    if (result) {
      // TODO: check for udpation
      const updatedCourseContent = course.courseContent.map((section) => section._id === modalData.sectionId ? result : section);
      const updatedCourse = {...course, courseContent: updatedCourseContent};
      dispatch(setCourse(updatedCourse));
    } else {
      // if API call fails
      toast.error('Failed to update sub-section');
    }

    setModalData(null);
    setLoading(false);
  }

  const submitHandler = async (data) => {
    // if opened in view mode then no edit is required
    if (view) {
      return;
    }

    if (edit) {
      // opened in edit mode but not updated then nothing to change
      if (!isFormUpdated()) {
        toast.error('No Changes Made');
      }
      // if made changes then update changes to db
      else {
        editSubSectionHandler();
      }

      return;
    }

    // ADD
    // create formdata to save details
    const formData = new FormData();

    formData.append('sectionId', modalData); // modalData <- addSubSection <- section._id (argurment passing)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDescription);
    formData.append('video', data.lectureVideo);

    // API CALL
    setLoading(true);
    const result = await createSubSection(formData, token);

    if (result) {
      // TODO: check for updations ( done updation: on subsection change update changes in section and course also)
      const updatedCourseContent = course.courseContent.map((section) => 
      section._id === modalData ? result : section);
      const updatedCourse = {...course, courseContent: updatedCourseContent};
      dispatch(setCourse(updatedCourse));
    } else {
      // result not found
      toast.error('Failed to create sub-section, result not found');
    }

    setModalData(null);
    setLoading(false);
  }


  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">

      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">

        {/* header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5"> {view && "View"} {add && "Add New"} {edit && "Edit"} Lecture </p>
          <button type='button' onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5"/>
          </button>
        </div>

        {/* details preview */}
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-8 px-8 py-10">

          {/* video preview */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          ></Upload>

          {/* lecture title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle"> Lecture Title {!view && <sup className="text-pink-200">*</sup>} </label>
            <input type="text"
            disabled={view || loading}
              id='lectureTitle'
              placeholder='Enter Lecture Title'
              {...register('lectureTitle', { required: true })}
              className='w-full input-dark'
            />
            {
              errors.lectureTitle && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">title is required</span>
              )
            }
          </div>

          {/* description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDescription"> Lecture Description {!view && <sup className="text-pink-200">*</sup>} </label>
            <textarea
              id='lectureDescription'
              disabled={view || loading}
              placeholder='What topics are covered in this lecture'
              {...register('lectureDescription', { required: true })}
              className='w-full resize-x-none input-dark min-h-[130px]'
            />
            {
              errors.lectureDescription && (
                <span className="ml-2 text-xs tracking-wide text-pink-200"> description is required </span>
              )
            }
          </div>

          {
            !view && (
              <div className="flex justify-end">
                <IconBtn 
                  text={loading ? "Saving..." : edit  ? "Save Changes" : "Save"}
                  disabled={loading}
                />
              </div>
            )
          }

        </form>
      </div>

    </div>
  )
}

export default SubSectionModal
