import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {array, bool, func, number, shape} from 'prop-types';
import {max} from 'd3-array';
import {withTranslation} from 'react-i18next';

import LineChart from './LineChart';
import {getClassByNumber} from '../utils';
import {HOVER_CLEAR} from '../stores';

class SmallMultiples extends PureComponent {
  static propTypes = {
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
  renderSelectionStyle(municipality) {
    const hasOpacity =
      this.props.area == null || this.props.area === municipality.id + 1;
    return {opacity: hasOpacity ? 1 : 0.4};
  }
  renderTitle(municipality) {
    const title = `${this.props.t('charts:Municipio')} ${municipality.id + 1}`;
    return this.props.area - 1 === municipality.id ? (
      <h4 className="subtitle">{title}</h4>
    ) : (
      <h5 className="subtitle">{title}</h5>
    );
  }
  render() {
    const {
      data,
      width,
      height,
      margin,
      perRow,
      sortByValue,
      isMobile,
      handleClear,
    } = this.props;
    // workout the max from the dataset
    const maxYAxis = max(data.municipalities, municipality =>
      max(municipality)
    );

    // assign a temporary id based on index
    // then workout the max aggregated
    const dataset = data.municipalities
      .slice(0)
      .map((entry, i) => ({id: i, value: entry}));

    if (sortByValue) {
      const totals = data.municipalities.map(municipality =>
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
            onClick={e => {
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
              style={this.renderSelectionStyle(municipality)}
            >
              {this.renderTitle(municipality)}
              <LineChart
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
}

const mapStateToProps = ({navigation}) => ({
  area: navigation.hover_area,
});

const propsToState = dispatcher => ({
  handleClear: () => dispatcher({type: HOVER_CLEAR}),
});

export default withTranslation()(
  connect(
    mapStateToProps,
    propsToState
  )(SmallMultiples)
);
