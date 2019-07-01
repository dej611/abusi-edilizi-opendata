import React, {Component} from 'react';
import {arrayOf, bool, func, number, string, shape} from 'prop-types';
import {connect} from 'react-redux';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Annotation,
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

  renderAnnotations = selection => {
    const annotations = [
      {
        dx: 35,
        dy: -30,
        subject: [13.854964340710609, 42.22772798782797],
        name: 'Abruzzo',
      },
      {
        dx: 30,
        dy: 0,
        subject: [16.634819295224347, 40.98484267847607],
        name: 'Puglia',
      },
      {
        dx: 35,
        dy: 40,
        subject: [16.08348822076077, 40.49974832573962],
        name: 'Basilicata',
      },
      {
        dx: 30,
        dy: 10,
        subject: [16.34597592434666, 39.063710382269036],
        name: 'Calabria',
      },
      {
        dx: -30,
        dy: 30,
        subject: [14.843962732534767, 40.85923655787864],
        name: 'Campania',
      },
      {
        dx: 75,
        dy: 5,
        subject: [11.0254583505438, 44.53840396176408],
        name: 'Emilia Romagna',
      },
      {
        dx: 25,
        dy: 0,
        subject: [13.05964367497422, 46.155533475005875],
        name: 'Friuli Venezia Giulia',
      },
      {
        dx: -15,
        dy: 20,
        subject: [12.771954375005656, 41.9796270955689],
        name: 'Lazio',
      },
      {
        dx: 0.5,
        dy: 25,
        subject: [8.706738359119672, 44.26640616350049],
        name: 'Liguria',
      },
      {
        dx: -1,
        dy: -60,
        subject: [9.771396253192377, 45.621093669102386],
        name: 'Lombardia',
      },
      {
        dx: 15,
        dy: -15,
        subject: [13.111326583737789, 43.36511540888636],
        name: 'Marche',
      },
      {
        dx: 45,
        dy: -20,
        subject: [14.596000395239784, 41.685939696158854],
        name: 'Molise',
      },
      {
        dx: 0,
        dy: 75,
        subject: [7.924046644966038, 45.05765566794298],
        name: 'Piemonte',
      },
      {
        dx: 0,
        dy: 70,
        subject: [9.029547396405448, 40.08283025023734],
        name: 'Sardegna',
      },
      {
        dx: -60,
        dy: 0,
        subject: [14.148921875276224, 37.58867363750838],
        name: 'Sicilia',
      },
      {
        dx: -45,
        dy: 35,
        subject: [11.130966451445309, 43.44922404949415],
        name: 'Toscana',
      },
      {
        dx: 85,
        dy: -15,
        subject: [11.280609418861609, 46.440732510724104],
        name: 'Trentino Alto Adige',
      },
      {
        dx: -80,
        dy: 40,
        subject: [12.49159362852822, 42.96596886874232],
        name: 'Umbria',
      },
      {
        dx: 0,
        dy: -35,
        subject: [7.393712678913692, 45.732574307129475],
        name: "Valle d'Aosta",
      },
      {
        dx: 40,
        dy: 20,
        subject: [11.841902940753824, 45.66154968582945],
        name: 'Veneto',
      },
    ];

    if (!selection) {
      return null;
    }

    const {dx, dy, subject, name} = annotations.find(
      ({name}) => name === selection
    );

    return (
      <Annotation
        dx={dx}
        dy={dy}
        subject={subject}
        strokeWidth={1}
        stroke="#607D8B"
      >
        <text>{name}</text>
      </Annotation>
    );
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
      if (selected == null) {
        return 0;
      }
      const nameA = this.geoNameExtractor(a);
      const nameB = this.geoNameExtractor(b);
      if (selected === nameA) {
        return 1;
      }
      if (selected === nameB) {
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
            {!isDetailed && this.renderAnnotations(selected)}
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
