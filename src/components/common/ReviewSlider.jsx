import React, { useEffect, useState } from 'react'

// swiper's dependencies
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import ReactStars from 'react-rating-stars-component';

import { apiconnector } from '../../services/apiconnector';
import { ratingsEndpoints } from '../../services/apis';

import { IoMdStar, IoMdStarOutline } from "react-icons/io";

const ReviewSlider = () => {

	const [reviews, setReviews] = useState([]);
	const wordsTruncate = 40;

	useEffect(() => {
		async function fetchAllReviews() {
			const res = await apiconnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
			console.log("REVIEWS_DETAILS_API RESPOSNE........", res);

			const reviewsData = res?.data;
			// console.log('reviewsData', reviewsData)
			if (reviewsData?.success) {
				setReviews(reviewsData?.data);
			}
		}

		fetchAllReviews();
	}, [])

	return (
		<div className='text-richblack-5'>
			<div className='max-w-maxContent h-[200px]'>

				<Swiper
					slidesPerView={4}
					spaceBetween={25}
					loop={true}
					freeMode={true}
					autoplay={{
						delay: 4000
					}}
					modules={[FreeMode, Pagination, Autoplay]}
					className="w-11/12 h-fitContent"
				>

					{
						reviews.map((review, index) => (
							<SwiperSlide key={index}>
								<img
									src={review?.user?.image ?
										review?.user?.image :
										`https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName}%20${review?.user?.lastName}`
									} alt="user's-profile"
									className='h-9 w-9 rounded-full'
								/>

								<p> {review?.user?.firstName} {review?.user?.lastName} </p>
								<p> {review?.course?.courseName} </p>
								<p>
									{review?.review}
								</p>
								<p> {review?.rating.toFixed(1)} </p>
								<ReactStars
									count={5}
									value={review.rating}
									size={20}
									edit={false}
									activeColor='#ffd700'
									emptyIcon={<IoMdStarOutline />}
									fullIcon={<IoMdStar />}
								/>
							</SwiperSlide>
						))
					}

				</Swiper>

			</div>
		</div>
	)
}

export default ReviewSlider
