import Network from './network';
import Utility from './utility';
import Selectors from './selectors';
import URLParse from './url-parse';

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
    for(var k in languages) {
      let opt = Utility.createNode('option');
      opt.value = k;
      opt.innerHTML = languages[k];
      $('#select-language').append(opt);
    }
  }

  /**
   * Builds the html select option groups for characteristic groups
   * loaded from the API
   * @private
   */
  static initializeCharacteristicGroups(characteristicGroups) {
    characteristicGroups.forEach(group => {
      const optGroupName = Utility.getString(group);
      let optGroup = Utility.createNode('optgroup');

      optGroup.label = optGroupName;
      optGroup.className = 'i18nable-optgroup';
      optGroup.setAttribute('data-key', group["label.id"]);

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
      let optGroup = Utility.createNode('optgroup');

      optGroup.label = optGroupName;
      optGroup.className = 'i18nable-optgroup';
      optGroup.setAttribute('data-key', group["label.id"]);

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
    const language = Selectors.getSelectedLanguage();

    surveyCountries.forEach(country => {
      const countryName = Utility.getString(country);
      let panelContainer  = Utility.createNode('div');

      let panelHeading  = Utility.createNode('div');
      let panelTitle  = Utility.createNode('div');
      let panelLink  = Utility.createNode('a');

      let panelBodyContainer  = Utility.createNode('div');
      let panelBody  = Utility.createNode('div');

      panelContainer.className = 'panel panel-default';

      panelHeading.className = 'panel-heading';
      panelHeading.setAttribute('role', 'tab');
      panelHeading.id = countryName;

      panelTitle.className = 'panel-title';

      panelLink.href = `#collapse${country["label.id"]}`
      panelLink.setAttribute('role', 'button');
      panelLink.setAttribute('data-toggle', 'collapse');
      panelLink.setAttribute('data-parent', '#accordion');
      panelLink.setAttribute('data-key', country["label.id"]);
      panelLink.className = 'i18nable';
      panelLink.innerHTML = countryName;

      panelTitle.append(panelLink);
      panelHeading.append(panelTitle);
      panelContainer.append(panelHeading);

      panelBodyContainer.id = `collapse${country["label.id"]}`;
      panelBodyContainer.className = 'panel-collapse collapse';

      panelBody.className = 'panel-body';

      country.geographies.forEach(geography => {
        const geographyName = Utility.getString(geography);

        let listHeader = Utility.createNode('h4');

        listHeader.setAttribute('data-key', geography["label.id"]);
        listHeader.className = 'i18nable';
        listHeader.innerHTML = geographyName;

        panelBody.append(listHeader);

        geography.surveys.forEach((survey, i) => {
          const surveyName = Utility.getString(survey);
          const surveyId = survey["id"];

          let listItem  = Utility.createNode('div');
          let surveyInput = Utility.createNode('input');

          surveyInput.type = 'checkbox';
          surveyInput.name = surveyId;
          surveyInput.value = surveyId;
          surveyInput.id = surveyId;
          if (i === geography.surveys.length - 1) {
            surveyInput.className = 'country-round latest';
          } else {
            surveyInput.className = 'country-round';
          }

          let surveyInputLabel = Utility.createNode('label');

          surveyInputLabel.setAttribute('data-key', survey["label.id"]);
          surveyInputLabel.className = 'i18nable';
          surveyInputLabel.htmlFor = surveyId;
          surveyInputLabel.innerHTML = surveyName;

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
        if (key.startsWith('styles.')){
          $('#'+key.substr(7)).val(sessionStorage.getItem(key));
        }
      }
    }

    /* Set Default Value and Placeholder of Chart Title and Axis Label */
    const chart_type = sessionStorage.getItem('chart-type');

    const chart_title = sessionStorage.getItem('chart-title');
    $('.chart-style-wrapper #chart-title').val(chart_title);
    $('.chart-style-wrapper #chart-title').attr('placeholder', chart_title);

    const chart_axis_label = sessionStorage.getItem('chart-axis-label');
    const selector_valid_axis = '.chart-style-wrapper #'+(chart_type=='bar' ? 'x' : 'y')+'-axis-label';
    $(selector_valid_axis).val(chart_axis_label);
    $(selector_valid_axis).attr('placeholder', chart_axis_label);
    $('.chart-style-wrapper #'+(chart_type=='bar' ? 'y' : 'x')+'-axis-label').val('');

    /* Set the switch of black and white */
    $('#dataset_black_and_white').prop('checked', sessionStorage.getItem('switch.bw')==="true");

    if (chart_type=="pie") {
      $('.no-pie').hide();
    }
    else {
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

      $('.selectpicker').selectpicker('refresh');
      if (URLParse.getQuery() !== false)
      {
          const query = URLParse.parseQuery();
          $('#select-indicator-group').selectpicker('val', query['indicators']);
          $('#select-characteristic-group').selectpicker('val', query['characteristicGroups']);
          $('#chart-types #option-'+query['chartType']).click();
          const selectedCountries = query['surveyCountries'].split(',');
          selectedCountries.forEach(country_id => {
            $('#'+country_id).click();
          });
          if (query['overTime']=='true'){
            $('#dataset_overtime').prop('checked', true);
            $('#dataset_overtime').prop('disabled', false);
          }
          chart.data(query).then(()=>{
            this.initializeStyles();
          });
      }
    });
  }
}
