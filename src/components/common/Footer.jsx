import React from 'react'

import logo from '../../assets/images/logo-full-black.png'

import { FooterLink2 } from '../../data/footer-links';
import { Link } from 'react-router-dom';

// icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from 'react-icons/fa';

const bottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [ "Articles", "Blogs", "Chart Sheet", "Code Challenges", "Docs", "Projects", "Videos", "Workspaces",];
const Plans = ["Paid Membership", "For Students", "Business Solutions"];
const Community = ["Forums", "Chapters", "Events"];


const Footer = () => {
  return (
    <div className='bg-richblack-800'>
      <div className="flex lg:flex-row gap-8 justify-between w-11/12 max-w-maxContent text-[#475569] text-sm leading-6 mx-auto relative py-14">

        {/* Part-1: logo and social media */}
        <div className='resources border-b w-[100%] flex flex-col gap-y-3 pb-5 border-richblue-700 mr-4'>
              <div className="logo flex items-center gap-x-2">
                <img src={logo} alt=""
                className='w-[255px] h-[55px]' />
              </div>
              <p className='text-white pl-1'>Company</p>
              <ul className='gap-y-2 pl-1'>
                <li>About</li>
                <li>Career</li>
                <li>Affiliates</li>
              </ul>
              <div className='flex gap-x-3 pl-1'>
                <FaFacebook></FaFacebook>
                <FaGoogle></FaGoogle>
                <FaTwitter></FaTwitter>
                <FaYoutube></FaYoutube>
              </div>
        </div>

        {/* Part2: RESOURCES AND SUPPORT  */}
        <div className='resources border-b w-[90%] flex flex-col gap-y-3 pb-5 border-richblue-700'>
          <p className='text-white'>Resources</p>

          <div className='flex flex-col'>
            {
              Resources.map((Element, index) => {
                return <Link to={Element} key={index}>{Element}</Link>
              })
            }
          </div>
          
          <p className='text-white'>Support</p>
        </div>

        <div className='plans border-b w-[90%] flex flex-col gap-y-3 pb-5 border-richblue-700'>
          <p className='text-white'>Plans</p>

          <div className='flex flex-col'>
            {
              Plans.map((Element, index) => {
                return <Link to={Element} key={index}>{Element}</Link>
              })
            }
          </div>
          
          <p className='text-white'>Community</p>
          <div className='flex flex-col'>
            {
              Community.map((Element, index) => {
                return <Link to={Element} key={index}>{Element}</Link>
              })
            }
          </div>
        </div>

        {/* Part3: Subjects */}
        <div className='resources border-b w-[90%] flex flex-col gap-y-3 pb-5 border-richblue-700'>
          <p className='text-white'>{FooterLink2[0].title}</p>
          <div className='flex flex-col'>
            {
              FooterLink2[0].links.map((item, index) => (
                <Link to={item.link} key={index}>{item.title}</Link>
                
              ))
            }
          </div>
        </div>

        {/* Part4: Languages */}
        <div className='resources border-b w-[90%] flex flex-col gap-y-3 pb-5 border-richblue-700'>
          <p className='text-white'>{FooterLink2[1].title}</p>
          <div className='flex flex-col'>
            {
              FooterLink2[1].links.map((item, index) => (
                <Link to={item.link} key={index}>{item.title}</Link>
                
              ))
            }
          </div>
        </div>

        {/* Part4: Career Building */}
        <div className='resources border-b w-[90%] flex flex-col gap-y-3 pb-5 border-richblue-700'>
          <p className='text-white'>{FooterLink2[2].title}</p>
          <div className='flex flex-col'>
            {
              FooterLink2[2].links.map((item, index) => (
                <Link to={item.link} key={index}>{item.title}</Link>
                
              ))
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default Footer
