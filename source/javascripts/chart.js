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
    let countryHeader = utility.createNode('h3');
    let container  = utility.createNode('div');

    countryHeader.innerHTML = countryName;

    country.geographies.forEach(geography => {
      const geographyName = utility.getString(strings, geography["geography.label.id"]);

      let listHeader = utility.createNode('h4');
      let list  = utility.createNode('ul');

      listHeader.innerHTML = geographyName;

      geography.surveys.forEach(survey => {
        const surveyName = utility.getString(strings, survey["label.id"]);
        const surveyId = survey["id"];

        let listItem  = utility.createNode('li');
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
        list.append(listItem);
      });

      container.append(listHeader);
      container.append(list);
    });

    $('#countryRoundModal .modal-body').append(countryHeader);
    $('#countryRoundModal .modal-body').append(container);
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
