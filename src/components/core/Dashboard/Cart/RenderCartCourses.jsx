import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ReactStars from "react-rating-stars-component";

import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { removeFromCart } from '../../../../slices/cartSlice';

const RenderCartCourses = () => {

	const { cart } = useSelector((state) => state.cart);
	const dispatch = useDispatch();

	return (
		<div>
			{
				cart.map((course, index) => (
					<div className='text-richblue-25'>
						<div>

							<img src={course?.thumbnail} alt="course-thumbnail" />
							<div>
								<p>{course?.courseName}</p>
								<p>{course?.category?.name}</p>
								{/* ratings must be loaded here (hardcoded for temporary purpose) */}
								<div>
									<span>4.5</span> 
									<ReactStars
										count={4.5}
										size={20}
										edit={false}
										activeColor='#ffd700'
										emptyIcon={<IoMdStarOutline />}
										fullIcon={<IoMdStar />}
									></ReactStars>
									<span>{course?.ratingAndReviews?.length} Ratings</span>
								</div>
							</div>

						</div>

						<div>
							<button onClick={() => dispatch(removeFromCart(course._id))}>
								<RiDeleteBinLine />
							</button>
							<p>{course?.price}</p>
						</div>

					</div>
				))
			}
		</div>
	)
}

export default RenderCartCourses
