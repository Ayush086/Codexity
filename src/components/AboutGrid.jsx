import React from 'react'
import HighlightText from '../HomePage/HighlightText';
import Button from '../HomePage/Button';

const data = [
    {
        order: -1,
        heading: "World-Class Learning for",
        highlightText: "Anyone, Anywhere",
        description: "Codexity partners with more than 365+ leading universities and companies to bring flexible affordable, job-relevant online learning to individuals and organizations worldwide.",
        BtnText: 'Learn More',
        BtnLink: '/',
    }, 
    {
        order: 1,
        heading: "Curriculum Based on Industry Needs",
        description: "Save time and money! The Belajar curriculum is made to be easir to understand and in line with industry need",
    }, 
    {
        order: 2,
        heading: "Our Learning Methods",
        description: "Codexity partners with more than 275+ leading universities and companies to bring",
    }, 
    {
        order: 3,
        heading: "Certification",
        description: "Codexity partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 4,
        heading: 'Rating "Auto-grading"',
        description: "Codexity partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 5,
        heading: "Ready to Work",
        description: "Codexity partners with more than 275+ leading universities and companies to bring",
    },
];


const AboutGrid = () => {
  return (
    <div>
      <div className='grid mx-auto grid-cols-1 lg:grid-cols-4 mb-10 lg:w-fit'>
        {
            data.map((element, index) => {
                return (
                    // first black will be empty
                    <div key={index} className={`${index === 0 && 'lg:col-span-2'} lg:h-[250px] items-center
                    ${
                        element.order % 2 === 1 ? 'bg-richblack-700' : 'bg-richblack-800' // color combination
                    }
                    ${
                        element.order === 3 && 'lg:col-start-2' // certifcation grid condition 
                    }
                    ${ element.order < 0 && 'bg-transparent'}`
                    }>
                        {
                            element.order < 0 ? (
                                <div className='flex flex-col gap-y-2 p-5 pl-8'>
                                    <div className='flex flex-col text-3xl font-semibold'>
                                        {element.heading}
                                        <HighlightText text={element.highlightText}></HighlightText>
                                    </div>
                                    <p className='font-medium text-richblack-300 mb-1'> {element.description} </p>
                                    <div className='w-fit'>
                                        <Button active={true} linkto={element.BtnLink}>
                                            {element.BtnText}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-8 p-6'>
                                    <h1 className='text-richblack-5 text-lg font-semibold'> {element.heading} </h1>
                                    <p className='text-richblack-300'> {element.description} </p>
                                </div>
                            )
                        }
                    </div>
                )
            })
        }
      </div>
    </div>
  ) 
}

export default AboutGrid

