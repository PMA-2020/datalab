import network from './network';
import utility from './utility';

const initializeStrings = (strings) => {
  if (typeof(Storage) !== "undefined") {
    localStorage.removeItem('pma2020Strings', strings);
    localStorage.pma2020Strings = JSON.stringify(strings);
  } else {
    console.log('Warning: Local Storage is unavailable.');
  }
};

const initializeLanguage = (languages) => {
  for(var k in languages) {
    let opt = utility.createNode('option');
    opt.value = k;
    opt.innerHTML = languages[k];
    $('#select-language').append(opt);
  }
};

const initializeCharacteristicGroups = (characteristicGroups) => {
  characteristicGroups.forEach(group => {
    const optGroupName = utility.getString(group);
    let optGroup = utility.createNode('optgroup');

    optGroup.label = optGroupName;
    optGroup.className = 'i18nable-optgroup';
    optGroup.setAttribute('data-key', group["label.id"]);

    group.characteristicGroups.forEach(characteristic => {
      let opt = utility.createNode('option');

      opt.value = characteristic.id;
      opt.className = 'i18nable';
      opt.setAttribute('data-definition-id', characteristic["definition.id"]);
      opt.setAttribute('data-label-id', characteristic["label.id"]);
      opt.setAttribute('data-key', characteristic["label.id"]);
      opt.innerHTML = utility.getString(characteristic);
      optGroup.append(opt);
    });

    $('#select-characteristic-group').append(optGroup);
  });
};

const initializeIndicators = (indicators) => {
  indicators.forEach(group => {
    const optGroupName = utility.getString(group);
    let optGroup = utility.createNode('optgroup');

    optGroup.label = optGroupName;
    optGroup.className = 'i18nable-optgroup';
    optGroup.setAttribute('data-key', group["label.id"]);

    group.indicators.forEach(indicator => {
      let opt = utility.createNode('option');

      opt.value = indicator.id;
      opt.className = 'i18nable';
      opt.setAttribute('data-definition-id', indicator["definition.id"]);
      opt.setAttribute('data-label-id', indicator["label.id"]);
      opt.setAttribute('data-key', indicator["label.id"]);
      opt.innerHTML = utility.getString(indicator);
      optGroup.append(opt);
    });

    $('#select-indicator-group').append(optGroup);
  });
};

const initializeSurveyCountries = (surveyCountries) => {
  const language = utility.getSelectedLanguage();

  surveyCountries.forEach(country => {
    const countryName = utility.getString(country);
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

    panelLink.href = `#collapse${country["label.id"]}`
    panelLink.setAttribute('role', 'button');
    panelLink.setAttribute('data-toggle', 'collapse');
    panelLink.setAttribute('data-parent', '#accordion');
    panelLink.innerHTML = countryName;

    panelTitle.append(panelLink);
    panelHeading.append(panelTitle);
    panelContainer.append(panelHeading);

    panelBodyContainer.id = `collapse${country["label.id"]}`;
    panelBodyContainer.className = 'panel-collapse collapse';

    panelBody.className = 'panel-body';

    country.geographies.forEach(geography => {
      const geographyName = utility.getString(geography);

      let listHeader = utility.createNode('h4');

      listHeader.innerHTML = geographyName;

      panelBody.append(listHeader);

      geography.surveys.forEach(survey => {
        const surveyName = utility.getString(survey);
        const surveyId = survey["id"];

        let listItem  = utility.createNode('div');
        let surveyInput = utility.createNode('input');

        surveyInput.type = 'checkbox';
        surveyInput.name = surveyId;
        surveyInput.value = surveyId;
        surveyInput.id = surveyId;
        surveyInput.className = 'country-round';

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
    initializeStrings(res.strings);
    initializeLanguage(res.languages);
    initializeCharacteristicGroups(res.characteristicGroupCategories);
    initializeIndicators(res.indicatorCategories);
    initializeSurveyCountries(res.surveyCountries);

    $('.selectpicker').selectpicker('refresh');
  });
};

const initialization = {
  initialize,
};

export default initialization;
