import React, { useState } from "react";
import { func, node } from "prop-types";
import Observer from "@researchgate/react-intersection-observer";

function ViewableMonitor({ tag: Tag, children, ...rest }) {
  const [isIntersecting, changeState] = useState(false);

  return (
    <Observer
      {...rest}
      onChange={({ isIntersecting }) => changeState(isIntersecting)}
    >
      <Tag>{children(isIntersecting)}</Tag>
    </Observer>
  );
}

ViewableMonitor.propTypes = {
  tag: node,
  children: func.isRequired,
};

ViewableMonitor.defaultProps = {
  tag: "div",
};

export default ViewableMonitor;
