import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AreaClosed, Line, Bar} from '@vx/shape';
import {curveStepAfter} from '@vx/curve';
import {scaleTime, scaleLinear} from '@vx/scale';
import {AxisLeft, AxisBottom} from '@vx/axis';
import {Group} from '@vx/group';
import {Tooltip} from '@vx/tooltip';
import {localPoint} from '@vx/event';
import {extent, max, bisector} from 'd3-array';
import { withTranslation } from 'react-i18next';
import {xTicks, yTicks} from '../utils';
import {COLORS} from '../utils/constants';
import {HOVER_YEAR, HOVER_AREA, HOVER_CLEAR} from '../stores';

const bisectDate = bisector(d => new Date(d.date)).left;

class Area extends Component {
  static defaultProps = {
    label: false,
  };

  static TOOLTIP_OFFSET = 18;

  propagateTooltip = ({data, x, x0, index}, yScale) => {
    if (index >= data.length) {
      return;
    }
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    if (d1 && d1.date) {
      d = x0 - xTicks(d0.date) > xTicks(d1.date) - x0 ? d1 : d0;
    }

    this.props.handleYearHover({
      value: d.date,
      offset:
        x /
        (this.props.width - this.props.margin.left - this.props.margin.right),
    });

    this.props.handleAreaHover(this.props.area);
  };

  showTooltip = ({xScale, yScale}) => data => event => {
    const {x} = localPoint(this.svg, event);
    const x0 = xScale.invert(x - this.props.margin.left);
    const index = bisectDate(data, x0, 1);
    this.propagateTooltip(
      {data, x: x - this.props.margin.left, x0, index},
      yScale
    );
  };

  computeMaxXY() {
    return {
      xMax: this.props.width - this.props.margin.left - this.props.margin.right,
      yMax:
        this.props.height - this.props.margin.top - this.props.margin.bottom,
    };
  }

  computeScales(values, {xMax, yMax}) {
    const maxYAxis = this.props.maxYAxis;
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
    return {xScale, yScale};
  }

  render() {
    const {
      width,
      height,
      margin,
      year,
      offset,
      years,
      data,
      label,
      name,
      handleClear,
      isMobile,
      showReset,
      t
    } = this.props;

    const values = data.map((value, i) => {
      return {date: years[i], value: value};
    });

    // bounds
    const {xMax, yMax} = this.computeMaxXY();

    // scales
    const {xScale, yScale} = this.computeScales(values, {xMax, yMax});

    let tooltipData = year ? values.filter(d => d.date === year)[0] : null;
    let tooltipLeft = null;
    let tooltipTop = null;

    if (tooltipData != null) {
      tooltipLeft = offset * (width - margin.left - margin.right);
      tooltipTop = yScale(tooltipData.value);
    }

    return (
      <div style={{position: 'relative'}}>
        {showReset && (
          <button
            className="button"
            onClick={e => {
              e.preventDefault();
              handleClear();
            }}
          >
            Reset
          </button>
        )}
        <svg
          ref={s => (this.svg = s)}
          width={width + margin.left}
          height={height}
        >
          <Group top={margin.top} left={margin.left}>
            <mask id={`${name}-mask`}>
              <AreaClosed
                data={values}
                xScale={xScale}
                yScale={yScale}
                x={xTicks}
                y={yTicks}
                strokeWidth={2}
                stroke="#fff"
                fill="#fff"
                curve={curveStepAfter}
              />
            </mask>
            <Bar
              x={0}
              y={0}
              width={width}
              height={height - 30}
              fill={`url(#gradient)`}
              rx={0}
              data={values}
              mask={`url(#${name}-mask)`}
              onMouseLeave={() => handleClear}
              onMouseMove={this.showTooltip({xScale, yScale})}
              onClick={isMobile ? this.showTooltip({xScale, yScale}) : () => {}}
            />
            <AreaClosed
              data={values}
              xScale={xScale}
              yScale={yScale}
              x={xTicks}
              y={yTicks}
              strokeWidth={2}
              stroke={'#1b1a1e'}
              fill="transparent"
              curve={curveStepAfter}
              className="no-mouse-events"
            />
            {tooltipData && (
              <Group>
                <Line
                  from={{
                    x: tooltipLeft,
                    y: 0,
                  }}
                  to={{
                    x: tooltipLeft,
                    y: yMax + Area.TOOLTIP_OFFSET,
                  }}
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  className="no-mouse-events"
                  strokeDasharray="2,2"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop}
                  r={5}
                  fill={COLORS.blue}
                  stroke="white"
                  strokeWidth={2}
                  className="no-mouse-events"
                />
                <circle
                  cx={tooltipLeft}
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
            label={label ? t('charts:Abusi totali') : ''}
            numTicks={5}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
          />
          <AxisBottom
            scale={xScale}
            top={height - margin.bottom}
            left={margin.left}
            numTicks={Math.ceil(years.length / 4)}
            label={'Anno'}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
          />
        </svg>
        {tooltipData && (
          <div>
            <Tooltip
              top={tooltipTop - 12}
              left={tooltipLeft + margin.left}
              style={{
                backgroundColor: COLORS.blue,
                color: 'white',
                transform: 'translateX(10%)',
              }}
            >
              {`${yTicks(tooltipData)}`}
            </Tooltip>
            <Tooltip
              top={-Area.TOOLTIP_OFFSET}
              left={tooltipLeft + margin.left}
              style={{
                transform: 'translateX(-50%)',
              }}
            >
              {xTicks(tooltipData).getFullYear()}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({navigation}) => ({
  year: navigation.hover_year,
  offset: navigation.hover_offset,
});

const propsToState = dispatcher => ({
  handleYearHover: ({value, offset}) =>
    dispatcher({type: HOVER_YEAR, value, offset}),
  handleClear: () => dispatcher({type: HOVER_CLEAR}),
  handleAreaHover: area => dispatcher({type: HOVER_AREA, area}),
});

export default withTranslation()(connect(
  mapStateToProps,
  propsToState
)(Area));
