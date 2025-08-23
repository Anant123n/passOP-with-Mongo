import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-red-400 via-pink-400 to-yellow-300 text-black px-8 py-4 w-97% flex justify-between items-center rounded-xl shadow-lg mx-1 my-1 ">
      <div className="logo text-3xl font-extrabold tracking-wider cursor-pointer hover:scale-105 hover:text-white transition-all duration-300">
        ShadowVault
      </div>
      <ul className="hidden md:flex gap-10">
        <li>
          <a href="/" className="px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white font-medium transition-all duration-200">Home</a>
        </li>
        <li>
          <a href="#about" className="px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white font-medium transition-all duration-200">About</a>
        </li>
        <li>
          <a href="#contact" className="px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white font-medium transition-all duration-200">Contact</a>
        </li>
        <li>
          <a href="#lock" className="px-4 py-2 rounded-lg hover:bg-white/20 hover:text-white font-medium transition-all duration-200">Lock</a>
        </li>
      </ul>
 
     
    </nav>
  )
}

export default Navbar
