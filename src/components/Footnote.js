import React from "react";
import { string, arrayOf, node, oneOfType } from "prop-types";

export default function Footnote({ children }) {
  return <p className="content is-small">{children}</p>;
}

Footnote.propTypes = {
  children: oneOfType([string, node, arrayOf(oneOfType([string, node]))])
    .isRequired,
};
