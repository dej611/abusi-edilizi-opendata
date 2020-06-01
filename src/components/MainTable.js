import React, { useCallback } from "react";
import { arrayOf, bool, func, number, shape, string } from "prop-types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import { HOVER_REGION } from "../stores";
import { Info } from "./Icons";

function Table({ rows, selected, isMobile, handleAreaHover }) {
  const [t] = useTranslation();
  const handleHover = useCallback(
    (region) => {
      if (!isMobile && handleAreaHover) {
        handleAreaHover(region);
      }
    },
    [handleAreaHover, isMobile]
  );

  return (
    <table
      className="table is-fullwidth region-table"
      style={{ maxHeight: "450px" }}
    >
      <thead>
        <tr>
          <th>{t("charts:Regione")}</th>
          <th
            className="tooltip is-tooltip-multiline is-tooltip-left-desktop"
            data-tooltip={t("tooltips:Indicatore")}
          >
            {t("charts:Indicatore")}
            <sup>
              <Info />
            </sup>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ name, value }) => (
          <tr
            className={`${name === selected ? "is-selected " : ""}`}
            key={name}
            onMouseOver={() => handleHover(name)}
          >
            <th>{name}</th>
            <td style={{ textAlign: "right" }}>{value.toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const mapStateToProps = ({ navigation }) => {
  return {
    selected: navigation.hover_region,
  };
};

const propsToState = (dispatcher) => ({
  handleAreaHover: (area) => dispatcher({ type: HOVER_REGION, area }),
});

Table.propTypes = {
  rows: arrayOf(
    shape({
      name: string,
      value: number,
    })
  ),
  isMobile: bool,
  selected: string,
  handleAreaHover: func,
  t: func,
};

export default connect(mapStateToProps, propsToState)(Table);
