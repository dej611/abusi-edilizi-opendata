import React, { Fragment, useState, useMemo, useCallback, useRef } from "react";
import { arrayOf, bool, func, number, shape, string } from "prop-types";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { curveStepAfter } from "@vx/curve";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Group } from "@vx/group";
import { AreaStack, Line } from "@vx/shape";
import { Tooltip } from "@vx/tooltip";
import { scaleTime, scaleLinear, scaleOrdinal } from "@vx/scale";
import { extent, max } from "d3-array";
import { localPoint } from "@vx/event";
import { LegendOrdinal } from "@vx/legend";
import { stack as d3stack } from "d3-shape";
import { schemeCategory10 } from "d3-scale-chromatic";
import { useTranslation } from "react-i18next";

import { xTicks, getIndexOf } from "../utils";
import { COLORS, TOOLTIP_OFFSET } from "../utils/constants";
import { HOVER_YEAR, HOVER_CLEAR } from "../stores";
import { getHoverYear, getHoverOffset } from "../stores/selectors";

function TooltipContent({ label, i, itemData, fullData, year, isPercentage }) {
  const [t] = useTranslation();
  return (
    <tr>
      <td>
        <strong style={{ color: schemeCategory10[i] }}>
          {t(`charts:${label}`)}
        </strong>
      </td>
      <td>
        {isPercentage
          ? `${itemData[label]}% (${fullData[year][label]})`
          : `${fullData[year][label]} (${itemData[label]}%)`}
      </td>
    </tr>
  );
}

