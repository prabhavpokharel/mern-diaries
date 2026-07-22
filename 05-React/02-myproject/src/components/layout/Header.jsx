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
          <Link to="/" className="text-white no-underline!">OUR STORE</Link>
        </div>
        <div className="col-span-2 py-2 px-4">
          <input
            type="search"
            className="bg-slate-200 md:h-full w-full text-black px-2 rounded outline-0 h-8"
            placeholder="Search for Products, Brands, and more"
          />
        </div>
        <div className="col-span-1 flex justify-evenly items-center text-2xl py-2">
          <Link to="/login" className="text-white">
            <GoSignIn />
          </Link>
          <Link to="/register" className="text-white">
            <BsPersonPlus />
          </Link>
          <Link to="/cart" className="text-white">
            <BiCart />
          </Link>
        </div>
      </div>
      <div className="md:flex justify-evenly bg-slate-700 text-white py-1 hidden">
        <Link to="/" className="text-white no-underline!">Home</Link>
        <Link to="/products" className="text-white no-underline!">Products</Link>
        <Link to="/about" className="text-white no-underline!">About Us</Link>
        <Link to="/blogs" className="text-white no-underline!">Blogs</Link>
        <Link to="/contact" className="text-white no-underline!">Contact</Link>
      </div>
      <div className="py-2 bg-slate-100 md:hidden" onClick={toggleMenu}>
        MENU
      </div>
      <div
        className={`transition-all duration-500 text-center md:hidden flex flex-col justify-evenly bg-slate-700 text-white fixed h-[50vh] w-full top-0 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} onClick={toggleMenu}
      >
        <Link className="text-white no-underline!" to="/">Home</Link>
        <Link className="text-white no-underline!" to="/products">Products</Link>
        <Link className="text-white no-underline!" to="/about">About Us</Link>
        <Link className="text-white no-underline!" to="/blogs">Blogs</Link>
        <Link className="text-white no-underline!" to="/contact">Contact</Link>
      </div>
    </>
  );
};

export default Header;
