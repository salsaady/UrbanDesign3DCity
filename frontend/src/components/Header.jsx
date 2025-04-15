import React from 'react';

const Header = ({ title }) => {
  return (
    <header style={{ padding: "1rem", backgroundColor: "#333", color: "#fff" }}>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
