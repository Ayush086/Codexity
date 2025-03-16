import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const RequirementField = ({name, label, register, setValue, errors, getValues}) => {

  const {editCourse, course} = useSelector((state) => state.course)  
  const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);

    useEffect(() => {
      if(editCourse){
        setRequirementList(course?.instructions)
      }
      register(name, {required: true, validate: (value) => value.length > 0})
    }, [])

    useEffect(() => {
      setValue(name, requirementList)
    }, [requirementList])
    
    // useEffect(() => {
    //   setValue(name, requirementList)
    // }, [requirementList])

    const addHandler = () => {
        if(requirement) {
          setRequirementList([...requirementList, requirement]);
          setRequirement("");
        }
    }

    const removeHandler = (index) => {
      const updatedRequirementList = [...requirementList];
      updatedRequirementList.splice(index, 1);
      setRequirementList(updatedRequirementList);
    }

  return (
    <div>

      <label htmlFor={name}>{label} <sup className='text-pink-200'>*</sup></label>
      <div>
        <input type="text" id={name} className='w-full input-dark'
          value={requirement} placeholder='Enter course prequisites'
          onChange={(e) => setRequirement(e.target.value)}
        />
        <button type='button' onClick={addHandler} className='font-semibold text-yellow-50' >Add </button>
      </div>
      {
        requirementList.length > 0 && (
          <ul>
            {
              requirementList.map((requirement, index) => (
                <li key={index}>
                  <span>{requirement}</span>
                  <button
                  type='button' onClick={() => removeHandler(index)} className='text-xs text-pure-greys-300'>clear
                  </button>
                </li>
              ))
            }
          </ul>
        )
      }
      {
        errors[name] && (
          <span>
            {label} is required
          </span>
        )
      }

    </div>
  )
}

export default RequirementField
