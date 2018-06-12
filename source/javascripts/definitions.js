import Utility from './utility';
import Selectors from './selectors';

/**
 * Method to set help definition text based on selections
 */
export default class Definitions {

  /**
   * Updates help definition text based on indicator
   * and characteristic group
   */
  static setDefinitionText() {
    const selectedIndicator = Selectors.getSelectedItem('select-indicator-group');
    const selectedCharacteristicGroup = Selectors.getSelectedItem('select-characteristic-group');

    $(".help-definition.indicator-group").html(this.getDefinition(selectedIndicator));
    $(".help-definition.characteristic-group").html(this.getDefinition(selectedCharacteristicGroup));
  }

  /**
   * @private
   */
  static getDefinition(item) {
    const definitionId = item.dataset.definitionId;
    const itemNameId = item.dataset.labelId;

    if (definitionId && itemNameId) {
      const definition = Utility.getStringById(definitionId);
      const itemName = Utility.getStringById(itemNameId);
      return `${itemName}: ${definition}`;
    } else {
      return '';
    }
  }
}
