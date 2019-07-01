import React from "react";
import { NavLink } from "react-router-dom";

export default function Header({ children, links }) {
  const initials = children
    .split(" ")
    .map(word => word[0].toLowerCase())
    .join("");
  return (
    <header className="header">
      <h1 style={{ position: "inline" }} className="forLargeScreen">
        {children}
      </h1>
      <h1 style={{ position: "inline" }} className="forSmallScreen">
        {initials}
      </h1>
      <nav>
        {links.map((link, i) => (
          <NavLink to={`/${link}`} activeClassName="selected" key={i}>
            {link}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
