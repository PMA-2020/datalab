import 'bootstrap';
import 'bootstrap-select';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-select/dist/css/bootstrap-select.css';
import 'font-awesome/css/font-awesome.css';

import chart from './chart';
import interaction from './interaction';
import validation from './validation';
import utility from './utility';
import translate from './translate';
import definitions from './definitions';

$(function() {
  chart.initialize();

  $("#select-language").change((e) => (translate.translatePage()));

  $(".clear-input").click((e) => {
    validation.checkCharting();
    const clearId = e.target.dataset.type;

    $(`#select-${clearId}`).selectpicker('val', '');
    $(`.help-definition.${clearId}`).html('');
    $('.selectpicker').selectpicker('refresh');

    chart.surveyCombo();
    validation.checkCharting();
  });

  $("#finishCountryRoundModal").click(() => {
    interaction.finishModal();
    validation.checkOverTime();
    validation.checkBlackAndWhite();
    validation.checkCharting();
    validation.checkPie();
    chart.surveyCombo();
  });

  $("#select-indicator-group").change(() => {
    chart.indicatorCombo();
    validation.checkCharting();
    definitions.setDefinitionText();
  });

  $("#select-characteristic-group").change(() => {
    chart.characteristicGroupCombo();
    validation.checkCharting();
    definitions.setDefinitionText();
  });

  $("#select-all").click(() => (interaction.selectAll()));
  $("#select-latest").click(() => (interaction.selectLatest()));
  $("#clear-all").click(() => (interaction.clear()));
  $("#dataset_overtime").click(() => (validation.checkBlackAndWhite()));
  $("#closeCountryRoundModal").click(() => (interaction.closeModal()));
  $("#chart-types input").click(() => (validation.checkCharting()));
  $("#submit-chart").click(() => (chart.data()));
});