function StackedChart({
  width,
  height,
  margin,
  year,
  offset,
  years,
  data,
  handleClear,
  handleYearHover,
  isMobile,
}) {
  const [t] = useTranslation();
  // start with basic stuff
  const x = xTicks;

  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  // define a reference to use later
  const svgEl = useRef(null);

  // Define the component state:
  const [isPercentage, togglePercentage] = useState(true);

  // And now go with the memoization festival:
  const keys = useMemo(
    () =>
      !data.length ? [] : Object.keys(data[0]).filter((k) => k !== "date"),
    [data]
  );

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(data, x),
      }),
    [data, x, xMax]
  );

  const zScale = useMemo(
    () =>
      scaleOrdinal({
        domain: keys.map((label) => t(`charts:${label}`)),
        range: schemeCategory10,
      }),
    [keys, t]
  );

  const totals = useMemo(
    () =>
      data.reduce((memo, year) => {
        const localTotal = keys.reduce(
          (sum, key) => sum + Number(year[key]),
          0
        );
        memo.push(localTotal);
        return memo;
      }, []),
    [data, keys]
  );

  const percData = useMemo(
    () =>
      data.map((d, i) => {
        const percYear = keys.reduce(
          (memo, key) => {
            memo[key] = ((100 * d[key]) / totals[i]).toFixed(2);
            return memo;
          },
          { date: d.date }
        );
        return percYear;
      }),
    [data, keys, totals]
  );

  let tooltipData = year ? percData.filter((d) => d.date === year)[0] : null;
  let tooltipLeft = null;
  let tooltipTop = null;

  const tooltipDataIndex =
    tooltipData && getIndexOf(percData, (d) => d.date === year);

  const series = useMemo(
    () => d3stack().keys(keys)(isPercentage ? percData : data),
    [keys, isPercentage, percData, data]
  );

  const yScale = useMemo(() => {
    if (isPercentage) {
      return scaleLinear({
        range: [yMax, 0],
      });
    }
    return scaleLinear({
      domain: [0, max(series, (d) => max(d, (d) => d[1]))],
      range: [yMax, 0],
    });
  }, [isPercentage, series, yMax]);

  // Time to register a callback
  const showTooltip = useCallback(
    (event) => {
      const { x } = localPoint(svgEl.current, event);
      const x0 = xScale.invert(x - margin.left);
      handleYearHover({
        value: `${x0.getFullYear()}`,
        offset: (x - margin.left) / (width - margin.left - margin.right),
      });
    },
    [handleYearHover, margin, width, xScale]
  );

  // Now do the conditional stuff and render
  if (tooltipData != null) {
    tooltipLeft = offset * (width - margin.left - margin.right);
    tooltipTop = series.map((d) => d[tooltipDataIndex]);
  }
  // have a constant factor to put in formulas to compute
  const chartFactor = isPercentage ? 100 : 1;

  // And now go with the render
  return (
    <div style={{ position: "relative" }}>
      <div>
        {[
          { label: t("charts:show-trends"), perc: false },
          { label: t("charts:show-perc"), perc: true },
        ].map(({ label, perc }) => (
          <button
            className={`button is-text-centered ${
              isPercentage === perc ? "" : "is-text"
            }`}
            onClick={(e) => {
              e.preventDefault();
              togglePercentage(!isPercentage);
            }}
            key={label}
          >
            {label}
          </button>
        ))}
      </div>
      <svg ref={svgEl} width={width + margin.left} height={height + 15}>
        <Group top={margin.top} left={margin.left}>
          <AreaStack
            top={margin.top}
            left={margin.left}
            keys={keys}
            data={isPercentage ? percData : data}
            x={(d) => xScale(x(d.data))}
            y0={(d) => yScale(d[0] / chartFactor)}
            y1={(d) => yScale(d[1] / chartFactor)}
            strokeWidth={0}
            color={(label) => zScale(t(`charts:${label}`))}
            fillOpacity="1"
            curve={curveStepAfter}
            onMouseLeave={handleClear}
            onMouseMove={showTooltip}
            onClick={isMobile ? showTooltip : () => {}}
          />
          {tooltipData && (
            <Group>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{
                  x: tooltipLeft,
                  y: yMax + TOOLTIP_OFFSET,
                }}
                stroke={"white"}
                strokeWidth={2}
                className="no-mouse-events"
                strokeDasharray="2,2"
              />
              {tooltipTop.map((d, i) => (
                <Fragment key={`tooltip-${i}`}>
                  <circle
                    cx={tooltipLeft}
                    cy={yScale(d[1] / chartFactor)}
                    r={5}
                    stroke={COLORS.white}
                    fill="white"
                    strokeOpacity={0.1}
                    strokeWidth={2}
                    className="no-mouse-events"
                  />
                  <circle
                    cx={tooltipLeft}
                    cy={yScale(d[1] / chartFactor)}
                    r={4}
                    stroke={COLORS.blue}
                    fill={schemeCategory10[i]}
                    strokeOpacity={0.1}
                    strokeWidth={2}
                    className="no-mouse-events"
                  />
                </Fragment>
              ))}
            </Group>
          )}
        </Group>
        <AxisLeft
          scale={yScale}
          top={margin.top}
          left={margin.left}
          label={t("charts:y-axis-per-type", {
            postfix: isPercentage ? "%" : "",
          })}
          numTicks={5}
          tickFormat={(value) =>
            `${value * chartFactor}${isPercentage ? "%" : ""}`
          }
          stroke={"#1b1a1e"}
          tickTextFill={"#1b1a1e"}
        />
        <AxisBottom
          scale={xScale}
          top={height - margin.bottom}
          left={margin.left}
          numTicks={isMobile ? years.length / 2 : years.length - 1}
          label={t("charts:Anno")}
          stroke={"#1b1a1e"}
          tickTextFill={"#1b1a1e"}
        />
      </svg>
      {tooltipData && (
        <div>
          <Tooltip
            top={3 * TOOLTIP_OFFSET}
            left={tooltipLeft + margin.left / 2}
            style={{
              transform: `translateX(${tooltipLeft > 150 ? "-50%" : "66%"})`,
            }}
            className="content multiple-tooltip"
          >
            <table>
              {isMobile && (
                <thead>
                  <tr>
                    <th span={2}>Anno {year}</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {keys
                  .slice(0)
                  .reverse()
                  .map((k, i) => (
                    <TooltipContent
                      key={k}
                      isPercentage={isPercentage}
                      label={k}
                      i={i}
                      t={t}
                      itemData={tooltipData}
                      fullData={data}
                      year={tooltipDataIndex}
                    />
                  ))}
              </tbody>
            </table>
          </Tooltip>
        </div>
      )}
      <div className="legend-container">
        <LegendOrdinal
          scale={zScale}
          direction={isMobile ? "column" : "row"}
          labelMargin="0 15px 0 0"
        />
      </div>
      <button
        className="button is-pulled-right is-text is-hidden-tablet"
        onClick={(e) => {
          e.preventDefault();
          handleClear();
        }}
      >
        Reset
      </button>
    </div>
  );
}

StackedChart.propTypes = {
  width: number,
  height: number,
  margin: shape({
    top: number,
    bottom: number,
    left: number,
    right: number,
  }),
  year: string,
  offset: number,
  years: arrayOf(string),
  data: arrayOf(shape({ date: string })),
  handleYearHover: func,
  handleClear: func,
  maxYAxis: number,
  isMobile: bool,
};

const getHoverData = createSelector(
  [getHoverYear, getHoverOffset],
  (year, offset) => ({
    year,
    offset,
  })
);

const mapStateToProps = (state) => getHoverData(state);

const propsToState = (dispatcher) => ({
  handleYearHover: ({ value, offset }) =>
    dispatcher({ type: HOVER_YEAR, value, offset }),
  handleClear: () => dispatcher({ type: HOVER_CLEAR }),
});

export default connect(mapStateToProps, propsToState)(StackedChart);
