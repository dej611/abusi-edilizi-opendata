import React, {Component, Fragment} from 'react';
import {arrayOf, bool, func, number, shape, string} from 'prop-types';
import {connect} from 'react-redux';
import {curveStepAfter} from '@vx/curve';
import {AxisLeft, AxisBottom} from '@vx/axis';
import {Group} from '@vx/group';
import {AreaStack, Line} from '@vx/shape';
import {Tooltip} from '@vx/tooltip';
import {scaleTime, scaleLinear, scaleOrdinal} from '@vx/scale';
import {extent, max} from 'd3-array';
import {localPoint} from '@vx/event';
import {LegendOrdinal} from '@vx/legend';
import {stack as d3stack} from 'd3-shape';
import {schemeCategory10} from 'd3-scale-chromatic';
import {withTranslation} from 'react-i18next';

import {xTicks, getIndexOf} from '../utils';
import {COLORS, TOOLTIP_OFFSET} from '../utils/constants';
import {HOVER_YEAR, HOVER_CLEAR} from '../stores';

class StackedChart extends Component {
  static propTypes = {
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
    data: arrayOf(shape({date: string})),
    handleYearHover: func,
    handleClear: func,
    maxYAxis: number,
    isMobile: bool,
  };

  state = {
    percentage: true,
  };

  togglePercentage = () =>
    this.setState(({percentage}) => ({percentage: !percentage}));

  renderTooltipContent = (k, i, dateIndex, data) => {
    return (
      <tr key={k}>
        <td>
          <strong style={{color: schemeCategory10[i]}}>
            {this.props.t(`charts:${k}`)}
          </strong>
        </td>
        <td>
          {this.state.percentage
            ? `${data[k]}% (${this.props.data[dateIndex][k]})`
            : `${this.props.data[dateIndex][k]} (${data[k]}%)`}
        </td>
      </tr>
    );
  };

  showTooltip = ({xScale}) => () => event => {
    const {margin, handleYearHover, width} = this.props;
    const {x} = localPoint(this.svg, event);
    const x0 = xScale.invert(x - margin.left);
    handleYearHover({
      value: `${x0.getFullYear()}`,
      offset: (x - margin.left) / (width - margin.left - margin.right),
    });
  };

  computeYScale = (series, yMax) => {
    if (this.state.percentage) {
      return scaleLinear({
        range: [yMax, 0],
      });
    }
    return scaleLinear({
      domain: [0, max(series, d => max(d, d => d[1]))],
      range: [yMax, 0],
    });
  };

  render() {
    const {
      width,
      height,
      margin,
      year,
      offset,
      years,
      data,
      handleClear,
      isMobile,
      t,
    } = this.props;
    const keys = Object.keys(data[0]).filter(k => k !== 'date');
    const x = xTicks;

    const yMax = height - margin.top - margin.bottom;
    const xMax = width - margin.left - margin.right;

    const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(data, x),
    });

    const zScale = scaleOrdinal({
      domain: keys.map(label => t(`charts:${label}`)),
      range: schemeCategory10,
    });

    const totals = data.reduce((memo, year) => {
      const localTotal = keys.reduce((sum, key) => sum + Number(year[key]), 0);
      memo.push(localTotal);
      return memo;
    }, []);

    const percData = data.map((d, i) => {
      const percYear = keys.reduce(
        (memo, key) => {
          memo[key] = ((100 * d[key]) / totals[i]).toFixed(2);
          return memo;
        },
        {date: d.date}
      );
      return percYear;
    });
    const stack = d3stack().keys(keys);
    const series = stack(this.state.percentage ? percData : data);

    const yScale = this.computeYScale(series, yMax);

    let tooltipData = year ? percData.filter(d => d.date === year)[0] : null;
    let tooltipLeft = null;
    let tooltipTop = null;

    const tooltipDataIndex =
      tooltipData && getIndexOf(percData, d => d.date === year);

    if (tooltipData != null) {
      tooltipLeft = offset * (width - margin.left - margin.right);
      tooltipTop = series.map(d => d[tooltipDataIndex]);
    }
    // have a constant factor to put in formulas to compute
    const chartFactor = this.state.percentage ? 100 : 1;

    return (
      <div style={{position: 'relative'}}>
        <div>
          <button
            className="button is-text-centered"
            onClick={e => {
              e.preventDefault();
              this.togglePercentage();
            }}
          >
            {this.state.percentage
              ? t('charts:show-trends')
              : t('charts:show-perc')}
          </button>
        </div>
        <svg
          ref={s => (this.svg = s)}
          width={width + margin.left}
          height={height + 15}
        >
          <Group top={margin.top} left={margin.left}>
            <AreaStack
              top={margin.top}
              left={margin.left}
              keys={keys}
              data={this.state.percentage ? percData : data}
              x={d => xScale(x(d.data))}
              y0={d => yScale(d[0] / chartFactor)}
              y1={d => yScale(d[1] / chartFactor)}
              strokeWidth={0}
              fill={d => schemeCategory10[d.index]}
              fillOpacity="1"
              curve={curveStepAfter}
              onMouseLeave={() => handleClear}
              onMouseMove={this.showTooltip({xScale})}
              onClick={isMobile ? this.showTooltip({xScale}) : () => {}}
            />
            {tooltipData && (
              <Group>
                <Line
                  from={{x: tooltipLeft, y: 0}}
                  to={{
                    x: tooltipLeft,
                    y: yMax + TOOLTIP_OFFSET,
                  }}
                  stroke={'white'}
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
            label={t('charts:y-axis-per-type', {
              postfix: this.state.percentage ? '%' : '',
            })}
            numTicks={5}
            tickFormat={value =>
              `${value * chartFactor}${this.state.percentage ? '%' : ''}`
            }
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
          />
          <AxisBottom
            scale={xScale}
            top={height - margin.bottom}
            left={margin.left}
            numTicks={isMobile ? years.length / 2 : years.length - 1}
            label={t('charts:Anno')}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
          />
        </svg>
        {tooltipData && (
          <div>
            <Tooltip
              top={-TOOLTIP_OFFSET}
              left={tooltipLeft + margin.left / 2}
              style={{
                backgroundColor: 'white',
                color: COLORS.blue,
                transform: 'translateX(-50%)',
              }}
              className="content"
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
                    .map((k, i) =>
                      this.renderTooltipContent(
                        k,
                        keys.length - i - 1,
                        tooltipDataIndex,
                        tooltipData
                      )
                    )}
                </tbody>
              </table>
            </Tooltip>
          </div>
        )}
        <div className="legend-container">
          <LegendOrdinal
            scale={zScale}
            direction={isMobile ? 'column' : 'row'}
            labelMargin="0 15px 0 0"
          />
        </div>
        <button
          className="button is-pulled-right is-text is-hidden-tablet"
          onClick={e => {
            e.preventDefault();
            handleClear();
          }}
        >
          Reset
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({navigation}) => {
  return {
    year: navigation.hover_year,
    offset: navigation.hover_offset,
  };
};

const propsToState = dispatcher => ({
  handleYearHover: ({value, offset}) =>
    dispatcher({type: HOVER_YEAR, value, offset}),
  handleClear: () => dispatcher({type: HOVER_CLEAR}),
});

export default withTranslation()(
  connect(
    mapStateToProps,
    propsToState
  )(StackedChart)
);
