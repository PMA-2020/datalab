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
  let overRideValue = document.getElementById(id).value;
  if (!!localStorage.saved_style && localStorage.saved_style==1)
      overRideValue = localStorage.getItem('styles.'+id);
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
    if (labelId !== undefined) { console.log(`No String for "${labelId}"`) }
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
