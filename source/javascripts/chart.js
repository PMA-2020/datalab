import network from './network';
import utility from './utility';

const initializeLanguage = (languages) => {
  for(var k in languages) {
    let opt = utility.createNode('option');
    opt.value = k;
    opt.innerHTML = languages[k];
    $('#select-language').append(opt);
  }
};

const initializeCharacteristicGroups = (response) => {
  const characteristicGroups = response.characteristicGroupCategories;
  const language = utility.getSelectedLanguage();
  const strings = response.strings;

  characteristicGroups.forEach(group => {
    const optGroupName = strings[group["category.label.id"]][language];
    let optGroup = utility.createNode('optgroup');

    optGroup.label = optGroupName;

    group.characteristicGroups.forEach(characteristic => {
      let opt = utility.createNode('option');

      opt.innerHTML = strings[characteristic["label.id"]][language];
      optGroup.append(opt);
    });

    $('#select-characteristic-group').append(optGroup);
  });
};

const initializeIndicators = (response) => {
  const indicators = response.indicatorCategories;
  const language = utility.getSelectedLanguage();
  const strings = response.strings;

  indicators.forEach(group => {
    const optGroupName = strings[group["category.label.id"]][language];
    let optGroup = utility.createNode('optgroup');

    optGroup.label = optGroupName;

    group.indicators.forEach(indicator => {
      let opt = utility.createNode('option');

      opt.innerHTML = strings[indicator["label.id"]][language];
      optGroup.append(opt);
    });

    $('#select-indicator-group').append(optGroup);
  });
};

const initializeSurveyCountries = (response) => {
  const surveyCountries = response.surveyCountries;
  const language = utility.getSelectedLanguage();
  const strings = response.strings;

  surveyCountries.forEach(country => {
    const countryName = utility.getString(strings, country["country.label.id"]);
    let panelContainer  = utility.createNode('div');

    let panelHeading  = utility.createNode('div');
    let panelTitle  = utility.createNode('div');
    let panelLink  = utility.createNode('a');

    let panelBodyContainer  = utility.createNode('div');
    let panelBody  = utility.createNode('div');

    panelContainer.className = 'panel panel-default';

    panelHeading.className = 'panel-heading';
    panelHeading.setAttribute('role', 'tab');
    panelHeading.id = countryName;

    panelTitle.className = 'panel-title';

    panelLink.href = `#collapse${countryName}`
    panelLink.setAttribute('role', 'button');
    panelLink.setAttribute('data-toggle', 'collapse');
    panelLink.setAttribute('data-parent', '#accordion');
    panelLink.innerHTML = countryName;

    panelTitle.append(panelLink);
    panelHeading.append(panelTitle);
    panelContainer.append(panelHeading);

    panelBodyContainer.id = `collapse${countryName}`;
    panelBodyContainer.className = 'panel-collapse collapse';

    panelBody.className = 'panel-body';

    country.geographies.forEach(geography => {
      const geographyName = utility.getString(strings, geography["geography.label.id"]);

      let listHeader = utility.createNode('h4');

      listHeader.innerHTML = geographyName;

      panelBody.append(listHeader);

      geography.surveys.forEach(survey => {
        const surveyName = utility.getString(strings, survey["label.id"]);
        const surveyId = survey["id"];

        let listItem  = utility.createNode('div');
        let surveyInput = utility.createNode('input');

        surveyInput.type = 'checkbox';
        surveyInput.name = surveyId;
        surveyInput.value = surveyId;
        surveyInput.id = surveyId;

        let surveyInputLabel = utility.createNode('label');

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
};

const initialize = () => {
  network.get("datalab/init").then(res => {
    initializeLanguage(res.languages);
    initializeCharacteristicGroups(res);
    initializeIndicators(res);
    initializeSurveyCountries(res);
  });
};

const chart = {
  initialize,
};

export default chart;
