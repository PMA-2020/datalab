import network from './network';
import utility from './utility';

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

const initializeLanguage = (languages) => {
  for(var k in languages) {
    let opt = utility.createNode('option');
    opt.value = k;
    opt.innerHTML = languages[k];
    $('#select-language').append(opt);
  }
};

const initialize = () => {
  network.get("datalab/init").then(res => {
    initializeLanguage(res.results.languages);
    initializeCharacteristicGroups(res.results);
    initializeIndicators(res.results);
  });
};

const chart = {
  initialize,
};

export default chart;
