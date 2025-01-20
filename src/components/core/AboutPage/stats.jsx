import React from 'react'


const data = [
    {
        count: "4K",
        label: 'Active Students'
    },
    {
        count: "20+",
        label: 'Mentors'
    },
    {
        count: "80+",
        label: 'Courses'
    },
    {
        count: "30+",
        label: 'Instructors'
    },
]
const Stats = () => {
  return (
    <section className='lg:max-w-maxContent mx-auto'>
      <div className='flex gap-x-10 items-center justify-evenly'>
        {
            data.map((element, index) => {
                return (
                    <div key={index} className='flex flex-col gap-y-1 items-center'>
                        <h1 className='font-bold text-3xl'> {element.count} </h1>
                        <p className='font-semibold text-richblack-300 text-sm'> {element.label} </p>
                    </div>
                )
            })
        }
      </div>
    </section>
  )
}

export default Stats
