import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"

import frameImg from "../../../assets/images/bg-login.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formtype }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="grid h-screen overflow-hidden place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 pb-[3.25rem] md:flex-row md:gap-y-0 md:gap-x-12">
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            <p className="flex flex-col py-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            {formtype === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0 lg:mt-16">
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={500}
              loading="lazy"
              className="object-cover"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={500}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Template