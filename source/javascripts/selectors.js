const getSelectedLanguage = () => $('#select-language option:selected').val();
const getSelectedValue = id => getSelectedItem(id).value;
const getSelectedText = id => getSelectedItem(id).text;
const getSelectedChartType = () => $("#chart-types label.active input").data("type");

const getSelectedItem = id => {
  const el = document.getElementById(id);
  const selectedVal = el.options[el.selectedIndex];

  return selectedVal;
}

const getSelectedCountryRounds = () => {
  const countries = [];
  const checkboxes = $("#countryRoundModal input[type=checkbox]:checked");

  checkboxes.map(checkbox => {
    countries.push(checkboxes[checkbox].value);
  });

  return countries;
};

const selectors = {
  getSelectedItem,
  getSelectedLanguage,
  getSelectedValue,
  getSelectedText,
  getSelectedChartType,
  getSelectedCountryRounds,
};

export default selectors;
