import Utility from './utility';
import URLParse from './url-parse';
import Definitions from './definitions';
import Translate from './translate';
import Promise from 'promise-polyfill';

import env from '../../env';

/**
 * Additional app initialization,
 * invoked by the chart, which is in turn
 * was initialized by main.js
 * @public
 */
export default class Initialization {
  /**
   * Store the translation strings in local storage if able
   * @private
   */
  initializeStrings(strings) {
    if (typeof(Storage) !== "undefined") {
      sessionStorage.removeItem('pma2020Strings', strings);
      sessionStorage.pma2020Strings = JSON.stringify(strings);
    } else {
      console.log('Warning: Local Storage is unavailable.');
    }
  }

  /**
   * Build out the language select based on an array of languages
   * @private
   */
  initializeLanguage(languages) {
    for(var k in languages) {
      let opt = Utility.createNode('option', { 
        value: k, innerHTML: languages[k]
      });
      $('#select-language').append(opt);
    }
    /*Translate.google_translate_support_lang().then(data => {
      const langs = data.data.languages;
      langs.forEach(e => {
        let opt = Utility.createNode('option');
        opt.value = e.language;
        opt.innerHTML = e.name;
        $('#select-language').append(opt);
      });
      $('#select-language').selectpicker('refresh');
      $('#select-language').selectpicker('val', 'en');
    });*/
  }

  /**
   * Builds the html select option groups for characteristic groups
   * loaded from the API
   * @private
   */
  initializeCharacteristicGroups(characteristicGroups) {
    characteristicGroups.forEach(group => {
      const optGroupName = Utility.getString(group);
      let optGroup = Utility.createNode('optgroup', {
        label: optGroupName,
        class: 'i18nable-optgroup',
        'data-key': group['label.id']
      });

      group.characteristicGroups.forEach(characteristic => {
        let opt = Utility.createNode('option', {
          value: characteristic.id,
          class: 'i18nable',
          'data-definition-id': characteristic['definition.id'],
          'data-label-id': characteristic['label.id'],
          'data-key': characteristic['label.id'],
          innerHTML: Utility.getString(characteristic)
        });
        optGroup.append(opt);
      });
      $('#select-characteristic-group').append(optGroup);
    });
  }

  /**
   * Builds the html select option groups for indicators
   * loaded from the API
   * @private
   */
  initializeIndicators(indicators) {
    indicators.forEach(group => {
      const optGroupName = Utility.getString(group);
      let optGroup = Utility.createNode('optgroup', {
        label: optGroupName,
        class: '18nable-optgroup',
        'data-key': group['label.id']
      });

      group.indicators.forEach(indicator => {
        let opt = Utility.createNode('option', {
          value: indicator.id,
          class: 'i18nable',
          'data-definition-id': indicator['definition.id'],
          'data-label-id': indicator['label.id'],
          'data-key': indicator['label.id'],
          'data-type': indicator['type'],
          innerHTML: Utility.getString(indicator),
        });

        optGroup.append(opt);
      });
      $('#select-indicator-group').append(optGroup);
    });
  }

  /**
   * Builds a panel heading node, which is a `div` containing a title `div`
   * and a link `a`.
   * @param {object} country - survey data on a given country.
   * @private
   */
  createPanelHeading(country) {
    const countryName = Utility.getString(country);
    const panelHeading  = Utility.createNode('div', {
      class: 'panel-heading',
      role: 'tab',
      id: countryName
    });

    let panelTitle  = Utility.createNode('div', {
      class: 'panel-title'
    });

    let panelLink  = Utility.createNode('a', {
      href: `#collapse${country['label.id']}`,
      role: 'button',
      'data-toggle': 'collapse',
      'data-parent': '#accordion',
      'data-key': country['label.id'],
      class: 'i18nable',
      innerHTML: countryName,
    });

    panelTitle.append(panelLink);
    panelHeading.append(panelTitle);
    return panelHeading;
  }

  /**
   * Builds the html for survey countries
   * @private
   */
  initializeSurveyCountries(surveyCountries) {
    const language = Utility.getSelectedLanguage();
    const fragment = new DocumentFragment();

    surveyCountries.forEach(country => {
      const panelContainer = this.createPanelContainer(country)
      fragment.appendChild(panelContainer);
    });

    $('#countryRoundModal .modal-body').append(fragment);
  }

