import React from "react";
import { Link } from "react-router-dom";
import { TiArrowRight } from "react-icons/ti";

import banner from "../assets/videos/home_banner.mp4";

import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import CodeBlock from "../components/core/HomePage/CodeBlock";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";

import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";


const Home = () => {
  return (
    <div>
      {/* section 1 */}

      <div className="relative mx-auto flex flex-col justify-between items-center w-11/12 max-w-maxContent text-white">

        <Link to={"/signup"}>
          <div className="group mt-6 p-1 mx-auto rounded-full bg-richblack-800 font-semibold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit hover:bg-richblack-900 border-[.5px] hover:border-richblack-100 ">
            {/* <div className="flex items-center rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-800">
              <p> Explore Courses </p>
              <TiArrowRight className="font-bold text-2xl" />
            </div> */}
            <div className="flex flex-row items-center gap-1 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900 group-hover:text-richblack-100">
              <p>Explore Courses</p>
              <TiArrowRight className="font-bold text-2xl"/>
            </div>
          </div>
        </Link>

        {/* tagline */}
        <div className="tagline text-center font-semibold text-4xl mt-7">
          <HighlightText text={"Code "}></HighlightText>
          Your Future to Awesome
        </div>
            
            {/* sub-heading */}
        <div className="description mt-4 text-center w-[90%] text-lg font-semibold text-[#d3d3d3ba]"> 
          Codexity is your creative playground for coding. Dive into interactive courses that are as unique as your future aspirations. Experience a
          platform where your creativity shapes your coding education.
        </div>

        {/* cta: call-to-action buttons */}
        {/* 
        <div className="buttons flex mt-8 gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/signup"}>
            Take a Demo
          </CTAButton>{" "}
          
        </div> 
        */}

        <div className="video mx-3 my-16 w-[750px] h-[380px] shadow-blue-200 shadow-[10px_-5px_50px_-5px]"> 
          <div className="relative w-[750px] h-[420px] bg-white rounded-sm">
            <video muted loop autoPlay
            className="absolute bottom-3 right-3 object-contain rounded-sm ">
              <source src={banner} type="video/mp4"></source>
            </video>
          </div>
        </div>

        {/* code div-1 */}
        <div>
          <CodeBlock
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unleash Your{" "}
                <HighlightText text={"Coding Potential"}></HighlightText> with
                Our Online Courses
              </div>
            }
            subheading={
              "The ultimate destination for aspiring coders and tech enthusiasts to learn, create, and innovate. Start coding and build the future you envision."
            }
            ctabtn1={{
              btnText: "Try It Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            // code={
            //     `<!DOCTYPE html>\n<html>\n<head>\n <title>New Learning</title>\n</head>\n<body>\n <h1>Welcome to Codexity</h1> \n <ul>\n  <li>Personalized Learning</li> \n  <li>Expert Instructors</li> \n </ul> \n</body> \n</html>`
            // }
            code={`<!DOCTYPE html>
                        <html>
                            <title> New Learning </title>
                        <body>
                            <h1> Welcome to Codexity </h1>
                            <p>This is a sample HTML page.</p>
                            <ul>
                                <li> Personalized Learning </li>
                                <li> Expert Instructors </li>
                                <li> Interactive Courses </li>
                            </ul>
                        </body>
                        </html>
                        `}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          ></CodeBlock>
        </div>

        {/* code div-2 */}
        <div>
          <CodeBlock
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold lg:w-[70%] w-[100%]">
                Every {" "}
                <HighlightText text={"Great Developer"}></HighlightText> <br /> started as a beginner
              </div>
            }
            subheading={
              "The only way to reach new heights is to keep climbing. Continue your programming adventure."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            // code={
            //     `<!DOCTYPE html>\n<html>\n<head>\n <title>New Learning</title>\n</head>\n<body>\n <h1>Welcome to Codexity</h1> \n <ul>\n  <li>Personalized Learning</li> \n  <li>Expert Instructors</li> \n </ul> \n</body> \n</html>`
            // }
            code={`<!DOCTYPE html>
                        <html>
                            <title> New Learning </title>
                        <body>
                            <h1> Welcome to Codexity </h1>
                            <p>This is a sample HTML page.</p>
                            <ul>
                                <li> Personalized Learning </li>
                                <li> Expert Instructors </li>
                                <li> Interactive Courses </li>
                            </ul>
                        </body>
                        </html>
                        `}
            codeColor={"text-richblack-5"}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          ></CodeBlock>
        </div>
              {/* Explore More Section */}
        <ExploreMore></ExploreMore>

      </div>

      {/* section 2 */}

			<div className="bg-pure-greys-5 text-richblack-700 pb-8 mt-2">
				<div className="homepage_bg h-[300px]">

					<div className="w-11/12 max-w-maxContent flex flex-col items-center gap-4 mx-auto">
						
						<div className="h-[150px]"></div>
						<div className="flex gap-7 text-white">
							<CTAButton active={true} linkto={"/signup"}>
								<div className="flex gap-1 items-center">
									Explore Courses
									<TiArrowRight className='font-bold text-xl'></TiArrowRight>
								</div>
							</CTAButton>

							<CTAButton active={false} linkto={'/signup'}>
								Learn More
							</CTAButton>
						</div>

					</div>

				</div>

				<div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between py-7">
					
					<div className="flex flex-row gap-6 my-10"> 

							<div className="text-4xl font-semibold w-1/2"> 
								Get the skills you need for a 
								<HighlightText text={" job that is in demand."}></HighlightText> 
							</div>

							<div className="flex flex-col gap-4 w-1/2 items-start">
								<div className="text-[1em]">
									Join Codexity, the only platform that adapts to your learning style, turning coding into a creative adventure. Learn, innovate, and lead in the digital age.
								</div>
									<CTAButton active={true} linkto={'/signup'}> Learn More </CTAButton>
							</div>
							
					</div>

					<TimelineSection></TimelineSection>

					<LearningLanguageSection></LearningLanguageSection>

				</div>

			</div>

      {/* section 3 (become instructor) */}

			<div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-5 text-white">

							<InstructorSection></InstructorSection>

							<h2 className="text-center text-4xl font-semibold mt-10">Reviews From Learners</h2>
							{/* review slider */}
              <ReviewSlider></ReviewSlider>
			</div>

      {/* section 4 (footer) */}
			<Footer></Footer>
    </div>
  );
};

export default Home;
