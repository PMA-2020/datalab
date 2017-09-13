import utility from './utility';

function clearSelect(el) {
  var select = el.data('id');
  $('#' + select).prop('selectedIndex', 0);
  $('#' + select).selectpicker('deselectAll');
  validateFilters();
}

function resetChart() {
  if (confirm('Are you sure you want to reset the chart styles?')) {
    $(".tab-pane#style").find("input[type=text], textarea").val("");
    $(".color").attr('style', '');
    $(".bfh-selectbox").val($(".bfh-selectbox").data('font'));
    generateChart();
    $('#download-csv').prop('disabled', '');
  };
};

const selectAll = () => {
  $('#countryRoundModal .collapse.in input[type=checkbox]').prop('checked', true);
};

const selectLatest = () => {
  $('#countryRoundModal .collapse input[type=checkbox]').prop('checked', false);
  const openCollapse = $('#countryRoundModal .collapse.in');
  openCollapse.each(collapse => {
    const currentCollapse = openCollapse[collapse];
    $(currentCollapse).find('input[type=checkbox]').last().prop('checked', true);
  });
};

const clear = () => {
  $('#countryRoundModal .collapse input[type=checkbox]').prop('checked', false);
};

const closeModal = () => {
  const previouslySelectedCountryRounds = localStorage.getItem('selectedCountryRounds').split(",");

  clear();

  previouslySelectedCountryRounds.forEach(countryRound => {
    $(`#countryRoundModal .collapse.in input[value=${countryRound}]`).prop('checked', true);
  });
};

const finishModal = () => {
  if (typeof(Storage) !== "undefined") {
    localStorage.removeItem('selectedCountryRounds');
    localStorage.selectedCountryRounds = utility.getSelectedCountryRounds();
  } else {
    console.log('Warning: Local Storage is unavailable.');
  }
}

const interaction = {
  selectAll,
  selectLatest,
  clear,
  closeModal,
  finishModal,
};

export default interaction;
