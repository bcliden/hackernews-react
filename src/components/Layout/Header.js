import React from "react";
import { NavLink } from "react-router-dom";

export default function Header({ children, links }) {
  return (
    <header className="header">
      <h1 style={{ position: "inline" }}>{children}</h1>
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
