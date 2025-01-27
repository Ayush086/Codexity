import React, { useEffect, useState } from "react";
import { Link, matchPath, NavLink, useLocation } from "react-router-dom";

import logo from "../../assets/images/logo-full-black.png";
import { FiShoppingCart } from "react-icons/fi";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";

import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { apiconnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";

import ProfileDropdown from "../core/Auth/ProfileDropdown";
import Loader from './Loader'

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  // api call
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiconnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
        console.log("sublinks: \n", res);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
        console.log(error);
      }
      setLoading(false);
    };

    fetchCategories();
    console.log("TOKEN....", token);
  }, []);

  // to check which bookmark is active
  const location = useLocation();
  const isActive = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-[4.5rem] items-center justify-center border-b-[2px] border-b-richblack-700">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* logo */}
        <Link to="/">
          <img
            src={logo}
            alt=""
            className="w-[200px] h-[60px]"
            loading="lazy"
          />
        </Link>

        {/* nav-paths */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="flex items-center gap-x-2 group">
                {link.title === "Catalog" ? (
                  <div className="flex gap-[1px] items-center relative">
                    <p>{link.title}</p>
                    <IoIosArrowDown />

                    <div
                      className="invisible absolute left-[2%] top-[80%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible
												group-hover:opacity-100 z-10 lg:w-[200px] lg:h-[100px] translate-x-[-50%] translate-y-[10%]"
                    >
                      <div className="absolute left-[60%] top-[0] h-8 w-8 rotate-45 rounded-sm bg-richblack-5"></div>
                      {loading ? (
													<Loader />
												)	: subLinks.length ? (
                        subLinks.map((sublink, index) => (
                          <Link
                            to={`/catalog/${sublink.name.split(" ").join('-').toLowerCase()}`}
                            key={index}
                            className="flex flex-col gap-y-2 rounded-lg bg-transparent py-2 pl-4 hover:bg-richblack-50"
                          >
                            <p className="text-black">{sublink.name}</p>
                          </Link>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <NavLink to={link?.path}>
                    <p
                      className={`${
                        isActive(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* login/signup/dashboard */}
        <div className="flex gap-x-4 items-center">
          {
            // add styling to the cart-icon and position the total-itmes
            user && user?.accountType !== "Instructor" && (
              <Link to="dashboard/cart" className="relative text-richblack-5 text-2xl">
                <PiShoppingCartSimpleBold />
                {totalItems > 0 && <span> {totalItems} </span>}
              </Link>
            )
          }
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 bg-richblue-900 px-4 py-2 text-richblack-100 rounded-md">
                Log In
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 bg-richblue-900 px-4 py-2 text-richblack-100 rounded-md">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown></ProfileDropdown>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
