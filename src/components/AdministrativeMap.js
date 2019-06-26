import React, {PureComponent} from 'react';
import {arrayOf, bool, number, string, shape, func} from 'prop-types';
import {connect} from 'react-redux';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import {scaleLinear} from '@vx/scale';
import {scaleLinear as scaleLinearFn} from 'd3-scale';
import {withTranslation} from 'react-i18next';

import Legend from './AdministrativeMapLegend';
import {COLORS} from '../utils/constants';
import {HOVER_AREA} from '../stores';

const topojsonURL = process.env.PUBLIC_URL + '/roma.json';

const wrapperStyles = {
  maxWidth: 600,
};
// Pure version: no side effect on the callee's array
const getMedian = array => {
  const copy = array.slice(0);
  copy.sort((a, b) => a - b);
  const low = Math.floor((copy.length - 1) / 2);
  const high = Math.ceil((copy.length - 1) / 2);
  return (copy[low] + copy[high]) / 2;
};

class AdministrativeMap extends PureComponent {
  static propTypes = {
    year: string,
    data: shape({
      municipalities: arrayOf(arrayOf(number)),
      years: arrayOf(string),
    }),
    highlight: number,
    handleAreaHover: func,
    fixed: bool,
    isMobile: bool,
    t: func,
  };
  handleHover = i => () => {
    // there's no guarantee of order as the update is async
    // Reset the state and then wait before update again
    this.props.handleAreaHover(null);
    if (i != null) {
      setTimeout(() => this.props.handleAreaHover(i), 150);
    }
  };
  render() {
    const {year, data, fixed, isMobile, t} = this.props;

    const totals = data.municipalities.map(municipality =>
      municipality
        .filter((_, index) => year == null || +data.years[index] === +year)
        .reduce((partial, value) => partial + value, 0)
    );
    const max = Math.max.apply(null, totals);

    const median = getMedian(totals);

    const fillScale = scaleLinearFn()
      .domain([0, median, max])
      .range(['#eee', '#feb24c', '#f03b20']);

    const scale = scaleLinear({
      domain: [0, median, max],
      range: ['#eee', '#feb24c', '#f03b20'],
    });

    const colors = totals.map(t => fillScale(t));

    const label = year ? `${t('charts:Anno')} ${year}` : `${t('charts:Anni')} 2000 - 2010`;
    // With this trick the highlighted shape will show the full border
    const sortByHighlight = (a, b) => {
      if (this.props.highlight === a.properties.id) {
        return 1;
      }
      if (this.props.highlight === b.properties.id) {
        return -1;
      }
      return a.properties.id - b.properties.id;
    };

    return (
      <div className={`${fixed ? '' : 'chart-wrapper-sticky'}`}>
        <ComposableMap
          projection="mercator"
          projectionConfig={{scale: 35000}}
          width={(3 / 4) * wrapperStyles.maxWidth}
          height={400}
          className="map-full-size"
        >
          <ZoomableGroup center={[12.483463, 41.897976]} disablePanning={true}>
            <Geographies geography={topojsonURL} disableOptimization>
              {(geographies, projection) =>
                geographies
                  .slice()
                  .sort(sortByHighlight)
                  .map(geography => {
                    const currentId = geography.properties.id;
                    const color = colors[currentId - 1];
                    const hoverOrSelectedStyle = {
                      fill: color,
                      stroke: '#607D8B',
                      strokeWidth: 2.75,
                      outline: 'none',
                      zIndex: 9999,
                    };
                    return (
                      <Geography
                        key={geography.properties.nome}
                        geography={geography}
                        projection={projection}
                        onMouseEnter={this.handleHover(currentId)}
                        onMouseLeave={this.handleHover(null)}
                        style={{
                          default: {
                            fill: color,
                            stroke:
                              this.props.highlight === currentId
                                ? COLORS.blue
                                : COLORS.black,
                            strokeWidth:
                              this.props.highlight === currentId ? 2.75 : 0.75,
                            outline: 'none',
                          },
                          hover: hoverOrSelectedStyle,
                          pressed: hoverOrSelectedStyle,
                        }}
                      />
                    );
                  })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <Legend source={label} scale={scale} />
        {isMobile && (
          <button
            className="button is-text is-pulled-right"
            onClick={e => {
              e.preventDefault();
              this.handleHover(null)();
            }}
          >
            Reset
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({navigation}) => {
  return {
    // Selection has priority over hover for temporal data
    year: navigation.select_year || navigation.hover_year,
    // Hover -> highlight area
    highlight: navigation.hover_area,
    // Selection -> filter area
    filtered: navigation.select_area,
  };
};

const propsToState = dispatcher => ({
  handleAreaHover: area => dispatcher({type: HOVER_AREA, area}),
});

export default withTranslation()(
  connect(
    mapStateToProps,
    propsToState
  )(AdministrativeMap)
);
