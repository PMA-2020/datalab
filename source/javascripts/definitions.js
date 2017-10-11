import utility from './utility';
import selectors from './selectors';

const getDefinition = item => {
  const definitionId = item.dataset.definitionId;
  const itemNameId = item.dataset.labelId;

  if (definitionId && itemNameId) {
    const definition = utility.getStringById(definitionId);
    const itemName = utility.getStringById(itemNameId);
    return `${itemName}: ${definition}`;
  } else {
    return '';
  }
};

const setDefinitionText = () => {
  const selectedIndicator = selectors.getSelectedItem('select-indicator-group');
  const selectedCharacteristicGroup = selectors.getSelectedItem('select-characteristic-group');

  $(".help-definition.indicator-group").html(getDefinition(selectedIndicator));
  $(".help-definition.characteristic-group").html(getDefinition(selectedCharacteristicGroup));
};

const definitions = {
  setDefinitionText,
};

export default definitions;
