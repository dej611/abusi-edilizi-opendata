/* global window */
import React, {Component} from 'react';

import GradientDefinition from './components/GradientDefinition';
import AdministrativeMap from './components/AdministrativeMap';
import NationalMap, {NationalMapSynced} from './components/NationalMap';
import ViewableMonitor from './components/ViewableMonitor';
import StackedArea from './components/StackedAreaChart';
import SmallMultiples from './components/SmallMultiplesChart';
import LineChart from './components/LineChart';
import Header from './components/Header';
import Content from './components/Content';
import Footnote from './components/Footnote';
import Table from './components/Table';
import MainTable from './components/MainTable';
import SectionHeader from './components/SectionHeader';
import AutosuggestInput from './components/Autosuggest';
import getDataset, {getMunicipalityTransformedBy} from './data/index';
import townsTableData from './data/towns-data.json';
import regionsTableData from './data/regions-data.json';
import toponomasticaItalia from 'italia';
import SocialButtons from './components/SocialButtons';
import ReactGA from 'react-ga';

import {withTranslation, Trans} from 'react-i18next';

import logo from './logo.png';
import 'bulma/css/bulma.min.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';
import './App.css';

ReactGA.initialize('UA-4417733-14');
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.set({anonymizeIp: true});

const allTowns = [];
for (const regione of toponomasticaItalia.comuni.regioni) {
  for (const provincia of regione.province) {
    for (const comune of provincia.comuni) {
      allTowns.push({town: comune, county: provincia, region: regione});
    }
  }
}

const normalizedRegionsData = {
  fonte: regionsTableData.fonte,
  items: regionsTableData.regions,
};

const normalizedTownsData = {
  fonte: townsTableData.fonte,
  items: Object.keys(townsTableData.rows).map(name => ({
    name,
    value: 1,
  })),
};

const lineChartSizes = {
  width: 200,
  height: 120,
  margin: {top: 10, left: 50, right: 15, bottom: 25},
};

const mainLineChartSizes = {
  ...lineChartSizes,
  margin: {...lineChartSizes.margin, left: 50},
};

