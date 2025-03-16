import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { SiGmail } from "react-icons/si";
import { FaLock } from "react-icons/fa";
import { login } from "../../../services/operations/authAPI"
function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full" style={{position:"relative"}}>
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <SiGmail style={{color:"grey",position:"absolute",top:"calc(52%)",left:"1.85%",fontSize:"20px"}}/>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter Email Address"
          
          style={{
             paddingLeft:"45px"
          }}
          className="w-full rounded-[0.5rem] input-dark"
        />
       
      </label>
      <label className="relative" >
      <FaLock style={{color:"grey",position:"absolute",top:"calc(42%)",left:"1.65%",fontSize:"20px"}}/>
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
       
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          style={{
            paddingLeft:"45px"
          }}
          className="w-full rounded-[0.5rem] input-dark"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100 underline decoration-slice underline-offset-1">
            Forgot Password
          </p>
        </Link>
      </label>
      <button className='bg-[#2FB4FF] text-black font-semibold rounded-[8px] text-center py-[8px] px-[12px]'> 
					Login
				</button>
    </form>
  )
}

export default LoginForm