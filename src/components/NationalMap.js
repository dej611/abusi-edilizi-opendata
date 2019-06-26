import React, {Component} from 'react';
import {arrayOf, bool, func, number, string, shape} from 'prop-types';
import {connect} from 'react-redux';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import {scaleLinear, scaleOrdinal} from '@vx/scale';
import {scaleLinear as scaleLinearFn} from 'd3-scale';
import {withTranslation} from 'react-i18next';

import {COLORS} from '../utils/constants';

import {HOVER_REGION} from '../stores';
import Legend from './NationalMapLegend';

const topojsonComuniURL = process.env.PUBLIC_URL + '/italy_mappa_comuni.json';
const topojsonRegioniURL = process.env.PUBLIC_URL + '/italy_mappa_regioni.json';
const prerenderedComuniURL =
  process.env.PUBLIC_URL + '/mappa_italia_comuni.png';
const prerenderedRegioniURL =
  process.env.PUBLIC_URL + '/mappa_italia_regioni.png';

const wrapperStyles = {
  maxWidth: 600,
};

class NationalMap extends Component {
  static propTypes = {
    type: string.isRequired,
    isMobile: bool,
    data: shape({
      items: arrayOf(shape({name: string, value: number})),
      fonte: string,
    }).isRequired,
    selected: string,
    handleAreaHover: func,
    t: func,
  };

  state = {
    loaded: false,
  };

  handleHover = geo => {
    if (this.props.handleAreaHover) {
      this.props.handleAreaHover(this.geoNameExtractor(geo));
    }
  };

  resetHover = () => {
    if (this.props.handleAreaHover) {
      this.props.handleAreaHover(null);
    }
  };

  geoNameExtractor = geo => {
    if (this.props.type === 'regioni') {
      const nameFixes = {
        Apulia: 'Puglia',
        'Emilia-Romagna': 'Emilia Romagna',
        'Friuli-Venezia Giulia': 'Friuli Venezia Giulia',
        Sicily: 'Sicilia',
        'Trentino-Alto Adige': 'Trentino Alto Adige',
      };
      const name = geo.properties.NAME_1;
      return nameFixes[name] || name;
    }
    return geo.properties.nome_com;
  };
  render() {
    const {data, type, isMobile, selected, t} = this.props;

    const isDetailed = type !== 'regioni';

    const geography = !isDetailed ? topojsonRegioniURL : topojsonComuniURL;

    const quickLookup = data.items.reduce((dict, {name, value}) => {
      dict[name.toLowerCase()] = value;
      return dict;
    }, {});

    const max = Math.max.apply(null, data.items.map(({value}) => value));

    const fillGray = isDetailed ? COLORS.gray : COLORS.lighterGray;

    const fillScale = scaleLinearFn()
      .domain([0, max])
      .range([fillGray, COLORS.blue]);

    const regionsScale = scaleLinear({
      domain: [0, max],
      range: [fillGray, COLORS.blue],
    });

    const townsScale = scaleOrdinal({
      domain: [t('charts:Senza dataset'), t('charts:Con dataset')],
      range: [fillGray, COLORS.blue],
    });

    if (isMobile && !window.PRERENDER && !this.state.loaded) {
      return (
        <div className="center-image">
          <img
            src={isDetailed ? prerenderedComuniURL : prerenderedRegioniURL}
            alt="Mappa comuni italiani con dataset su abusi edilizi"
            className={isDetailed ? 'magnify-for-tablet' : ''}
          />
          <Legend
            isDetailed={isDetailed}
            source={data.fonte}
            townsScale={townsScale}
            regionsScale={regionsScale}
          />
        </div>
      );
    }

    const colors = Object.keys(quickLookup).reduce((dict, key) => {
      dict[key.toLowerCase()] = fillScale(quickLookup[key.toLowerCase()]);
      return dict;
    }, {});

    const sortByHighlight = (a, b) => {
      if (this.props.selected == null) {
        return 0;
      }
      const nameA = this.geoNameExtractor(a);
      const nameB = this.geoNameExtractor(b);
      if (this.props.selected === nameA) {
        return 1;
      }
      if (this.props.selected === nameB) {
        return -1;
      }
    };

    return (
      <div
        className={`chart-wrapper-sticky ${
          isDetailed && !this.state.loaded ? 'map-placeholder' : ''
        }`}
      >
        <ComposableMap
          projection="mercator"
          projectionConfig={{scale: 1600}}
          width={(3 / 4) * wrapperStyles.maxWidth}
          height={450}
          className="map-full-size"
          style={
            !this.state.loaded
              ? {
                  backgroundImage: `url(${
                    isDetailed ? prerenderedComuniURL : prerenderedRegioniURL
                  })`,
                  backgroundSize: 'cover',
                }
              : {}
          }
        >
          <ZoomableGroup center={[13.623047, 42.032974]} disablePanning={true}>
            <Geographies
              geography={geography}
              onGeographyPathsLoaded={() => this.setState({loaded: true})}
              disableOptimization={!isDetailed}
            >
              {(geographies, projection) =>
                geographies.sort(sortByHighlight).map((geography, i) => {
                  const name = this.geoNameExtractor(geography);

                  const isSelected = name === selected;

                  const defaultStyle = {
                    fill: colors[name.toLowerCase()] || COLORS.gray,
                    stroke: isSelected ? COLORS.darkerBlue : COLORS.gray,
                    outline: 'none',
                  };

                  const highlightedStyle = {
                    fill: colors[name.toLowerCase()] || COLORS.gray,
                    stroke: COLORS.black,
                    strokeWidth: 0.75,
                    outline: 'none',
                  };

                  const interactiveStyle = {
                    hover: isDetailed ? defaultStyle : highlightedStyle,
                    pressed: isDetailed ? defaultStyle : highlightedStyle,
                  };
                  return (
                    <Geography
                      key={`${name}-${i}`}
                      geography={geography}
                      projection={projection}
                      onMouseMove={this.handleHover}
                      onMouseLeave={this.resetHover}
                      style={{
                        default: defaultStyle,
                        ...interactiveStyle,
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <Legend
          isDetailed={isDetailed}
          source={data.fonte}
          townsScale={townsScale}
          regionsScale={regionsScale}
        />
        {!isDetailed && isMobile && (
          <button
            className="button is-text is-pulled-right"
            onClick={e => {
              e.preventDefault();
              this.resetHover();
            }}
          >
            Reset
          </button>
        )}
      </div>
    );
  }
}

export default withTranslation()(NationalMap);

const mapStateToProps = ({navigation}) => {
  return {
    selected: navigation.hover_region,
  };
};

const propsToState = dispatcher => ({
  handleAreaHover: area => dispatcher({type: HOVER_REGION, area}),
});

export const NationalMapSynced = withTranslation()(
  connect(
    mapStateToProps,
    propsToState
  )(NationalMap)
);
