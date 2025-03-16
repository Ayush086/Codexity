import React from 'react'
import { useState } from 'react'
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { toast } from "react-hot-toast";

import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { signUp } from '../../../services/operations/authAPI';

import {setSignupData} from '../../../slices/authSlice'
import { sendOtp } from "../../../services/operations/authAPI";

const SignupForm = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { firstName, lastName, email, password, confirmPassword } = formData;

	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [accountType, setAccountType] = useState('student');

	function changeHandler(e) {
		setFormData((prev) => (
			{
				...prev,
				[e.target.name]: e.target.value
			}
		))
	}

	// Password validation function
	const isPasswordValid = (password) => {
		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(password);
	
		return (
		  password.length >= minLength &&
		  hasUpperCase &&
		  hasLowerCase &&
		  hasNumber &&
		  hasSpecialChar
		);
	  };

	function submitHandler(e) {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (!isPasswordValid(password)) {
			toast.error(
				"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
			);
			return;
		}

		const signupData = {
			...formData,
			accountType,
		};
	  
		// Setting signup data to state
		// To be used after otp verification
		dispatch(setSignupData(signupData));
		// Send OTP to user for verification
		dispatch(sendOtp(formData.email, navigate));

		// reset form
		setFormData({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		});
	}

	return (
		<div>
			<div className='flex rounded-full bg-richblack-700 p-1 gap-x-1 text-white max-w-max'>
				<button
					className={`${accountType === "student" ? "bg-richblack-900 text-richblack-5" : " bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
					onClick={() => setAccountType('student')}
				>
					Student
				</button>
				<button
					className={`${accountType === "instructor" ? "bg-richblack-900 text-richblack-5" : " bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
					onClick={() => setAccountType('instructor')}
				>
					Instructor
				</button>
			</div>

			<form onSubmit={submitHandler}
				className='flex flex-col w-full gap-y-4 mt-3'
			>

				<div className='flex gap-x-3'>
					<label className='w-full text-[.875rem] text-richblack-5'>
						<p className='leading-[1.375rem] mb-1'>
							First Name <sup className='text-pink-200 text-md'>*</sup> 
						</p>

						<input
							type='text'
							name='firstName'
							value={firstName}
							required
							onChange={changeHandler}
							placeholder='Enter First Name'
							className='rounded-[.5rem] text-richblack-5 w-full input-dark'
						></input>
					</label>
					<label className='w-full text-[.875rem] text-richblack-5'>
						<p className='leading-[1.375rem] mb-1'>
							Last Name <sup className='text-pink-200 text-md'>*</sup> 
						</p>

						<input
							type='text'
							name='lastName'
							value={lastName}
							required
							onChange={changeHandler}
							placeholder='Enter Last Name'
							className='rounded-[.5rem] text-richblack-5 w-full input-dark'
						></input>
					</label>


				</div>

				<label className='w-full text-[.875rem] text-richblack-5'>
					<p className='leading-[1.375rem] mb-1'>
						Email Address <sup className='text-pink-200 text-md'>*</sup> 
					</p>

					<input
						type='email'
						name='email'
						value={email}
						required
						onChange={changeHandler}
						placeholder='Enter Email Address'
						className='rounded-[.5rem] text-richblack-5 w-full input-dark'
					></input>
				</label>

				<div className='flex gap-x-3'>
					<label className='w-full text-[.875rem] text-richblack-5 relative'>
						<p className='leading-[1.375rem] mb-1'>
							Create Password <sup className='text-pink-200 text-md'>*</sup>
						</p>

						<input
							type={showPassword ? ("text") : ("password")}
							name='password'
							value={password}
							required
							onChange={changeHandler}
							placeholder='Enter Password'
							className='rounded-[.5rem] text-richblack-5 w-full input-dark'
						></input>
						<span className='absolute right-3 top-[35px] cursor-pointer'
							onClick={() => { setShowPassword((prev) => !prev) }}
						>
							{
								showPassword ? (
									<VscEyeClosed fontSize={24} fill='#afb2bf'></VscEyeClosed>
								) : (
									<VscEye fontSize={24} fill='#afb2bf'></VscEye>
								)
							}
						</span>
					</label>

					<label className='w-full text-[.875rem] text-richblack-5 relative'>
						<p className='leading-[1.375rem] mb-1'>
							Confirm Password <sup className='text-pink-200 text-md'>*</sup> 
						</p>

						<input
							type={showPassword2 ? ("text") : ("password")}
							name='confirmPassword'
							value={confirmPassword}
							required
							onChange={changeHandler}
							placeholder='Enter Password'
							className='rounded-[.5rem] text-richblack-5 w-full input-dark'
						></input>
						<span className='absolute right-3 top-[35px] cursor-pointer'
							onClick={() => { setShowPassword2((prev) => !prev) }}
						>
							{
								showPassword2 ? (
									<VscEyeClosed fontSize={24} fill='#afb2bf'></VscEyeClosed>
								) : (
									<VscEye fontSize={24} fill='#afb2bf'></VscEye>
								)
							}
						</span>
					</label>

				</div>

				<button className='bg-[#2FB4FF] text-black font-semibold rounded-[8px] text-center py-[8px] px-[12px]'> 
					Create Account 
				</button>
			</form>

		</div>
	)
}

export default SignupForm
