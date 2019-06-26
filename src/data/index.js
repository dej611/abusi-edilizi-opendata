import data from './municipalities.json';
import breakdown from './breakdown.json';

const areas = data.areas;
const aggregatedArea = data.totalArea;
const AREA_UNIT = 1000 * 1000; // 1000 m * 1000 m = 1000000 mq = 1 kmq

const idMapping = areas.map(entry => entry.id);

const aggregatedData = data.municipalities.reduce((partial, municipality) => {
  municipality.forEach((value, year) => {
    partial[year] = partial[year] || 0;
    partial[year] += value;
  });
  return partial;
}, []);

const getAbsolute = () => ({data, aggregated: aggregatedData});
const getByDensity = () => {
  const normalizedData = aggregatedData.map(
    value => (AREA_UNIT * value) / aggregatedArea
  );

  const normalizedDetailedData = {
    municipalities: data.municipalities.map((municipality, i) => {
      return municipality.map(
        value => (AREA_UNIT * value) / areas[idMapping[i] - 1].area
      );
    }),
    years: data.years,
  };
  return {data: normalizedDetailedData, aggregated: normalizedData};
};

const getByPopulation = getByDensity;

const transformedMunicipalityBy = {
  absolute: getAbsolute(),
  density: getByDensity(),
  population: getByPopulation(),
};

const datasets = {
  municipalities: data,
  breakdown,
};

export const criteria = Object.keys(transformedMunicipalityBy);

export const getMunicipalityTransformedBy = value =>
  transformedMunicipalityBy[value] || transformedMunicipalityBy.absolute;
export default dataset => datasets[dataset] || datasets.municipalities;
