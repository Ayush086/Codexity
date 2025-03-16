import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RxDropdownMenu } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineCaretDown } from "react-icons/ai";
import { RiPlayListAddFill } from "react-icons/ri";

import SubSectionModal from './SubSectionModal';
import ConfirmationModal from '../../../../common/ConfirmationModal'
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';

const NestedView = ({ handleChangeEditSectionName }) => {

	const { course } = useSelector((state) => state.course);
	const { token } = useSelector((state) => state.auth);

	const dispatch = useDispatch();

	const [addSubSection, setAddSubSection] = useState(null);
	const [viewSubSection, setViewSubSection] = useState(null);
	const [editSubSection, setEditSubSection] = useState(null);

	const [confirmationModal, setConfirmationModal] = useState(null);

	async function deleteSectionHandler(sectionId) {
		const result = await deleteSection({
			sectionId,
			courseId: course._id,
			token
		})

		if (result) {
			dispatch(setCourse(result));
		}

		setConfirmationModal(null); // close modal
	}

	async function deleteSubSectionHandler(subSectionId, sectionId) {
		const result = await deleteSubSection({subSectionId, sectionId, token })

		if (result) {
			const updatedCourseContent = course.courseContent.map((section) => 
				section._id === sectionId ? result : section
			);

			const updatedCourse = {...course, courseContent:updatedCourseContent};
			dispatch(setCourse(updatedCourse));
		} 
		else {
			console.log(' failed to delete lecture. result not found')
		}

		setConfirmationModal(null); // close modal
	}

	return (
		<div className='mt-5'>

			<div className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer">
				{
					course?.courseContent.map((section) => (
						<details key={section._id} open>

							{/* sections */}
							<summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
								{/* section name */}
								<div className='flex items-center gap-x-3'>
									<RxDropdownMenu className="text-2xl text-richblack-50"/>
									<p className="font-semibold text-richblack-50"> {section.sectionName} </p>
								</div>

								{/* operations on sections */}
								<div className='flex items-center gap-x-3'>

									<button onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}>
										<FaRegEdit className="text-xl text-richblack-300" />
									</button>

									<button onClick={() => setConfirmationModal({
										text1: "Delete Section",
										text2: "All the Subsections and Lectures of this section will be deleted",
										btn1Text: "Delete Section",
										btn2Text: "Cancel",
										btn1Handler: () => deleteSectionHandler(section._id),
										btn2Handler: () => setConfirmationModal(null),
									})}>
										<MdDeleteForever className="text-xl text-richblack-300"/>
									</button>

									<span className="font-medium text-richblack-300">|</span>

									<AiOutlineCaretDown className="text-xl text-richblack-300" />

								</div>

							</summary>

							{/* sub-sections */}
							<div>
								{
									section.subSection.map((data) => (
										<div key={data._id} className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
											onClick={() => setViewSubSection(data)}
										>
											{/* subsection name */}
											<div className='flex items-center gap-x-3'>
												<RxDropdownMenu className="text-2xl text-richblack-50"/>
												<p className="font-semibold text-richblack-50"> {data.title }</p>
											</div>

											<div className='flex items-center gap-x-3' onClick={(e) => e.stopPropagation()}>
												<button onClick={() => setEditSubSection({ ...data, sectionId: section._id })}>
													<FaRegEdit className="text-xl text-richblack-300"/>
												</button>
												<button onClick={() => 
													setConfirmationModal({
														text1: "Delete this Sub-Section?",
														text2: "This lecture will be deleted",
														btn1Text: "Delete",
														btn2Text: "Cancel",
														btn1Handler: () => deleteSubSectionHandler(data._id, section._id),
														btn2Handler: () => setConfirmationModal(null),
													})
												}>
													<MdDeleteForever className="text-xl text-richblack-300"/>
												</button>
											</div>

										</div>
									))
								}

								{/* add lecture btn (new sub section) */}
								<button onClick={() => setAddSubSection(section._id)} className='flex items-center gap-x-1 text-brown-200'>
									<RiPlayListAddFill className='text-lg' />
									<p>Add Lecture</p>
								</button>

							</div>


						</details>
					))
				}
			</div>

			{
				addSubSection
					? (<SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true} />)
					: viewSubSection
						? (<SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />)
						: editSubSection
							? (<SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />)
							: (<div></div>)
			}

			{
				confirmationModal ? (
					<ConfirmationModal modalData={confirmationModal} />
				) : (
					<div></div>
				)
			}

		</div>
	)
}

export default NestedView
