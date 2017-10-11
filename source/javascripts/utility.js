import selectors from './selectors';

const loadStringsFromLocalStorage = () => JSON.parse(localStorage.getItem('pma2020Strings'));
const createNode = el => document.createElement(el);
const append = (parent, el) => parent.appendChild(el);

const getDefinition = item => {
  const definitionId = item.dataset.definitionId;
  const itemNameId = item.dataset.labelId;

  if (definitionId && itemNameId) {
    const definition = getStringById(definitionId);
    const itemName = getStringById(itemNameId);
    return `${itemName}: ${definition}`;
  } else {
    return '';
  }
};

const setDefinitionText = () => {
  const selectedIndicator = getSelectedItem('select-indicator-group');
  const selectedCharacteristicGroup = getSelectedItem('select-characteristic-group');

  $(".help-definition.indicator-group").html(getDefinition(selectedIndicator));
  $(".help-definition.characteristic-group").html(getDefinition(selectedCharacteristicGroup));
};

const getSelectedLanguage = () => $('#select-language option:selected').val();

const getOverrideValue = (id, fallback) => {
  const overRideValue = document.getElementById(id).value;
  return overRideValue || fallback;
};

const getString = item => {
  const labelId = item['label.id'];
  return getStringById(labelId);
};

const getStringById = labelId => {
  const strings = loadStringsFromLocalStorage();
  const lang = selectors.getSelectedLanguage();
  const string = strings[labelId];
  if (string) {
    const enString = string['en'];
    return string[lang] || enString;
  } else {
    console.log(`No String for "${labelId}"`);
    return false;
  }
};

const parseDate = (date) => {
  const splitDate = date.split("-");
  if (splitDate.length === 2) {
    return new Date(splitDate[1], splitDate[0] - 1, 1).getTime();
  } else {
    return new Date(date).getTime();
  }
};

const utility = {
  createNode,
  append,
  parseDate,
  getString,
  getStringById,
  getOverrideValue,
  setDefinitionText,
};

export default utility;
