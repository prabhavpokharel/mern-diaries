import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
// import { FaSignInAlt } from "react-icons/fa";
import { GoSignIn } from "react-icons/go";
import { BsPersonPlus } from "react-icons/bs";
import { BiCart, BiMoon, BiSun } from "react-icons/bi";
import { MyThemeContext } from "../../../context/MyThemeContext";

const Header = () => {
  let [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  let { theme, setTheme } = useContext(MyThemeContext);

  const toggleTheme = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <>
      <div className={`md:grid grid-cols-4 ${theme === "light" ? "bg-slate-200 text-black" : "bg-slate-800 mylink"}`}>
        <div className="col-span-1 text-2xl font-bold text-center py-2">
          <Link to="/" className={`mylink-${theme}`}>
            OUR STORE
          </Link>
        </div>
        <div className="col-span-2 py-2 px-4">
          <input
            type="search"
            className={`bg-slate-200 md:h-full w-full text-black px-2 rounded h-8 input-${theme}`}
            placeholder="Search for Products, Brands, and more"
          />
        </div>
        <div className="col-span-1 flex justify-evenly items-center text-2xl py-2">
          <Link to="/login" className={`mylink-${theme}`}>
            <GoSignIn />
          </Link>
          <Link to="/register" className={`mylink-${theme}`}>
            <BsPersonPlus />
          </Link>
          <Link to="/cart" className={`mylink-${theme}`}>
            <BiCart />
          </Link>

          <span onClick={toggleTheme} className={`mylink-${theme}`} >{theme == "light" ? <BiMoon></BiMoon> : <BiSun></BiSun>}</span>
        </div>
      </div>
      <div className={`md:flex justify-evenly py-1 hidden bg-${theme}`}>
        <Link to="/" className={`mylink-${theme}`}>
          Home
        </Link>
        <Link to="/products" className={`mylink-${theme}`}>
          Products
        </Link>
        <Link to="/about" className={`mylink-${theme}`}>
          About Us
        </Link>
        <Link to="/blogs" className={`mylink-${theme}`}>
          Blogs
        </Link>
        <Link to="/contact" className={`mylink-${theme}`}>
          Contact
        </Link>
      </div>
      <div className="py-2 bg-slate-100 md:hidden" onClick={toggleMenu}>
        MENU
      </div>
      <div
        className={`transition-all duration-500 text-center md:hidden flex flex-col justify-evenly bg-slate-700 mylink fixed h-[50vh] w-full top-0 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={toggleMenu}
      >
        <Link className={`mylink-${theme}`} to="/">
          Home
        </Link>
        <Link className={`mylink-${theme}`} to="/products">
          Products
        </Link>
        <Link className={`mylink-${theme}`} to="/about">
          About Us
        </Link>
        <Link className={`mylink-${theme}`} to="/blogs">
          Blogs
        </Link>
        <Link className={`mylink-${theme}`} to="/contact">
          Contact
        </Link>
      </div>
    </>
  );
};

export default Header;
