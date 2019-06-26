export default {
  translation: {
    title: 'Unauthorized Developments in Italy',
    subtitle: 'Exploring the unauthorized development open data',
    intro: `The unauthorised development problem has always existed in Italy,
    or at least every single year the news keeps on remind us of what
    big deal is. But what exactly mean the term "unauthorised
    development" and is there any data about it - and where is it?`,
    goal: `This article is an attempt to answer such question, an attempt to
    understand the current state of the problem by exploring the data
    available and building a data visualization able to provide an
    insight on the topic.`,
    research: `From a quick search online, it is clear that many articles on the
    topic often point to this single reference as data: <2>Rapporti Benessere Equo e Sostenibile (BES)</2>. That is report made by the Italian Statistican Institute (ISTAT)
    and it is published with updated data every year. The report
    itself is very complete and the unauthorised development problem
    data is confined in the environment section of the report. The
    data in the report is aggregated by either regional or macro-area
    (north, center and south of Italy), for each group a year series
    is provided to compare the estimated progress during time. The
    same topic attempts to explore some prediction on the topic based
    on the data series collected, with interesting results.
    <3/>
    Below there's a map of the data from the report for the year 2018:`,
    'regional-map-explanation': `For each region a numeric factor has been computed: this number
    represent the estimated unauthorised development for every 100
    authorized development buildings.`,
    'is-there-more-data': `The data in the report helps to create an overview of the problem,
    but it is not very detailed: is there any other source with more
    detail? The town of Rome has published <1><0>1</0></1> 
    some data on the matter, that is possible to analize in this
    article.`,
    'rome-title': 'The town of Rome',
    'rome-intro': `The town of Rome has published some datasets with an
    interesting level of detail on the matter, but it has stopped
    publishing it in 2012.`,
    'rome-map-trend': `Despite the age of the dataset, the quality of the data is an
    opportunity to explore and start some analysis. The following
    is the visualization of the trend for the phenomenon for the
    city of Rome:`,
    'rome-main-chart-title': "Unauthorized development on the Rome's soil",
    'rome-main-chart-timespan-label': 'Years',
    'rome-main-chart-total-label': 'Total',
    'rome-main-chart-explanation': `Moving the mouse cursor on the chart it is possible to see the
      number of unauthorized development instances found by the law
      enforcement personnel for each year. At the same time the map
      of the city will change accordingly to the year hovered.`,
    'rome-municipality-title': 'The municipality overview',
    'rome-municipality-intro': `Thanks to the level of detail of the datasets, it is possible
      to analyse the trend of the phenomenon for each municipiality
      within the town of Rome:`,
    'rome-municipality-chart-explanation': `Each municipality chart is hoverable with the mouse cursor,
    all the other charts will show a tooltip for the same period
    of time to give some context.`,
    'rome-type-title': 'Understanding the types of unauthorised development',
    'rome-type-intro': `The dataset published contain also quality information in
    addition on quantitative one, on the town bases. In the chart
    below the series of data with the different types is shown:
    "Flat" and "Field" types are the most common type of
    unhautorized development, the it is still interesting to
    explore the other types as well.`,
    'rome-type-chart-title':
      'Unauthorized development by type in the town of Rome',
    'rome-type-chart-analysis': `The general trend looks decreasing, matching the other charts
    on the matter. An interesting fact is the rising of the type
    "Not available" since year 2004 that reached by the end of the
    dataset a 20% of the total: the dataset is not clear of what is the specific meaning of this label, 
    it can be either a data gap or an explicit difficulty in reporting the type of building. Hovering the chart will show a
    detailed tooltip with the numbers for each type, percentage on
    the total and absolute numbers - in case of "Trend" type of
    chart the order of the values are inverted.`,
    'other-towns-title': 'What about other towns?',
    'other-towns-intro': `Other than the town of Rome, is is possible to find other town's
      dataset on the topic?`,
    'other-towns-is-data-available': `In the <2>budget law 2018</2> 
    the Ministry of Transports and Infrastructure was supposed to
    create a national database for unhautorized development data where
    each public administration should have submitted its data,
    mandatory, with penalty fees for those public servant who do not
    comply with the law. After several researches online it has
    notbeen possible to find such database - not even mentioned
    anywhere. Therefore the data has been researched in each
    administration open data portal.`,
    'other-towns-some-data-available': `Some town administrations publish the data with different level of
    details, with geographic, temporal and category information.`,
    'other-towns-data': `As for now {{allTownsWithDataset}} town administrations are
    publishing the data on the topic (out of {{countTowns}}). This
    includes also the town of Rome dataset!`,
    'other-towns-map': `Below a map of the town administration who publish data on
      unauthorised development.`,
    'other-towns-search-label': 'Search for a town dataset:',
    'contribute-title': 'Would you like to contribute?',
    'contribute-intro': `Do you like this project and would like to help? There are a lot
      of things you can help with!`,
    'contribute-how': `If you find a bug or issue using the charts in the article please
    notify us either <2>su Github</2> or <6>via email</6>. In alternative you can help us find more dataset on the matter
    asking your town to publish the data for unauthorised development
    using the <9>FOIApop service</9>: look for your town, click on "Nuovo Accesso Civico
    Generalizzato" and use the "Richiesta dati opere
    abusive" subject in the form. Then write a request for the
    data.`,
    'contribute-goal': `The goal of this project is to provide a full coverage of data
    on the topic nationally in order to monitor the state of the
    problem.`,
    'notes-title': 'Notes',
    'notes-1': `The datasets were available on the Rome
    open data portal up to 2018. The links have been removed since
    from the website but they are still reachable through other open
    data portals.`,
    'notes-2': `The datasets refer to the previous Municipality organization. 
    The data has been re-organized to match the newer shape of each Municipality.`,
    'search-town-input': 'Search a town (i.e. Palermo)',
    'contribute-coffee':
      'Do you like this project? Consider to buy me a coffee!',
    'contribute-share': 'Alternatively help us share it:',
  },
  tooltips: {
    Indicatore:
      'Number of unhautorized developments for every 100 authorized ones',
    Categoria:
      'Qualitative information. i.e. Type of building or penalty fee applied',
    Geo: 'Geographic information',
    Tempo: 'Temporal information',
    Anno: 'Last update of the dataset',
  },
  charts: {
    Anno: 'Year',
    Anni: 'Years',
    Municipio: 'Municipality',
    Regione: 'Region',
    Indicatore: 'Computed Factor',
    Appartamento: 'Flat',
    Capannone: 'Warehouse',
    Edificio: 'Edifice',
    Fabbricato: 'Building',
    Locale: 'Box',
    Manufatto: 'Artifact',
    Terreno: 'Field',
    'Non indicato': 'Not available',
    'Senza dataset': 'Without dataset',
    'Con dataset': 'With dataset',
    'show-trends': 'Show Trends',
    'show-perc': 'Show %',
    'y-axis-per-type': 'By type {{postfix}}',
    Descrizione: 'Description',
    Categoria: 'Category',
    Geo: 'Geo',
    Tempo: 'Time',
    Fonte: 'Source',
    'Abusi totali': 'Unauthorized total',
  },
};
