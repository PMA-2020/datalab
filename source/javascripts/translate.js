import Utility from './utility';

/**
 * Handle i18n translation of items on the page designated
 * with the class `i18nable`
 */
export default class Translate {
  /**
   * Translate the items passed in
   * @private
   */
  static runTranslate(items, type) {
    items.each(i => {
      const item = items[i];
      const key = item.dataset.key;
      const translatedValue = Utility.getStringById(key);

      if (translatedValue) {
        if (type === 'optgroup') {
          item.label = translatedValue;
        } else {
          item.innerHTML = translatedValue;
        }
      }
    });
  }

  /**
   * Translate the option group content
   * @private
   */
  static translateOptGroup() {
    const items = $(".i18nable-optgroup").not($("a.opt.i18nable"));
    this.runTranslate(items, 'optgroup');
  }

  /**
   * Run the translation across all i18nable items
   */
  static translatePage() {
    const items = $(".i18nable").not($("a.opt.i18nable"));
    this.runTranslate(items);
    this.translateOptGroup();

    $('.selectpicker').selectpicker('refresh');
  }
}
