export default {
  translation: {
    title: 'Abusi edilizi in Italia',
    subtitle: 'Una immersione negli open data sulla questione abusi edilizi',
    intro: `Il problema dell'abusivismo edilizio in Italia esiste da tempo
          immemorabile ormai, annualmente ci viene ricordato di come la
          situazione peggiori senza sosta. Ma cosa viene considerato un
          abuso edilizio e dove si trovano i dati a riguardo?`,
    goal: `Da questa domanda nasce questo articolo, con lo scopo di capire la
          situazione tramite l'analisi dei dati, esplorando le fonti
          disponibili e costruendo una mappa del tipo di informazione in
          esso contenuta.`,
    explanation: `Ma prima di iniziare l'esplorazione, chiariamo di cosa si parla
          quando si dice "abuso edilizio": un abuso edilizio è un illecito
          di tipo amministrativo (es. multa) o penale, causato da una
          costruzione su suolo non edificabile oppure la costruzione senza
          le dovute autorizzazioni richieste dai regolamenti in materia.
          Esistono, in Italia, diversi tipi di abusi edilizi, tra cui i
          più comuni sono: strutturale, urbanistico e paesaggistico. Per
          spiegarne le differenze, se si decide di fare un intervento
          edilizio su di un edificio sotto vincolo paesaggistico oppure
          per colorare la facciata di una parete esterna di un colore
          arbitrario in un condominio, allora si può incorrere in un abuso
          edilizio di tipo paesaggistico. Qualora si decidesse di
          effettuare un intervento edilizio su di un muro interno ad un
          edificio senza comunicarlo agli appositi uffici, allora si
          tratterebbe di un abuso urbanistico. Se invece si modificasse
          una parete portante, ad esempio aprendo un varco, allora l'abuso
          sarebbe di tipo strutturale.`,
    dangerous: `Oltre al problema amministrativo in sè, è importante notare come
          l'abuso edilizio, in particolare quello di tipo strutturale e
          paesaggistico ma non solo, possa arrecare un pericolo per il
          cittadino. In particolare quando l'abuso è effettuato ignorando
          vincoli o disposizioni legate alla sicurezza questo può essere
          una fonte di grave pericolo per sè oltre che per altre persone - 
          ad esempio in caso di costruzione su area con dissesto idrogeologico.`,
    research: `Da una semplice ricerca a livello nazionale risulta che molti
          articoli che trattano il tema facciano spesso riferimento ai <2>Rapporti Benessere Equo e Sostenibile (BES)</2> 
          redatti dall'Istat: ogni anno l'Istat pubblica un rapporto
          sintetico e aggregato di varie informazioni, tra cui risultano
          anche dati sull'abusivismo edilizio. I dati qui contenuti sono
          aggregati su base geografica con dettaglio regionale e per
          macro-area, con intervallo temporale di un anno; oltre al dato
          relativo all'anno di pubblicazione, il Rapporto BES si spinge
          all'analisi ed a valutazioni di trend sul tema, con
          interessanti riflessioni.
          <3/>
          Di seguito è mostrata la mappa dei dati 2018 a partire dall'ultimo
          Rapporto BES (2018):`,
    'regional-map-explanation': `Per ciascuna regione è calcolato un indicatore numerico che
          rappresenta, a partire da 100 costruzioni edilizie legalmente
          costruite, il numero di costruzioni abusive fatte in aggiunta.`,
    'is-there-more-data': `Ma esistono dati più dettagliati che delle statistiche aggregate
          per regioni pubblicate dall'ISTAT? Il comune di Roma pubblica(va) <1><0>1</0></1> 
          dei dati a tal proposito, anche non aggiornatissimi che possiamo
          analizzare.`,
    'rome-title': 'I dati di Roma Capitale',
    'rome-intro': `Il Comune di Roma ha pubblicato dei dati con un certo
          dettaglio sul tema, anche se la data di ultimo aggiornamento
          risale al 2012.`,
    'rome-map-trend': `Nonostante questo, varietà dei dati offre l'occasione per
          alcune analisi interessanti. Iniziamo con il visualizzare il
          trend generale per il comune:`,
    'rome-main-chart-title': 'Abusi edilizi sul territorio di Roma Capitale',
    'rome-main-chart-timespan-label': 'Totale Anni',
    'rome-main-chart-total-label': 'Totale Abusi',
    'rome-main-chart-explanation':
      'Spostando il mouse sul grafico è possibile vedere il numero di accertamenti per singolo anno, oltre che vedere sulla mappa come cambi la situazione per municipio.',
    'rome-municipality-title': 'Il dato municipio per municipio',
    'rome-municipality-intro':
      'Il dettaglio dei dati permette di analizzare il trend degli accertamenti anche al livello territoriale più dettagliato, cioè per ciascun municipio<1><0>2</0></1>:',
    'rome-municipality-chart-explanation': `Posizionando il mouse su ciascun grafico è possibile
      analizzare in isolamento il trend, oltre che visualizzare il
      dato specifico per gli altri municipi tramite tooltip.`,
    'rome-type-title': 'Il tipo di abuso',
    'rome-type-intro': `Fortunatamente il dato fornito, oltre che quantitativo
      contiene anche informazioni di tipo qualitativo, anche se su
      base cittadino. Come è possibile vedere, il tipo di abuso su
      "Appartamento" e "Terreno", dominano la
      maggior parte degli accertamenti riportati, anche se è
      interessante capire ed esplorare anche gli altri tipi di abusi
      specificati.`,
    'rome-type-chart-title':
      'Abusi edilizi sul territorio di Roma Capitale divisi per tipo',
    'rome-type-chart-analysis': `Mentre il numero generale di abusi edilizi accertati è in
      costante diminuzione è interessante notare come dal 2004 in
      poi il tipo di abuso "Non indicato" cresca
      notevolmente fino a raggiungere quasi il 20% del totale degli
      accertamenti nel 2010: non è chiaro il reale significato di questa etichetta, potrebbe quindi 
      esprimere sia una mancanza reale nei dati oppure l'effettiva impossibilità di indicare il tipo di
      edificio per qualche ragione. Nel tooltip mostrato, oltre alle
      percentuali sono presenti, tra parentesi, i dati assoluti - in
      caso di grafico con "Trend" l'ordine è invece invertito.`,
    'other-towns-title': 'E gli altri comuni?',
    'other-towns-intro':
      "Quali altri comuni pubblicano i dati riguardo l'abusivismo edilizio sul loro territorio?",
    'other-towns-is-data-available': `Nella <2>legge di bilancio 2018</2> 
      il Ministero dei Trasporti e delle Infrastrutture avrebbe dovuto
      istituire "la banca di dati nazionale sull'abusivismo
      edilizio" in cui gli enti e le amministrazioni dovrebbero
      condividere i dati relativi agli illeciti accertati, con relative
      sanzioni a carico dei funzionari inadempienti. Dopo numerose
      ricerche non è stato possibile reperire tale banca dati,
      procedendo alla ricerca quindi nei cataloghi open data forniti da
      ciascuna amministrazione.`,
    'other-towns-some-data-available': `Fortunatamente alcuni comuni offrono dati sul tema con granularità
      di vario genere, sia di tipo temporale che geografico oltre che,
      nel dettaglio sul tipo di abuso riscontrato.`,
    'other-towns-data': `Al momento {{allTownsWithDataset}} comuni (su {{countTowns}})
      offrono dataset in tema (inclusa Roma Capitale!).`,
    'other-towns-map':
      'Di seguito una mappa con i comuni che pubblicano i dati sul loro territorio.',
    'other-towns-search-label':
      "Cerca se la tua città mette a disposizione i dati sull'abusivismo edilizio:",
    'contribute-title': 'Vuoi contribuire al progetto?',
    'contribute-intro':
      'Ti piace questo progetto e vorresti contribuire? Ci sono un sacco di cose che puoi fare!',
    'contribute-how': `Come prima cosa se trovi qualche problema con l'utilizzo dei
      grafici sopra segnalacelo <2>su Github</2> o <6>via email</6>. Altrimenti puoi aiutarci a far aprire al tuo comune i dati
      riguardo l'abusivismo edilizio utilizzando 
      <9>il servizio FOIApop</9>: cerca il
      tuo comune, poi richiedi il "Nuovo Accesso Civico
      Generalizzato" e come testo metti "Richiesta dati
      opere abusive".`,
    'contribute-goal': `L'obiettivo è quello di colorare la mappa dei comuni in modo
      da monitorare i dati italiani su questo fenomeno`,
    'notes-title': 'Note',
    'notes-1': `I dataset erano direttamente disponibili
    sul portale open data del comune fino al 2018. Sono stati poi
    rimossi i link dal portale, ma rimangono comunque raggiungibili da
    altri portali open data.`,
    'notes-2': `Il dataset si riferisce alla precedente divisione dei municipi (pre-2013). 
    I dati sono stati riadattati per la nuova organizzazione dei municipi.`,
    'search-town-input': 'Cerca una città (es. Palermo)',
    'no-data':
      'Non ci sono ancora dati per la città selezionata. Per aiutarci ad ottenerli, leggi sotto!',
    'contribute-coffee': 'Ti piace questo progetto? Offrimi un caffè!',
    'contribute-share': 'Oppure aiutaci a diffonderlo:',
  },
  tooltips: {
    Indicatore:
      'Numero di costruzioni abusive per 100 costruzioni autorizzate dai Comuni.',
    Categoria: 'Informazione qualitativa. es. Tipo di abuso o sanzione',
    Geo: 'Dati geografici',
    Tempo: 'Dati temporali',
    Anno: 'Ultimo Aggiornamento',
  },
  charts: {
    Anno: 'Anno',
    Anni: 'Anni',
    Municipio: 'Municipio',
    Regione: 'Regione',
    Indicatore: 'Indicatore',
    Appartamento: 'Appartamento',
    Capannone: 'Capannone',
    Edificio: 'Edificio',
    Fabbricato: 'Fabbricato',
    Locale: 'Locale',
    Manufatto: 'Manufatto',
    Terreno: 'Terreno',
    'Non indicato': 'Non indicato',
    'Senza dataset': 'Senza dataset',
    'Con dataset': 'Con dataset',
    'show-trends': 'Mostra Trend',
    'show-perc': 'Mostra % relativa',
    'y-axis-per-type': 'Abusi per tipo {{postfix}}',
    Descrizione: 'Descrizione',
    Categoria: 'Categoria',
    Geo: 'Geo',
    Tempo: 'Tempo',
    Fonte: 'Fonte',
    'Abusi totali': 'Abusi totali',
  },
};
