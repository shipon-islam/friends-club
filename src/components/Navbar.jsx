import { useEffect, useState } from "react";
import { SlSocialFoursqare } from "react-icons/sl";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [toggle, setToggle] = useState(true);

  const { currentUser, logout } = useAuth();

  function handleWindowClick(event) {
    if (event.target.closest(".navbar") === null) {
      setToggle(true);
    }
  }
  const handleLogout = () => {
    const islogout = window.confirm("Do you want to be logged out?");
    if (islogout) {
      logout();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const link_btn =
    "block text-gray-100 lg:inline uppercase  font-medium py-3 lg:py-0 ml-10 text-[0.9rem] md:text-[1rem] hover:text-red-500 hover:border-red-500 hover:border-b-2 transition-colors duration-400";
  return (
    <>
      <header
        className={`w-full z-50 pl-6 pr-7 py-3 md:px-10 sticky  left-0 top-0 bg-cyan-600 border-b border-green-800/20`}
      >
        <nav
          className="flex relative 
       justify-between items-center navbar"
        >
          <Link
            onClick={() => setToggle(true)}
            className="flex items-center"
            to="/"
          >
            <SlSocialFoursqare className="text-3xl text-gray-100" />
            <p className="capitalize text-[1.4rem] md:text-[2xl] text-gray-200 font-bold ml-1">
              friendsClub
            </p>
          </Link>

          <div
            className={`absolute lg:static w-3/4 ${
              toggle ? "scale-[0] lg:scale-[1]" : "scale-1"
            } lg:w-fit min-h-[89vh] lg:min-h-fit top-[49px]  pt-7 lg:pt-0 pr-3 transition-all duration-500 -left-9 md:-left-16 origin-top-left bg-cyan-600`}
          >
            <NavLink
              className={link_btn}
              to="/"
              style={({ isActive }) => ({
                color: isActive ? "#ef4444" : "",
                borderBottomColor: isActive ? "#ef4444" : "",
              })}
              end
              onClick={() => setToggle((prev) => !prev)}
            >
              home
            </NavLink>
            <NavLink
              className={link_btn}
              to="/videos"
              style={({ isActive }) => ({
                color: isActive ? "#ef4444" : "",
                borderBottomColor: isActive ? "#ef4444" : "",
              })}
              end
              onClick={() => setToggle((prev) => !prev)}
              
            >
              videos
            </NavLink>
           {currentUser&& <NavLink
              className={link_btn}
              to="/profile"
              style={({ isActive }) => ({
                color: isActive ? "#ef4444" : "",
                borderBottomColor: isActive ? "#ef4444" : "",
              })}
              end
              onClick={() => setToggle((prev) => !prev)}
            >
              profile
            </NavLink>}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-4 mt-2 py-1 uppercase font-medium rounded-sm  ml-10 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-gray-700 text-gray-100"
              >
                logout
              </button>
            ) : (
              <button
                onClick={() => setToggle((prev) => !prev)}
                className="px-4 mt-2 py-1 text-white uppercase font-medium rounded-sm  ml-10 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-gray-800"
              >
                <Link to="/login">login</Link>
              </button>
            )}
          </div>

          <button
            className="block lg:hidden px-1 rounded-md"
            onClick={() => setToggle((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-9 h-9 transition-all duration-500 text-slate-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  toggle
                    ? "M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                    : "M6 18L18 6M6 6l12 12"
                }
              />
            </svg>
          </button>
        </nav>
      </header>
    </>
  );
}
