import React from "react";

export default function Header({ children }) {
  return (
    <header className="header">
      <h1>{children}</h1>
    </header>
  );
}
