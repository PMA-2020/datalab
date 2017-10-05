import utility from './utility';

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
