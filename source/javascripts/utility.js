function isArray(obj) { return Object.prototype.toString.call(obj) === '[object Array]'; };
function keyify(text) {
  if(typeof text === 'undefined' || text == ''){
    console.log('Warning text may be blank!');
  } else {
    return text.toLowerCase().replace(/ /g, '_');
  }
}

function appendToHash(hsh, key, value) {
  if (hsh[key] == null || hsh[key] == {}) { hsh[key] = [value]; }
  else { hsh[key].push(value) }
  return hsh;
};

function multiSeries() {
  var countries = selectedData().countries;
  var years = selectedData().years;
  return (countries.length >= 1 && years.length > 1);
};

function checkValue(value) {
  if(value == null || (value.length == 1 && value.indexOf(".") >= 0)) { return null; }
  return value;
};

function scrollToAnchor(aid){
  $('html, body').animate({
    scrollTop: $(aid).offset().top
  }, 500);
  return false;
};

function titleCase(string) {
  if (string == null) { return null; } else {
    return (string.charAt(0).toUpperCase() + string.slice(1)).replace(/_/g, " ");
  }
}

function humanize(string) {
  if (string == null) { return null; } else {
    return string.toLowerCase().replace(/_/g, " ");
  }
}

function isNullSeries(series) {
  return series.every(function(v){return (v == null || isNaN(v))});
}

function dataValues(hsh) {
  var values = [];
  for(var k in hsh) { values.push(hsh[k].y); }
  return values;
}

const loadStringsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('pma2020Strings'));
};
const createNode = el => document.createElement(el);
const append = (parent, el) => parent.appendChild(el);
const getSelectedLanguage = () => $('#select-language option:selected').val();
const getString = (item) => {
  const strings = loadStringsFromLocalStorage();
  const labelId = item['label.id'];
  const lang = getSelectedLanguage();
  const enString = strings[labelId]['en'];
  return strings[labelId][lang] || enString;
};
const getStringById = (labelId) => {
  const strings = loadStringsFromLocalStorage();
  const lang = getSelectedLanguage();
  const enString = strings[labelId]['en'];
  return strings[labelId][lang] || enString;
};
const getSelectedValue = (id) => {
  const el = document.getElementById(id);
  const selectedVal = el.options[el.selectedIndex].value;
  return selectedVal;
};
const getSelectedText = (id) => {
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
  return $("#chart-type label.active input").data("type");
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
};

export default utility;
