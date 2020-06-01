import React, { useMemo, useCallback, useRef } from "react";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { AreaClosed, Line, Bar } from "@vx/shape";
import { curveStepAfter } from "@vx/curve";
import { scaleTime, scaleLinear } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Group } from "@vx/group";
import { Tooltip } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { extent, max, bisector } from "d3-array";
import { useTranslation } from "react-i18next";
import { xTicks, yTicks } from "../utils";
import { COLORS } from "../utils/constants";
import { HOVER_YEAR, HOVER_AREA, HOVER_CLEAR } from "../stores";
import { getHoverOffset, getHoverYear } from "../stores/selectors";

const bisectDate = bisector((d) => new Date(d.date)).left;
const TOOLTIP_OFFSET = 18;

function AreaChart({
  area,
  width,
  height,
  margin,
  year,
  offset,
  years,
  data,
  label,
  name,
  handleAreaHover,
  handleClear,
  handleYearHover,
  isMobile,
  showReset,
  maxYAxis,
}) {
  const [t] = useTranslation();
  const svgEl = useRef(null);

  const values = data.map((value, i) => {
    return { date: years[i], value: value };
  });

  // bounds
  const { xMax, yMax } = useMemo(
    () => ({
      xMax: width - margin.left - margin.right,
      yMax: height - margin.top - margin.bottom,
    }),
    [width, margin.left, margin.right, margin.top, margin.bottom, height]
  );

  // scales
  const { xScale, yScale } = useMemo(() => {
    const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(values, xTicks),
      nice: true,
    });
    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: [0, (maxYAxis || max(values, yTicks)) * 1.1],
      nice: true,
    });
    return { xScale, yScale };
  }, [maxYAxis, values, xMax, yMax]);

  // define a couple of handlers

  const showTooltip = useCallback(
    (event) => {
      const { x } = localPoint(svgEl.current, event);
      const x0 = xScale.invert(x - margin.left);
      const index = bisectDate(values, x0, 1);
      if (index >= values.length) {
        return;
      }
      const d0 = values[index - 1];
      const d1 = values[index];
      let d = d0;
      if (d1 && d1.date) {
        d = x0 - xTicks(d0.date) > xTicks(d1.date) - x0 ? d1 : d0;
      }

      handleYearHover({
        value: d.date,
        offset: (x - margin.left) / (width - margin.left),
      });

      handleAreaHover(area);
    },
    [xScale, margin.left, values, handleYearHover, width, handleAreaHover, area]
  );

  let tooltipData = year ? values.filter((d) => d.date === year)[0] : null;
  let tooltipLeft = null;
  let tooltipTop = null;

  if (tooltipData != null) {
    tooltipLeft = margin.left + offset * (width - margin.left);
    tooltipTop = yScale(tooltipData.value);
  }

  return (
    <div style={{ position: "relative" }}>
      {showReset && (
        <button
          className="button"
          onClick={(e) => {
            e.preventDefault();
            handleClear();
          }}
        >
          Reset
        </button>
      )}
      <svg ref={svgEl} width={width + margin.left} height={height}>
        <Group top={margin.top} left={margin.left}>
          <mask id={`${name}-mask`}>
            <AreaClosed
              data={values}
              yScale={yScale}
              x={(d) => xScale(xTicks(d))}
              y={(d) => yScale(yTicks(d))}
              strokeWidth={2}
              stroke="#fff"
              fill="#fff"
              curve={curveStepAfter}
            />
          </mask>
          <Bar
            x={0}
            y={0}
            width={width - margin.left}
            height={height - 30}
            fill={`url(#gradient)`}
            rx={0}
            data={values}
            mask={`url(#${name}-mask)`}
            onMouseLeave={handleClear}
            onMouseMove={showTooltip}
            {...(isMobile ? { onClick: showTooltip } : {})}
          />
          <AreaClosed
            data={values}
            yScale={yScale}
            x={(d) => xScale(xTicks(d))}
            y={(d) => yScale(yTicks(d))}
            strokeWidth={2}
            stroke="#1b1a1e"
            fill="transparent"
            curve={curveStepAfter}
            className="no-mouse-events"
          />
          {tooltipData && (
            <Group>
              <Line
                from={{
                  x: tooltipLeft - margin.left,
                  y: 0,
                }}
                to={{
                  x: tooltipLeft - margin.left,
                  y: yMax + TOOLTIP_OFFSET,
                }}
                stroke={COLORS.blue}
                strokeWidth={2}
                className="no-mouse-events"
                strokeDasharray="2,2"
              />
              <circle
                cx={tooltipLeft - margin.left}
                cy={tooltipTop}
                r={5}
                fill={COLORS.blue}
                stroke="white"
                strokeWidth={2}
                className="no-mouse-events"
              />
              <circle
                cx={tooltipLeft - margin.left}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                className="no-mouse-events"
              />
            </Group>
          )}
        </Group>
        <AxisLeft
          scale={yScale}
          top={margin.top}
          left={margin.left}
          label={label ? t("charts:Abusi totali") : ""}
          numTicks={5}
          stroke={"#1b1a1e"}
          tickTextFill={"#1b1a1e"}
        />
        <AxisBottom
          scale={xScale}
          top={height - margin.bottom}
          left={margin.left}
          numTicks={Math.ceil(years.length / 4)}
          label={t("charts:Anno")}
          stroke={"#1b1a1e"}
          tickTextFill={"#1b1a1e"}
        />
      </svg>
      {tooltipData && (
        <div>
          <Tooltip
            top={tooltipTop - 12}
            left={tooltipLeft}
            style={{}}
            className="blue-tooltip"
          >
            {`${yTicks(tooltipData)}`}
          </Tooltip>
          <Tooltip
            top={-TOOLTIP_OFFSET}
            left={tooltipLeft}
            style={{
              position: "absolute",
              transform: "translateX(-50%)",
            }}
          >
            {xTicks(tooltipData).getFullYear()}
          </Tooltip>
        </div>
      )}
    </div>
  );
}

AreaChart.defaultProps = {
  label: false,
};

const getHoverData = createSelector(
  [getHoverYear, getHoverOffset],
  (year, offset) => ({ year, offset })
);

const mapStateToProps = (state) => getHoverData(state);

const propsToState = (dispatcher) => ({
  handleYearHover: ({ value, offset }) =>
    dispatcher({ type: HOVER_YEAR, value, offset }),
  handleClear: () => dispatcher({ type: HOVER_CLEAR }),
  handleAreaHover: (area) => dispatcher({ type: HOVER_AREA, area }),
});

export default connect(mapStateToProps, propsToState)(AreaChart);
