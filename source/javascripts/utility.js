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

const createNode = el => document.createElement(el);
const append = (parent, el) => parent.appendChild(el);
const getSelectedLanguage = () => $('#select-language option:selected').val();

const utility = {
  createNode,
  append,
  getSelectedLanguage,
};

export default utility;
