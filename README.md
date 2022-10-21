# Abusi Edilizi OpenData

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dej611/abusi-edilizi-opendata/issues)


![Abusi edilizi Roma](https://raw.githubusercontent.com/dej611/abusi-edilizi-opendata/master/public/front.gif)

The project is currently deployed at this URL: 
https://abusi-edilizi-opendata.dej611.now.sh/

## Requirements

* NodeJS, npm or yarn

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Run the project locally

To run the project locally you need to install all the required dependencies first, then start it:

```sh
npm i
npm run start
```

### Build the project

The project can be built and deployed on the internet.

```sh
npm run build
```

Once done the `build` folder will be created and its content is ready to be deployed.

## Data

The following is a list of the data in this repository:
* Shapefile italian towns: `./public/italy_mappa_comuni.json`
  * source: https://riccardosaporiti.carto.com/tables/shapefile_comuni_italiani_corretto/public
* Shapefile italian regions: `./public/italy_mappa_regioni.json`
  * source: https://github.com/deldersveld/topojson/blob/master/countries/italy/italy-regions.json
* Shapefile Municipalities for the city of Rome: `./public/municipi.json`.
  * source: https://romaurbanistica.carto.com/tables/municipi/public
* Old to new mapping of Rome Municipalities: `./public/roma.json`
* ISTAT data from the Rapporto BES: `./data/regions-data.json`
* List of administration's datasets: `./data/towns-data.json`
* Time series of Municipalities for the city of Rome: `./data/municipalities.json`
  * source: see the in the `towns-data.json` file for the city of Rome
* Time series per type for the city of Rome: `./data/breakdown.json`
  * source: see the in the `towns-data.json` file for the city of Rome

## Feedback

Let me know what do you think!
Enjoy it? Star this project!  
Alternatively [![But me a coffee](https://raw.githubusercontent.com/dej611/abusi-edilizi-opendata/master/public/buy_me_coffee.png)](https://www.buymeacoffee.com/dej611) :)  

Found any bug or issue? Please see below.

## Something Missing?

If you have ideas for more features to add to the article, or more data to add to it [let us know](https://github.com/dej611/abusi-edilizi-opendata/issues) or contribute with a PR!

## License

[MIT License](https://github.com/dej611/abusi-edilizi-opendata/blob/master/LICENSE)
