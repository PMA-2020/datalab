import Network from './network';
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
  static initializeStrings(strings) {
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
  static initializeLanguage(languages) {
    /*for (let k in languages) {
      if (languages[k]) {
        let opt = Utility.createNode('option');
        opt.value = k;
        opt.innerHTML = languages[k];
        $('#select-language').append(opt);
      }
    }*/
    Translate.google_translate_support_lang().then(data => {
      const langs = data.data.languages;
      langs.forEach(e => {
        let opt = Utility.createNode('option');
        opt.value = e.language;
        opt.innerHTML = e.name;
        $('#select-language').append(opt);
      });
      $('#select-language').selectpicker('refresh');
      $('#select-language').selectpicker('val', 'en');
    });
  }

  /**
   * Builds the html select option groups for characteristic groups
   * loaded from the API
   * @private
   */
  static initializeCharacteristicGroups(characteristicGroups) {
    characteristicGroups.forEach(group => {
      const optGroupName = Utility.getString(group);
      let optGroup = $('<optgroup></optgroup>').attr({
          'class': 'i18nable-optgroup',
          'data-key': group["label.id"],
          'label': optGroupName
      });

      group.characteristicGroups.forEach(characteristic => {
        let opt = Utility.createNode('option');

        opt.value = characteristic.id;
        opt.className = 'i18nable';
        opt.setAttribute('data-definition-id', characteristic["definition.id"]);
        opt.setAttribute('data-label-id', characteristic["label.id"]);
        opt.setAttribute('data-key', characteristic["label.id"]);
        opt.innerHTML = Utility.getString(characteristic);
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
  static initializeIndicators(indicators) {
    indicators.forEach(group => {
      const optGroupName = Utility.getString(group);
      let optGroup = $('<optgroup></optgroup>').attr({
          'class': 'i18nable-optgroup',
          'data-key': group["label.id"],
          'label': optGroupName
      });

      group.indicators.forEach(indicator => {
        let opt = Utility.createNode('option');

        opt.value = indicator.id;
        opt.className = 'i18nable';
        opt.setAttribute('data-definition-id', indicator["definition.id"]);
        opt.setAttribute('data-label-id', indicator["label.id"]);
        opt.setAttribute('data-key', indicator["label.id"]);
        opt.setAttribute('data-type', indicator["type"]);
        opt.innerHTML = Utility.getString(indicator);
        optGroup.append(opt);
      });
      $('#select-indicator-group').append(optGroup);
    });
  }

  /**
   * Builds the html for survey countries
   * @private
   */
  static initializeSurveyCountries(surveyCountries) {
    // const language = Selectors.getSelectedLanguage();

    surveyCountries.forEach(country => {
      const countryName = Utility.getString(country);

      let panelContainer = $('<div></div>').attr({
        'class': 'panel panel-default'
      });

      let panelBodyContainer = $('<div></div>').attr({
        'id': `collapse${country["label.id"]}`,
        'class': 'panel-collapse collapse'
      });

      let panelBody = $('<div></div>').attr({
        'class': 'panel-body'
      });

      let panelHeading = $('<div></div>').attr({
        'class': 'panel-heading',
        'role': 'tab',
        'id': countryName
      });

      let panelTitle = $('<div></div>').attr({
        'class': 'panel-title'
      });

      let panelLink = $('<a></a>').attr({
        'href': `#collapse${country["label.id"]}`,
        'role': 'button',
        'data-toggle': 'collapse',
        'data-parent': '#accordion',
        'data-key': country["label.id"],
        'class': 'i18nable',
      }).html(countryName);

      panelTitle.append(panelLink);
      panelHeading.append(panelTitle);
      panelContainer.append(panelHeading);

      country.geographies.forEach(geography => {
        const geographyName = Utility.getString(geography);

        let listHeader = $('<h4></h4>').attr({
          'data-key': geography["label.id"],
          'class': 'i18nable',
        }).html(geographyName);

        panelBody.append(listHeader);

        geography.surveys.forEach((survey, i) => {
          const surveyName = Utility.getString(survey);
          const surveyId = survey["id"];

          let listItem = $('<div></div>');

          let surveyInputClassName = 'country-round';
          if (i === geography.surveys.length - 1) {
            surveyInputClassName = 'country-round latest';
          }
          let surveyInput = $('<input/>').attr({
            'type': 'checkbox',
            'name': surveyId,
            'value': surveyId,
            'id': surveyId,
            'class': surveyInputClassName
          });

          let surveyInputLabel = $('<label></label>').attr({
            'data-key': survey["label.id"],
            'class': 'i18nable',
            'for': surveyId,
          }).html(surveyName);

          listItem.append(surveyInput);
          listItem.append(surveyInputLabel);
          panelBody.append(listItem);
        });
      });

      panelBodyContainer.append(panelBody);
      panelContainer.append(panelBodyContainer);

      $('#countryRoundModal .modal-body').append(panelContainer);
    });
  }

  /**
   * loads up the saved style data from local storage
   * @public
   */
  static initializeStyles() {
    if (!!sessionStorage.saved_style && sessionStorage.saved_style == 1) {
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
   * @param {Chart} chart - The one and only chart object
   * @public
   */
  static initialize(chart) {
    Network.get("datalab/init").then(res => {
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
      if (URLParse.getQuery() !== false) {
          const query = URLParse.parseQuery();
          $('#select-indicator-group').selectpicker('val', query['indicators']);
          $('#select-characteristic-group').selectpicker('val', query['characteristicGroups']);
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
