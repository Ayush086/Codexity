import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import CourseSlider from '../components/core/Catalog/CourseSlider'
import Footer from '../components/common/Footer'

import { apiconnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import CourseCardWrapper from '../components/core/Catalog/CourseCardWrapper'



const Catalog = () => {

	const { catalogName } = useParams();
	const [catalogPageData, setCatalogPageData] = useState(null);
	const [categoryId, setCategoryId] = useState(null); // to get to know which category is selected by user

	// fetch category data (API CALL)
	useEffect(() => {
		const getCategory = async() => {
			const response = await apiconnector('GET', categories.CATEGORIES_API);
			const category_id = response?.data?.data?.filter((ct) => ct.name.split(' ').join('-').toLowerCase() === catalogName)[0]._id;
			setCategoryId(category_id);

		}

		if(categoryId){
			getCategory();
		}
	}, [catalogName]);

	useEffect(() => {
		const getCategoryData = async() => {
			try {
				const response = await getCatalogPageData(categoryId);
				setCatalogPageData(response);
				console.log("catalog page data:.......", response);

			} catch (error) {
				console.log("error getting category (CAtalog.jsx)")
				console.log(error);
			}
		}

		getCategoryData();
	}, [categoryId])
	

	return (
		<div className='text-richblack-25 w-11/12 flex flex-col justify-center'>

			{/* header */}
			<div>
				<p>
					{`Home/Catalog/`}
					<span className='text-blue-100'>{catalogPageData?.data?.selectedCategory?.name}</span>
				</p>
				<h1>{catalogPageData?.data?.selectedCategory?.name}</h1>
				<p>{catalogPageData?.data?.selectedCategory?.description}</p>
			</div>

			{/* top bought courses */}
			<div> 

				{/* section-1 */}
				<div>
					<div>Search Related Courses</div>
					<div>
						<p>Most Popular</p>
						<p>Recently Published</p>
					</div>
					<div>
						<CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
					</div>
				</div>

				{/* section-2 */}
				<div>
					<p>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</p>
					<div>
						<CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
					</div>
				</div>

				{/* section-3 */}
				<div>
					<p>Frequenty Bought</p>
					<div className='py-8'>
						<div className='grid grid-cols-1 lg:grid-cols-3'>
							{
								catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, index) => (
									<CourseCardWrapper course={course} key={index} Height={"350px"} />
								))
							}
						</div>
					</div>
				</div>

			</div>

			<Footer />
		</div>
	)
}

export default Catalog
