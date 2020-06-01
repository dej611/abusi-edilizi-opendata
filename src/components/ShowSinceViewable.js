import React, { useState } from "react";
import { string, arrayOf, node, oneOfType } from "prop-types";

import ViewableMonitor from "./ViewableMonitor";

const ShowSinceViewable = ({ children }) => {
  const [viewable, setViewable] = useState(false);
  return (
    <ViewableMonitor>
      {(isViewable) => {
        if (!viewable) {
          if (isViewable) {
            setViewable(true);
          }
          return null;
        }
        return children;
      }}
    </ViewableMonitor>
  );
};

ShowSinceViewable.propTypes = {
  children: oneOfType([string, node, arrayOf(oneOfType([string, node]))])
    .isRequired,
};

export default ShowSinceViewable;
