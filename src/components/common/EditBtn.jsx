import React from 'react'

const EditBtn = ({ text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onclick}
            className={`flex items-center ${outline ? "border border-sky-blue bg-transparent" : "bg-richblue-100"
                } cursor-pointer rounded-md p-1 text-richblack-900 ${customClasses} hover:bg-blue-100 transition-all duration-200`}
            type={type}
        >
            {
                children ? (
                    <>
                        <span className={`${outline && "text-yellow-50"}`}>{text}</span>
                        {children}
                    </>
                ) : (
                    text
                )
            }
        </button>
    )
}

export default EditBtn