  /**
   * Creates a panel container node consisting of a `div` with an internal
   * list
   * @param {object} country - survey data of a given country.
   */
  createPanelContainer(country) {
    let panelContainer  = Utility.createNode('div', {
      class: 'panel panel-default'
    });

    // Create panel heading.
    const panelHeading = this.createPanelHeading(country);
    panelContainer.append(panelHeading);

    const panelBodyContainer = Utility.createNode('div', {
      id: `collapse${country["label.id"]}`,
      class: 'panel-collapse collapse'
    });

    let panelBody  = Utility.createNode('div', {
      class: 'panel-body'
    });

    country.geographies.forEach(geography => {
      const geographyName = Utility.getString(geography);

      let listHeader = Utility.createNode('h4', {
        'data-key': geography['label.id'],
        class: 'i18nable',
        innerHTML: geographyName
      });

      panelBody.append(listHeader);

      geography.surveys.forEach((survey, i) => {
        const listItem = this.createListItem(survey, i, geography.surveys.length);
        panelBody.append(listItem);
      });
    });

    panelBodyContainer.append(panelBody);
    panelContainer.append(panelBodyContainer);
    return panelContainer;
  }


  /**
   * Create the list item for each survey provided
   * @param {object} survey - survey data of a given country.
   * @param {integer} index - the survey position in the list
   * @param {integer} len - the number of surveys in the country
   * @private
   */
  createListItem(survey, index, len) {
    const listItem  = Utility.createNode('div', );
    const surveyId = survey['id'];
    const surveyInput = Utility.createNode('input', {
      type: 'checkbox',
      name: surveyId,
      value: surveyId,
      id: surveyId,
      class: index === len - 1 ? 'country-round latest' : 'country-round'
    });
    listItem.append(surveyInput);
    const surveyName = Utility.getString(survey);
    const surveyInputLabel = Utility.createNode('label', {
      'data-key': survey['label.id'],
      class: 'i18nable',
      htmlFor: surveyId,
      innerHTML: surveyName
    });

    listItem.append(surveyInputLabel);
    return listItem;
  }

  /**
   * loads up the saved style data from local storage
   * @public
   */
  initializeStyles() {
    if (!!sessionStorage.getItem('saved_style') && sessionStorage.getItem('saved_style') == 1) {
      for (let i=0; i<sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith('styles.')) {
          $('#'+key.substr(7)).val(sessionStorage.getItem(key));
        }
      }
    }

    /* Set Default Value and Placeholder of Chart Title and Axis Label */
    const chartType = sessionStorage.getItem('chart-type');

    const chartTitle = sessionStorage.getItem('chart-title');
    $('.chart-style-wrapper #chart-title').val(chartTitle);
    $('.chart-style-wrapper #chart-title').attr('placeholder', chartTitle);

    const chartAxisLabel = sessionStorage.getItem('chart-axis-label');
    const selectorValidAxis = '.chart-style-wrapper #'+(chartType=='bar' ? 'x' : 'y')+'-axis-label';
    $(selectorValidAxis).val(chartAxisLabel);
    $(selectorValidAxis).attr('placeholder', chartAxisLabel);
    $('.chart-style-wrapper #'+(chartType=='bar' ? 'y' : 'x')+'-axis-label').val('');

    /* Set the switch of black and white */
    $('#dataset_black_and_white').prop('checked', sessionStorage.getItem('switch.bw')==="true");

    if (chartType=="pie") {
      $('.no-pie').hide();
    } else {
      $('.no-pie').show();
    }
  }

  /**
   * Main entry point for initialization,
   * does the actual first api call to get data
   * @public
   */
  initialize(network, chart) {
    network.get("datalab/init").then(res => {
      console.log("------------------------------------------------");
      console.log(`PMA2020 Datalab API Version: ${res.metadata.version}`);
      console.log(`PMA2020 Datalab Client:      ${env.version}`);
      console.log(`Environment Used:            ${env.environment}`);
      console.log("------------------------------------------------");
      this.initializeStrings(res.strings);
      this.initializeLanguage(res.languages);
      this.initializeCharacteristicGroups(res.characteristicGroupCategories);
      this.initializeIndicators(res.indicatorCategories);
      this.initializeSurveyCountries(res.surveyCountries);

      $('#select-characteristic-group').selectpicker('val', 'none');
      $('.selectpicker').selectpicker('refresh');
      const url = window.location.href;
      const queryString = URLParse.getQuery(url);
      if (queryString !== false) {
        const query = URLParse.parseQuery(queryString);
        $('#select-indicator-group').selectpicker('val', query['indicators']);
        $('#select-characteristic-group').selectpicker('val', query['characteristicGroups']);
        $('#select-language').selectpicker('val', query['lang']);
        if (query['lang']=='fr') {
            Translate.translatePage(); 
        }
        $('#chart-types #option-'+query['chartType']).click();
        const selectedCountries = query['surveyCountries'].split(',');
        selectedCountries.forEach(countryId => {
          $('#'+countryId).click();
        });
        if (query['overTime']=='true') {
          $('#dataset_overtime').prop('checked', true);
          $('#dataset_overtime').prop('disabled', false);
        }
        Definitions.setDefinitionText();
        chart.data(query).then(()=>{
          this.initializeStyles();
        });
      }
    });
    // Replace the footer year with the current year
    const dt = new Date();
    $('#footer-year').html(dt.getFullYear());
  }
}
