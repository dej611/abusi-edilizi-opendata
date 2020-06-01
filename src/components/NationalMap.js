import React, { useState, useCallback, useMemo } from "react";
import { arrayOf, bool, func, number, string, shape } from "prop-types";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Annotation,
} from "react-simple-maps";
import { scaleLinear, scaleOrdinal } from "@vx/scale";
import { scaleLinear as scaleLinearFn } from "d3-scale";
import { withTranslation, useTranslation } from "react-i18next";

import { COLORS } from "../utils/constants";

import { HOVER_REGION } from "../stores";
import { getHoverRegion } from "../stores/selectors";
import Legend from "./NationalMapLegend";
import annotations from "../data/regionAnnotations.json";

const topojsonComuniURL = process.env.PUBLIC_URL + "/italy_mappa_comuni.json";
const topojsonRegioniURL = process.env.PUBLIC_URL + "/italy_mappa_regioni.json";
const prerenderedComuniURL =
  process.env.PUBLIC_URL + "/mappa_italia_comuni.png";
const prerenderedRegioniURL =
  process.env.PUBLIC_URL + "/mappa_italia_regioni.png";

const wrapperStyles = {
  maxWidth: 600,
};

const NationalMap = ({ data, type, isMobile, selected, handleAreaHover }) => {
  const [loaded, setLoadingState] = useState(false);
  const [t] = useTranslation();

  const geoNameExtractor = useCallback(
    (geo) => {
      if (type === "regioni") {
        const nameFixes = {
          Apulia: "Puglia",
          "Emilia-Romagna": "Emilia Romagna",
          "Friuli-Venezia Giulia": "Friuli Venezia Giulia",
          Sicily: "Sicilia",
          "Trentino-Alto Adige": "Trentino Alto Adige",
        };
        const name = geo.properties.NAME_1;
        return nameFixes[name] || name;
      }
      return geo.properties.nome_com;
    },
    [type]
  );

  const handleHover = useCallback(
    (geo) => {
      if (handleAreaHover) {
        handleAreaHover(geoNameExtractor(geo));
      }
    },
    [geoNameExtractor, handleAreaHover]
  );

  const resetHover = useCallback(() => {
    if (handleAreaHover) {
      handleAreaHover(null);
    }
  }, [handleAreaHover]);

  const renderAnnotations = useCallback((selection) => {
    if (!selection) {
      return null;
    }

    const { dx, dy, subject, name } = annotations.find(
      ({ name }) => name === selection
    );

    return (
      <Annotation
        dx={dx}
        dy={dy}
        subject={subject}
        connectorProps={{
          stroke: "#607D8B",
          strokeWidth: 1,
          strokeLinecap: "round",
        }}
      >
        <text>{name}</text>
      </Annotation>
    );
  }, []);

  const isDetailed = type !== "regioni";

  const quickLookup = useMemo(
    () =>
      data.items.reduce((dict, { name, value }) => {
        dict[name.toLowerCase()] = value;
        return dict;
      }, {}),
    [data]
  );

  const geography = !isDetailed ? topojsonRegioniURL : topojsonComuniURL;

  const max = useMemo(
    () =>
      Math.max.apply(
        null,
        data.items.map(({ value }) => value)
      ),
    [data]
  );

  const fillGray = isDetailed ? COLORS.gray : COLORS.lighterGray;

  const fillScale = useMemo(
    () => scaleLinearFn().domain([0, max]).range([fillGray, COLORS.blue]),
    [fillGray, max]
  );

  const regionsScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, max],
        range: [fillGray, COLORS.blue],
      }),
    [fillGray, max]
  );

  const townsScale = useMemo(
    () =>
      scaleOrdinal({
        domain: [t("charts:Senza dataset"), t("charts:Con dataset")],
        range: [fillGray, COLORS.blue],
      }),
    [fillGray, t]
  );

  const colors = Object.keys(quickLookup).reduce((dict, key) => {
    dict[key.toLowerCase()] = fillScale(quickLookup[key.toLowerCase()]);
    return dict;
  }, {});

  const sortByHighlight = (a, b) => {
    if (selected == null) {
      return 0;
    }
    const nameA = geoNameExtractor(a);
    const nameB = geoNameExtractor(b);
    if (selected === nameA) {
      return 1;
    }
    if (selected === nameB) {
      return -1;
    }
  };

  if (isMobile && !window.PRERENDER && !loaded) {
    return (
      <div className="center-image">
        <img
          src={isDetailed ? prerenderedComuniURL : prerenderedRegioniURL}
          alt="Mappa comuni italiani con dataset su abusi edilizi"
          className={isDetailed ? "magnify-for-tablet" : ""}
          loading="lazy"
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

  return (
    <div
      className={`chart-wrapper-sticky ${
        isDetailed && !loaded ? "map-placeholder" : ""
      }`}
    >
      <ComposableMap
        projection="mercator"
        projectionConfig={{ scale: 1600 }}
        width={(3 / 4) * wrapperStyles.maxWidth}
        height={450}
        className="map-full-size"
        style={
          !loaded
            ? {
                backgroundImage: `url(${
                  isDetailed ? prerenderedComuniURL : prerenderedRegioniURL
                })`,
                backgroundSize: "cover",
              }
            : {}
        }
      >
        <ZoomableGroup center={[13.623047, 42.032974]} disablePanning={true}>
          <Geographies
            geography={geography}
            onGeographyPathsLoaded={() => setLoadingState(true)}
            disableOptimization={!isDetailed}
          >
            {(geographies, projection) =>
              geographies.sort(sortByHighlight).map((geography, i) => {
                const name = geoNameExtractor(geography);

                const isSelected = name === selected;

                const defaultStyle = {
                  fill: colors[name.toLowerCase()] || COLORS.gray,
                  stroke: isSelected ? COLORS.darkerBlue : COLORS.gray,
                  outline: "none",
                };

                const highlightedStyle = {
                  fill: colors[name.toLowerCase()] || COLORS.gray,
                  stroke: COLORS.black,
                  strokeWidth: 0.75,
                  outline: "none",
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
                    onMouseMove={handleHover}
                    onMouseLeave={resetHover}
                    style={{
                      default: defaultStyle,
                      ...interactiveStyle,
                    }}
                  />
                );
              })
            }
          </Geographies>
          {!isDetailed && renderAnnotations(selected)}
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
          onClick={(e) => {
            e.preventDefault();
            resetHover();
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
};

NationalMap.propTypes = {
  type: string.isRequired,
  isMobile: bool,
  data: shape({
    items: arrayOf(shape({ name: string, value: number })),
    fonte: string,
  }).isRequired,
  selected: string,
  handleAreaHover: func,
};

export default withTranslation()(NationalMap);

const getHoverData = createSelector([getHoverRegion], (region) => ({
  selected: region,
}));

const mapStateToProps = (state) => getHoverData(state);

const propsToState = (dispatcher) => ({
  handleAreaHover: (area) => dispatcher({ type: HOVER_REGION, area }),
});

export const NationalMapSynced = connect(
  mapStateToProps,
  propsToState
)(NationalMap);
