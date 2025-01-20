import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import Quote from '../components/core/AboutPage/Quote'

import AboutImage1 from '../assets/images/about1(1).jpg'
import AboutImage2 from '../assets/images/about2.jpg'
import AboutImage3 from '../assets/images/about3.jpg'
import AboutBanner from '../assets/images/about banner.jpg'
import Stats from '../components/core/AboutPage/Stats'
import AboutGrid from '../components/core/AboutPage/AboutGrid'
import ContactForm from '../components/ContactPage/ContactUsForm'
import Footer from '../components/common/Footer'
import ReviewSlider from '../components/common/ReviewSlider'

const About = () => {
	return (
		<div className='mx-auto text-richblack-25 max-w-full'>
			<div className='flex flex-col gap-y-12 '>

				{/* section-1 */}
				<section>
					<div className='text-white flex flex-col items-center justify-center gap-y-10 w-full '>

						<header className='text-white bg-richblack-700 w-full py-10 h-[400px] relative'>
							<div className='flex flex-col items-center justify-center max-w-[900px] mx-auto'>
								<h1 className='font-semibold text-3xl text-richblack-25'>Driving Innovation in Online Education for a</h1>
								<p className='font-semibold text-3xl'><HighlightText text={'Brighter Future'}></HighlightText></p>
								<div className='text-center text-richblack-400 font-semibold mt-3'>
									Codexity is at the forefont on driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nuturing a vibrant learning community.
								</div>
							</div>
						</header>

						<div className='w-[100%] flex gap-x-10 items-baseline justify-center mx-auto absolute bottom-[25%]' >
							<img src={AboutImage3} alt="" className='object-fill w-[340px] h-[270px] rounded-sm' loading="lazy"/>
							<img src={AboutImage1} alt="" className='object-fill w-[340px] h-[270px] rounded-sm' loading="lazy" />
							<img src={AboutImage2} alt="" className='object-fill w-[340px] h-[270px] rounded-sm' loading="lazy"/>
						</div>

					</div>
				</section>

				{/* section-2 */}
				<section className='mt-[100px] w-full'>
					<div className='text-2xl font-semibold text-center w-[990px] mx-auto'>
						<Quote></Quote>
					</div>
				</section>

				{/* section-3 */}
				<section>
					<div className='flex flex-col gap-x-10'>

						{/* founding story */}
						<div className='flex gap-x-16 items-start justify-center w-full my-8 mx-auto'>
							<div className='text-white w-[51%] flex flex-col gap-y-2'>
								<h1 className='about-highlight text-3xl font-semibold'>Our Founding Story</h1>
								<p className='w-[90%] text-richblack-25'>
									Our e-learning platform was born out of a shared vision and passion for transforming educatin. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
								</p>
								<p className='w-[90%] text-richblack-25'>
									As exprienced educators your lives, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that educatin should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
								</p>
							</div>

							<div>
								<img src={AboutBanner} alt="about-banner" className='w-[370px] h-[220px] rounded-sm object-cover box-shadow' />
							</div>
						</div>

						{/* vision and mission */}
						<div className='flex items-center gap-x-[8rem] text-white mx-auto w-[80%] my-10'>
							<div className=" flex flex-col gap-y-5">
								<h1 className='text-3xl font-semibold about-highlight'>Our Vision</h1>
								<p className='text-richblue-25'> With this vision in mind, we set out an journey to create an e-learning platform that would revolutionize they way people learn. Our team of dedicated expers worked tirelessly to develop a robust and intuitive platform that combined cutting-edge technolgoy with engaging content, fostering dynamic and interactive learning experience.
								</p>
							</div>

							<div className="mission flex flex-col gap-y-5">
								<h1 className='text-3xl font-semibold about-highlight'>Our Mission</h1>
								<p className='text-richblack-25'>
									Our mission goes beyond just delivering courses online. We wnated to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialouge and we foster this spirit of collboration through forums, live sessions, and networking opportunities.
								</p>
							</div>
						</div>

					</div>
				</section>

				{/* section-4 */}
				<section className='bg-richblack-700 w-[100%] mx-auto py-6'>
					{/* stats */}
					<Stats></Stats>
				</section>

				{/* section-5 */}
				<section className='w-10/12 flex items-center mx-auto'>
					{/* combination grid */}
					<AboutGrid></AboutGrid>
				</section>

				{/* section-6 */}
				<section className='flex flex-col gap-y-2 justify-center items-center'>
					<div className='w-fit border px-14 py-10 rounded-3xl border-richblack-700 flex flex-col gap-y-2 justify-center items-center'>
						<h1 className='font-bold text-4xl'> Get In Touch</h1>
						<p className='text-richblack-300 font-medium'>We'd love to here from you, Please fill out this form to reach us.</p>
						<ContactForm></ContactForm>
					</div>
				</section>

				{/* section-7 */}
				<section className="Reviews">
					<div>
						<h1>Reviews From Our Learners</h1>
						<ReviewSlider />
					</div>
				</section> 


			</div>
			<Footer></Footer>
		</div>
	)
}

export default About
