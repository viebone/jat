// Header.js
import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi'; // Using react-icons for a user icon
import { Link } from 'react-router-dom'; // You can use this for navigation

function Header({ nickname, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg mb-4">
      {/* Left side: Job Application Tracker title */}
      <h1 className="text-3xl font-bold text-gray-800">Job Application Tracker</h1>

      {/* Right side: User icon with dropdown */}
      <div className="relative">
        <button
          className="flex items-center space-x-2"
          onClick={toggleDropdown}
        >
          <FiUser className="text-2xl text-gray-700" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
            <p className="px-4 py-2 text-sm text-gray-700">Hi, {nickname}</p>
            <hr className="border-gray-200" />
            <Link
              to="/account-details"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Account Details
            </Link>
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