class App extends Component {
  state = {
    transformation: 'absolute',
  };
  render() {
    const {data, aggregated} = getMunicipalityTransformedBy(
      this.state.transformation
    );
    const breakdown = getDataset('breakdown');
    const lastIndex = data.years.length - 2;
    const firstYear = data.years[0];
    const lastYear = data.years[lastIndex];
    const totalAbuses = aggregated.reduce(
      (sum, value, i) => (i < lastIndex ? sum + value : sum),
      0
    );
    const widthSize = window.screen.width - 50;
    const bigChartWidth = Math.min(500, widthSize);
    const smallChartWidth = Math.min(180, widthSize / 2);
    const isMobile = widthSize < 900;
    const isTablet = widthSize > 768;

    const allTownsWithDataset = Object.keys(townsTableData.rows).length;
    const countTowns = allTowns.length;
    return (
      <div className="App">
        <Header />
        <GradientDefinition />
        <div className="section">
          <div className="container">
            <Content>
              <Trans i18nKey="intro">
                Il problema dell&#39;abusivismo edilizio in Italia esiste da
                tempo immemorabile ormai, annualmente ci viene ricordato di come
                la situazione peggiori senza sosta. Ma cosa viene considerato un
                abuso edilizio e dove si trovano i dati a riguardo?
              </Trans>
            </Content>
            <Content>
              <Trans i18nKey="goal">
                Da questa domanda nasce questo articolo, con lo scopo di capire
                la situazione tramite l&#39;analisi dei dati, esplorando le
                fonti disponibili e costruendo una mappa del tipo di
                informazione in esso contenuta.
              </Trans>
            </Content>
            <Content>
              <Trans i18nKey="research">
                Da una semplice ricerca a livello nazionale risulta che molti
                articoli che trattano il tema facciano spesso riferimento ai{' '}
                <a
                  href="https://www.istat.it/it/archivio/rapporto+bes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rapporti Benessere Equo e Sostenibile (BES)
                </a>{' '}
                redatti dall&#39;Istat: ogni anno l&#39;Istat pubblica un
                rapporto sintetico e aggregato di varie informazioni, tra cui
                risultano anche dati sull&#39;abusivismo edilizio. I dati qui
                contenuti sono aggregati su base geografica con dettaglio
                regionale e per macro-area, con intervallo temporale di un anno;
                oltre al dato relativo all&#39;anno di pubblicazione, il
                Rapporto BES si spinge all&#39;analisi ed a valutazioni di trend
                sul tema, con interessanti riflessioni.
                <br />
                Di seguito è mostrata la mappa dei dati 2018 a partire
                dall'ultimo Rapporto BES (2018):
              </Trans>
            </Content>
            <div className="columns">
              <div className="column is-three-quarters">
                <NationalMapSynced
                  data={normalizedRegionsData}
                  type="regioni"
                  isMobile={isMobile}
                />
              </div>
              <div className="column is-one-quarter">
                <MainTable
                  rows={regionsTableData.regions}
                  isMobile={isMobile}
                />
              </div>
            </div>
            <Content>
              <Trans i18nKey="regional-map-explanation">
                Per ciascuna regione è calcolato un indicatore numerico che
                rappresenta, a partire da 100 costruzioni edilizie legalmente
                costruite, il numero di costruzioni abusive fatte in aggiunta.
              </Trans>
            </Content>
            <Content>
              <Trans i18nKey="is-there-more-data">
                Ma esistono dati più dettagliati che delle statistiche aggregate
                per regioni pubblicate dall'ISTAT? Il comune di Roma
                pubblica(va)
                <sup>
                  <a href="#note1">1</a>
                </sup>{' '}
                dei dati a tal proposito, anche non aggiornatissimi che possiamo
                analizzare.
              </Trans>
            </Content>
            <SectionHeader>
              <div className="flex-row">
                <h1 className="title">
                  <Trans i18nKey="rome-title">I dati di Roma Capitale</Trans>
                </h1>{' '}
                <img className="App-logo" src={logo} alt="logo-comune-roma" />
              </div>
            </SectionHeader>
            <div className="columns">
              <div className="column is-one-third">
                <AdministrativeMap data={data} isMobile={isMobile} />
              </div>
              <div className="column is-two-thirds">
                <Content>
                  <Trans i18nKey="rome-intro">
                    Il Comune di Roma ha pubblicato dei dati con un certo
                    dettaglio sul tema, anche se la data di ultimo aggiornamento
                    risale al 2012.
                  </Trans>
                </Content>
                <Content>
                  <Trans i18nKey="rome-map-trend">
                    Nonostante questo, varietà dei dati offre l&#39;occasione
                    per alcune analisi interessanti. Iniziamo con il
                    visualizzare il trend generale per il comune:
                  </Trans>
                </Content>
                <nav className="level">
                  <div className="level-item has-text-centered">
                    <h5 className="subtitle">
                      <Trans i18nKey="rome-main-chart-title">
                        Abusi edilizi sul territorio di Roma Capitale
                      </Trans>
                    </h5>
                  </div>
                </nav>
                <nav className="level">
                  <div className="level-item has-text-centered">
                    <LineChart
                      data={aggregated}
                      years={data.years}
                      {...mainLineChartSizes}
                      height={160}
                      width={bigChartWidth}
                      name="roma"
                      isMobile={isMobile}
                    />
                  </div>
                </nav>
                <nav className="level">
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">
                        <Trans i18nKey="rome-main-chart-timespan-label">
                          Totale Anni
                        </Trans>
                      </p>
                      <p className="title">
                        {lastYear - firstYear} ({firstYear}-{lastYear})
                      </p>
                    </div>
                  </div>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">
                        <Trans i18nKey="rome-main-chart-total-label">
                          Totale Abusi
                        </Trans>
                      </p>
                      <p className="title">{totalAbuses}</p>
                    </div>
                  </div>
                </nav>
                <Content>
                  <Trans i18nKey="rome-main-chart-explanation">
                    Spostando il mouse sul grafico è possibile vedere il numero
                    di accertamenti per singolo anno, oltre che vedere sulla
                    mappa come cambi la situazione per municipio.
                  </Trans>
                </Content>
                <SectionHeader>
                  <h1 className="title">
                    <Trans i18nKey="rome-municipality-title">
                      Il dato municipio per municipio
                    </Trans>
                  </h1>
                </SectionHeader>
                <Content>
                  <Trans i18nKey="rome-municipality-intro">
                    Il dettaglio dei dati permette di analizzare il trend degli
                    accertamenti anche al livello territoriale più dettagliato,
                    cioè per ciascun municipio
                    <sup>
                      <a href="#note2">2</a>
                    </sup>
                    :
                  </Trans>
                </Content>
                <SmallMultiples
                  data={data}
                  {...lineChartSizes}
                  width={
                    isMobile && !isTablet ? bigChartWidth : smallChartWidth
                  }
                  perRow={5}
                  isMobile={isMobile}
                />
                <Content>
                  <Trans i18nKey="rome-municipality-chart-explanation">
                    Posizionando il mouse su ciascun grafico è possibile
                    analizzare in isolamento il trend, oltre che visualizzare il
                    dato specifico per gli altri municipi tramite tooltip.
                  </Trans>
                </Content>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <SectionHeader>
                  <h1 className="title">
                    <Trans i18nKey="rome-type-title">Il tipo di abuso</Trans>
                  </h1>
                </SectionHeader>
                <Content>
                  <Trans i18nKey="rome-type-intro">
                    Fortunatamente il dato fornito, oltre che quantitativo
                    contiene anche informazioni di tipo qualitativo, anche se su
                    base cittadino. Come è possibile vedere, il tipo di abuso su
                    &#34;Appartamento&#34; e &#34;Terreno&#34;, dominano la
                    maggior parte degli accertamenti riportati, anche se è
                    interessante capire ed esplorare anche gli altri tipi di
                    abusi specificati.
                  </Trans>
                </Content>
                <nav className="level">
                  <div className="level-item has-text-centered">
                    <h5 className="subtitle">
                      <Trans i18nKey="rome-type-chart-title">
                        Abusi edilizi sul territorio di Roma Capitale divisi per
                        tipo
                      </Trans>
                    </h5>
                  </div>
                </nav>
                <nav className="level">
                  <div className="level-item has-text-centered">
                    <StackedArea
                      data={breakdown.series}
                      years={breakdown.years}
                      {...lineChartSizes}
                      height={300}
                      width={bigChartWidth}
                      name="roma"
                      isMobile={isMobile}
                    />
                  </div>
                </nav>
                <Content>
                  <Trans i18nKey="rome-type-chart-analysis">
                    Mentre il numero generale di abusi edilizi accertati è in
                    costante diminuzione è interessante notare come dal 2004 in
                    poi il tipo di abuso &#34;Non indicato&#34; cresca
                    notevolmente fino a raggiungere quasi il 20% del totale
                    degli accertamenti nel 2010. Nel tooltip mostrato, oltre
                    alle percentuali sono presenti, tra parentesi, i dati
                    assoluti - in caso di grafico con "Trend" l'ordine è invece
                    invertito.
                  </Trans>
                </Content>
              </div>
            </div>
            <SectionHeader>
              <h1 className="title">
                <Trans i18nKey="other-towns-title">E gli altri comuni?</Trans>
              </h1>
            </SectionHeader>
            <Content>
              <Trans i18nKey="other-towns-intro">
                Quali altri comuni pubblicano i dati riguardo l&#39;abusivismo
                edilizio sul loro territorio?
              </Trans>
            </Content>
            <Content>
              <Trans i18nKey="other-towns-is-data-available">
                Nella{' '}
                <a
                  href="https://www.gazzettaufficiale.it/eli/id/2017/12/29/17G00222/sg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  legge di bilancio 2018
                </a>{' '}
                il Ministero dei Trasporti e delle Infrastrutture avrebbe dovuto
                istituire &#34;la banca di dati nazionale sull&#39;abusivismo
                edilizio&#34; in cui gli enti e le amministrazioni dovrebbero
                condividere i dati relativi agli illeciti accertati, con
                relative sanzioni a carico dei funzionari inadempienti. Dopo
                numerose ricerche non è stato possibile reperire tale banca
                dati, procedendo alla ricerca quindi nei cataloghi open data
                forniti da ciascuna amministrazione.
              </Trans>
            </Content>
            <Content>
              <Trans i18nKey="other-towns-some-data-available">
                Fortunatamente alcuni comuni offrono dati sul tema con
                granularità di vario genere, sia di tipo temporale che
                geografico oltre che, nel dettaglio sul tipo di abuso
                riscontrato.
              </Trans>
            </Content>
            <Content>
              <Trans
                i18nKey="other-towns-data"
                allTownsWithDataset={allTownsWithDataset}
                countTowns={countTowns}
              >
                Al momento {{allTownsWithDataset}} comuni (su {{countTowns}})
                offrono dataset in tema (inclusa Roma Capitale!).
              </Trans>
            </Content>
            <div className="columns">
              <div className="column is-two-third">
                <Content>
                  <Trans i18nKey="other-towns-map">
                    Di seguito una mappa con i comuni che pubblicano i dati sul
                    loro territorio.
                  </Trans>
                </Content>
                <ViewableMonitor>
                  {isViewable => (
                    <NationalMap
                      data={normalizedTownsData}
                      type="comuni"
                      isMobile={isMobile || !isViewable}
                    />
                  )}
                </ViewableMonitor>
              </div>
              <div className="column is-one-thirds">
                <Content>
                  <Trans i18nKey="other-towns-search-label">
                    Cerca se la tua città mette a disposizione i dati
                    sull'abusivismo edilizio:
                  </Trans>
                </Content>
                <AutosuggestInput
                  entries={allTowns}
                  data={townsTableData.rows}
                />
                <Table rows={townsTableData.rows} />
              </div>
            </div>
            <SectionHeader>
              <h1 className="title">
                <Trans i18nKey="contribute-title">
                  Vuoi contribuire al progetto?
                </Trans>
              </h1>
            </SectionHeader>
            <Content>
              <Trans i18nKey="contribute-intro">
                Ti piace questo progetto e vorresti contribuire? Ci sono un
                sacco di cose che puoi fare!
              </Trans>
            </Content>
            <Content>
              <Trans i18nKey="contribute-how">
                Come prima cosa se trovi qualche problema con l&#39;utilizzo dei
                grafici sopra segnalacelo{' '}
                <a href="https://github.com/dej611/abusi-edilizi-opendata/">
                  su Github
                </a>{' '}
                o{' '}
                <a href="#mailgo" data-address="dej611" data-domain="gmail.com">
                  via email
                </a>
                . Altrimenti puoi aiutarci a far aprire al tuo comune i dati
                riguardo l&#39;abusivismo edilizio utilizzando{' '}
                <a href="http://www.foiapop.it/">il servizio FOIApop</a>: cerca
                il tuo comune, poi richiedi il &ldquo;Nuovo Accesso Civico
                Generalizzato&rdquo; e come testo metti &ldquo;Richiesta dati
                opere abusive&rdquo;.
              </Trans>
            </Content>
            <Content>
              <strong>
                <Trans i18nKey="contribute-goal">
                  L&#39;obiettivo è quello di colorare la mappa dei comuni in
                  modo da monitorare i dati italiani su questo fenomeno
                </Trans>
              </strong>
            </Content>
            <Content>
              <Trans i18nKey="contribute-share">Aiutaci a diffonderlo:</Trans>
            </Content>
            <div className="has-text-centered">
              <SocialButtons />
            </div>
            <Content>
              <Trans i18nKey="contribute-coffee">
                Ti piace questo progetto? Offrimi un caffè!
              </Trans>
            </Content>
            <div className="has-text-centered">
              <a
                className="bmc-button"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.buymeacoffee.com/BGp0ns64z"
              >
                <img
                  src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png"
                  alt="Buy Me A Coffee"
                  style={{height: 'auto', width: 'auto'}}
                />
              </a>
            </div>
            <SectionHeader>
              <h3>
                <Trans i18nKey="notes-title">Note</Trans>
              </h3>
            </SectionHeader>
            <Footnote>
              <sup id="note1">1</sup>
              <Trans i18nKey="notes-1">
                {' '}
                I dataset erano direttamente disponibili sul portale open data
                del comune fino al 2018. Sono stati poi rimossi i link dal
                portale, ma rimangono comunque raggiungibili da altri portali
                open data.
              </Trans>
            </Footnote>
            <Footnote>
              <sup id="note2">2</sup>
              <Trans i18nKey="notes-2">
                {' '}
                Il dataset si riferisce alla precedente divisione dei municipi
                (pre-2013). I dati sono stati riadattati per la nuova
                organizzazione dei municipi.
              </Trans>
            </Footnote>
          </div>
        </div>
        <footer className="footer">
          <div className="content has-text-centered">
            <p>
              Made with{' '}
              <span role="img" aria-label="Love">
                ❤️
              </span>{' '}
              by <a href="https://twitter.com/dej611">dej611</a> from 🇮🇹 Rome.
            </p>
            <p>
              The source code is licensed{' '}
              <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
              The website content is licensed{' '}
              <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                CC BY NC SA 4.0
              </a>
              .
            </p>
            <a
              href="https://www.iubenda.com/privacy-policy/84149225"
              className="iubenda-white iubenda-embed"
              title="Privacy Policy "
            >
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    );
  }
}
export default withTranslation()(App);
