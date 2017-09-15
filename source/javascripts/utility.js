function multiSeries() {
  var countries = selectedData().countries;
  var years = selectedData().years;
  return (countries.length >= 1 && years.length > 1);
};


const loadStringsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('pma2020Strings'));
};

const createNode = el => document.createElement(el);

const append = (parent, el) => parent.appendChild(el);

const getSelectedLanguage = () => $('#select-language option:selected').val();

const flattenHash = (hsh, key) => {
  return hsh.reduce((a, b) => ( [...a, ...b[key]]), []);
};

const rekeyHash = (currentHash, format) => {
  const key = format.key;
  const value = format.value;

  const newHash = {};

  currentHash.forEach(item => { newHash[item[key]] = item[value]; });

  return newHash;
};

const getLabelIdFromId = id => {
  return JSON.parse(localStorage.getItem('idToLabel'))[id];
};

const getString = item => {
  const strings = loadStringsFromLocalStorage();
  const labelId = item['label.id'];
  const lang = getSelectedLanguage();
  const enString = strings[labelId]['en'];

  return strings[labelId][lang] || enString;
};

const getStringById = labelId => {
  const strings = loadStringsFromLocalStorage();
  const lang = getSelectedLanguage();
  const enString = strings[labelId]['en'];

  return strings[labelId][lang] || enString;
};

const getSelectedValue = id => {
  const el = document.getElementById(id);
  const selectedVal = el.options[el.selectedIndex].value;
  return selectedVal;
};

const getSelectedText = id => {
  const el = document.getElementById(id);
  const selectedVal = el.options[el.selectedIndex].text;
  return selectedVal;
};

const getSelectedCountryRounds = () => {
  const countries = [];
  const checkboxes = $("#countryRoundModal input[type=checkbox]:checked");

  checkboxes.map(checkbox => {
    countries.push(checkboxes[checkbox].value);
  });

  return countries;
};

const getSelectedChartType = () => {
  return $("#chart-types label.active input").data("type");
};

const utility = {
  createNode,
  append,
  getSelectedLanguage,
  getString,
  getStringById,
  getSelectedValue,
  getSelectedText,
  getSelectedChartType,
  getSelectedCountryRounds,
  rekeyHash,
  flattenHash,
  getLabelIdFromId,
};

export default utility;
