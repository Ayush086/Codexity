import React from 'react'
import { useSelector } from 'react-redux'

import { FaCheck } from "react-icons/fa";

import CourseInformationForm from './CourseInformation/CourseInformationForm';
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm';
import PublishCourse from './PublishCourse/PublishCourse';

const RenderSteps = () => {

	const { step } = useSelector((state) => state.course);

	const steps = [
		{
			id: 1,
			title: "Course Information",
		},
		{
			id: 2,
			title: "Course Builder",
		},
		{
			id: 3,
			title: "Publish Course",
		},
	]

	return (
		<div>

			<div>
				{
					steps.map((item) => (
						<div>

							<div>
								<div className={`${step === item.id
									? "bg-yellow-800 border-yellow-200 text-yellow-5"
									: " border-richblack-700 bg-richblack-800 text-richblack-300"}`
								} key={item.id}>
									{
										step > item.id ? (<FaCheck/>) : (item.id)
									}
								</div>
							</div>

							{/* write code for timeline between steps */}

						</div>
					))
				}
			</div>

			<div>
				{
					steps.map((item) => (
						<div>
							<p>{item.title}</p>
						</div>
					))
				}
			</div>

			{step === 1 && <CourseInformationForm />}
			{step === 2 && <CourseBuilderForm />}
			{step === 3 && <PublishCourse />}

		</div>
	)
}

export default RenderSteps
