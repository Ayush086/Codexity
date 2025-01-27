import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="bg-gray-900 flex justify-center items-center h-screen">
      <div className="w-52 h-52 relative perspective-800">
        <span className="absolute w-full h-full rounded-full border-l-2 border-r-2 border-white border-t-0 animate-ani-1"></span>
        <span className="absolute w-full h-full rounded-full border-l-2 border-r-2 border-white border-t-0 animate-ani-2"></span>
        <span className="absolute w-full h-full rounded-full border-l-2 border-r-2 border-white border-t-0 animate-ani-3"></span>
      </div>
    </div>
  );
};

export default Loader;
