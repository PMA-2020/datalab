import 'bootstrap';
import 'bootstrap-select';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-select/dist/css/bootstrap-select.css';
import 'bootstrap-colorpicker';
import 'font-awesome/css/font-awesome.css';

import chart from './chart';
import combo from './combo';
import interaction from './interaction';
import validation from './validation';
import utility from './utility';
import translate from './translate';

$(function() {
  chart.initialize();

  $("#select-language").change((e) => (translate.translatePage()));

  $(".clear-input").click((e) => {
    validation.checkCharting();
    const clearId = e.target.dataset.type;

    $(`#select-${clearId}`).selectpicker('val', '');
    $(`.help-definition.${clearId}`).html('');

    combo.filter();
  });

  $("#finishCountryRoundModal").click(() => {
    interaction.finishModal();
    validation.checkOverTime();
    validation.checkBlackAndWhite();
    validation.checkCharting();
    validation.checkPie();
    combo.filter();
  });
  $("#select-indicator-group").change(() => {
    combo.filter();
    validation.checkCharting();
    utility.setDefinitionText();
  });
  $("#select-characteristic-group").change(() => {
    combo.filter();
    validation.checkCharting();
    utility.setDefinitionText();
  });
  $('.colorpicker').colorpicker();
  $("#select-all").click(() => (interaction.selectAll()));
  $("#select-latest").click(() => (interaction.selectLatest()));
  $("#clear-all").click(() => (interaction.clear()));
  $("#dataset_overtime").click(() => (validation.checkBlackAndWhite()));
  $("#closeCountryRoundModal").click(() => (interaction.closeModal()));
  $("#chart-types input").click(() => (validation.checkCharting()));
  $("#submit-chart").click(() => (chart.data()));
});
