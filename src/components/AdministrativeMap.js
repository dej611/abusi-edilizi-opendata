import React, {PureComponent} from 'react';
import {arrayOf, bool, number, string, shape, func} from 'prop-types';
import {connect} from 'react-redux';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Annotation,
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

  renderAnnotations = selection => {
    // maybe later unproject the coords and workout a better placement
    // const leftMostX = 12.234058;
    // const rightMostX = 12.85589;
    const annotations = [
      {dx: 135, dy: -180, subject: [12.473005178466167, 41.90115330493791]},
      {dx: 119, dy: -130, subject: [12.499990873982766, 41.92051616121312]},
      {dx: 85, dy: -30, subject: [12.554261766118378, 41.996317824291]},
      {dx: 63, dy: -40, subject: [12.591203872621438, 41.93212355183638]},
      {dx: 73, dy: -50, subject: [12.575586136402606, 41.88914450437655]},
      {dx: 5, dy: 65, subject: [12.686761243799408, 41.887622865348646]},
      {dx: 70, dy: 65, subject: [12.581620751831876, 41.83914549841999]},
      {dx: 100, dy: 80, subject: [12.529373555163973, 41.82840578631889]},
      {dx: 120, dy: 50, subject: [12.497741441818528, 41.75766867967468]},
      {dx: -45, dy: 50, subject: [12.362671159332718, 41.740181639353786]},
      {dx: -55, dy: 30, subject: [12.376787332511073, 41.83067722960807]},
      {dx: -35, dy: 40, subject: [12.344669450471354, 41.87101721743076]},
      {dx: -38, dy: -25, subject: [12.346248945216098, 41.91038959760859]},
      {dx: -38, dy: -80, subject: [12.345506028289778, 41.975578989467394]},
      {dx: 5, dy: -80, subject: [12.415672802092525, 42.02962255809816]},
    ];

    if (!selection) {
      return null;
    }

    const {dx, dy, subject} = annotations[selection - 1];

    return (
      <Annotation
        dx={dx}
        dy={dy}
        subject={subject}
        strokeWidth={1}
        stroke="#607D8B"
      >
        <text>
          {this.props.t('charts:Municipio')} {selection}
        </text>
      </Annotation>
    );
  };
  render() {
    const {year, data, fixed, isMobile, t, highlight} = this.props;

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

    const label = year
      ? `${t('charts:Anno')} ${year}`
      : `${t('charts:Anni')} 2000 - 2010`;
    // With this trick the highlighted shape will show the full border
    const sortByHighlight = (a, b) => {
      if (highlight === a.properties.id) {
        return 1;
      }
      if (highlight === b.properties.id) {
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
          <ZoomableGroup center={[12.483463, 41.897976]} disablePanning>
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
                              highlight === currentId
                                ? COLORS.blue
                                : COLORS.black,
                            strokeWidth: highlight === currentId ? 2.75 : 0.75,
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
            {this.renderAnnotations(highlight)}
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
