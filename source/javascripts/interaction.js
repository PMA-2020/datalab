import utility from './utility';
import selectors from './selectors';

const selectAll = () => {
  $('#countryRoundModal .collapse.in input[type=checkbox]').prop('checked', true);
};

const selectLatest = () => {
  $('#countryRoundModal .collapse input[type=checkbox]').prop('checked', false);
  $("#countryRoundModal .collapse.in .country-round.latest").prop('checked', true);
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
    localStorage.selectedCountryRounds = selectors.getSelectedCountryRounds();
  } else {
    console.log('Warning: Local Storage is unavailable.');
  }
}

const resetChart = () => {
  if (confirm('Are you sure you want to reset the chart styles?')) {
    $(".tab-pane#style").find("input[type=text], textarea").val("");
    generateChart();
  };
}

const interaction = {
  selectAll,
  selectLatest,
  clear,
  closeModal,
  finishModal,
  resetChart,
};

export default interaction;
