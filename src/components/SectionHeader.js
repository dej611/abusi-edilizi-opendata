import React from "react";
import { node } from "prop-types";

function SectionHeader({ children }) {
  return (
    <section className="hero">
      <div className="hero-body">
        <div className="container">{children}</div>
      </div>
    </section>
  );
}

SectionHeader.propTypes = {
  children: node,
};

export default SectionHeader;
