import network from './network';
import utility from './utility';

const initializeIndicators = (indicators, strings) => {
  const language = utility.getSelectedLanguage();

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

const initializeCharacteristicGroups = (characteristicGroups, strings) => {
  const language = utility.getSelectedLanguage();

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
    initializeLanguage(res.languages);
    initializeCharacteristicGroups(res.characteristicGroupCategories, res.strings);
    initializeIndicators(res.indicatorCategories, res.strings);
  });
};

const chart = {
  initialize,
};

export default chart;
