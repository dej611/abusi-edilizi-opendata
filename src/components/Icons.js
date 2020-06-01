import React from "react";

export const Check = () => (
  <svg width="12" height="12">
    <use xlinkHref={`${process.env.PUBLIC_URL}/solid.svg#check`} />
  </svg>
);

export const Info = () => (
  <svg width="12" height="12" className="grey-icon">
    <use xlinkHref={`${process.env.PUBLIC_URL}/solid.svg#info-circle`} />
  </svg>
);

export const PointerDown = () => (
  <svg width="12" height="12" className="black">
    <use xlinkHref={`${process.env.PUBLIC_URL}/solid.svg#angle-down`} />
  </svg>
);
