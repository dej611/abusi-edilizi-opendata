import React, { useMemo, useCallback } from "react";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { array, bool, func, number, shape } from "prop-types";
import { max } from "d3-array";
import { useTranslation } from "react-i18next";

import AreaChart from "./AreaChart";
import { getClassByNumber } from "../utils";
import { HOVER_CLEAR } from "../stores";
import { getHoverArea } from "../stores/selectors";

function SmallMultiples({
  area,
  data,
  width,
  height,
  margin,
  perRow,
  sortByValue,
  isMobile,
  handleClear,
}) {
  const [t] = useTranslation();
  // workout the max from the dataset
  const maxYAxis = useMemo(
    () => max(data.municipalities, (municipality) => max(municipality)),
    [data]
  );

  // assign a temporary id based on index
  // then workout the max aggregated
  const dataset = useMemo(
    () =>
      data.municipalities.slice(0).map((entry, i) => ({ id: i, value: entry })),
    [data]
  );

  // define a couple of helpers
  const renderTitle = useCallback(
    (i) => {
      const title = `${t("charts:Municipio")} ${dataset[i].id + 1}`;
      return area - 1 === dataset[i].id ? (
        <h4 className="subtitle">{title}</h4>
      ) : (
        <h5 className="subtitle">{title}</h5>
      );
    },
    [area, dataset, t]
  );

  const renderSelectionStyle = useCallback(
    (i) => {
      const hasOpacity = area == null || area === dataset[i].id + 1;
      return { opacity: hasOpacity ? 1 : 0.4 };
    },
    [area, dataset]
  );

  if (sortByValue) {
    const totals = data.municipalities.map((municipality) =>
      municipality.reduce((partial, value) => partial + value, 0)
    );
    dataset.sort((a, b) => totals[b.id] - totals[a.id]);
  }
  // now pass the yScale as prop to the charts

  return (
    <div>
      {isMobile && (
        <button
          className="button is-text is-pulled-right"
          onClick={(e) => {
            e.preventDefault();
            handleClear(null);
          }}
        >
          Reset
        </button>
      )}
      <div className="columns is-multiline">
        {dataset.map((municipality, i) => (
          <div
            className={`column ${getClassByNumber(perRow)}`}
            key={`mun-${i}`}
            style={renderSelectionStyle(i)}
          >
            {renderTitle(i)}
            <AreaChart
              data={municipality.value}
              years={data.years}
              width={width}
              height={height}
              margin={margin}
              maxYAxis={maxYAxis || []}
              name={`municipio-${i + 1}`}
              area={municipality.id + 1}
              label={i % perRow === 0}
              isMobile={isMobile}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

SmallMultiples.propTypes = {
  width: number,
  height: number,
  margin: shape({
    top: number,
    bottom: number,
    left: number,
    right: number,
  }),
  perRow: number,
  selection: number,
  area: number,
  sortByValue: bool,
  data: shape({
    municipalities: array,
    years: array,
  }),
  isMobile: bool,
  handleClear: func,
};

const getHoverData = createSelector([getHoverArea], (hoverArea) => ({
  area: hoverArea,
}));

const mapStateToProps = (state) => getHoverData(state);

const propsToState = (dispatcher) => ({
  handleClear: () => dispatcher({ type: HOVER_CLEAR }),
});

export default connect(mapStateToProps, propsToState)(SmallMultiples);
