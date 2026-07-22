import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { FaSignInAlt } from "react-icons/fa";
import { GoSignIn } from "react-icons/go";
import { BsPersonPlus } from "react-icons/bs";
import { BiCart } from "react-icons/bi";

const Header = () => {
  let [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="md:grid grid-cols-4 bg-black text-white">
        <div className="col-span-1 text-2xl font-bold text-center py-2">
          <Link to="/">OUR STORE</Link>
        </div>
        <div className="col-span-2 py-2 px-4">
          <input
            type="search"
            className="bg-slate-200 md:h-full w-full text-black px-2 rounded outline-0 h-8"
            placeholder="Search for Products, Brands, and more"
          />
        </div>
        <div className="col-span-1 flex justify-evenly items-center text-2xl py-2">
          <Link to="/login">
            <GoSignIn />
          </Link>
          <Link to="/register">
            <BsPersonPlus />
          </Link>
          <Link to="/cart">
            <BiCart />
          </Link>
        </div>
      </div>
      <div className="md:flex justify-evenly bg-slate-700 text-white py-1 hidden">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About Us</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="py-2 bg-slate-100 md:hidden" onClick={toggleMenu}>
        MENU
      </div>
      <div
        className={`transition-all duration-500 text-center md:hidden flex flex-col justify-evenly bg-slate-700 text-white fixed h-[50vh] w-full top-0 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} onClick={toggleMenu}
      >
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About Us</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </>
  );
};

export default Header;
