import data from "./municipalities.json";
import breakdown from "./breakdown.json";

const aggregatedData = data.municipalities.reduce((partial, municipality) => {
  municipality.forEach((value, year) => {
    partial[year] = partial[year] || 0;
    partial[year] += value;
  });
  return partial;
}, []);

const getAbsolute = () => ({ data, aggregated: aggregatedData });

const transformedMunicipalityBy = {
  absolute: getAbsolute,
};

const datasets = {
  municipalities: data,
  breakdown,
};

export const getMunicipalityTransformedBy = (value) =>
  value in transformedMunicipalityBy
    ? transformedMunicipalityBy[value]()
    : transformedMunicipalityBy.absolute();
export default (dataset) => datasets[dataset] || datasets.municipalities;
