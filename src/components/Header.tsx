import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-xl md:text-2xl font-bold">Todo App</h1>
      </div>
    </header>
  );
};

export default Header;
