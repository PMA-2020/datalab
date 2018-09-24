import Utility from './utility';
import Selectors from './selectors';

/**
 * Handle i18n translation of items on the page designated
 * with the class `i18nable`
 */
export default class Translate {
  /**
   * Translate the items passed in
   * @private
   */
  static google_translate_api_key = 'AIzaSyDfvRtTJrdWsLgcnu6shuW-4-YWE_fiFxI';
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

  static translateByGoogle() {
      const selectorArray = [
          '.prefooter-row', 
          '.chart-placeholder', 
          '#footer-inner .footer-translatable', 
          '#superfish-1',
          '#block-menu-menu-secondary-menu ul.menu'
      ];
      const lang = Selectors.getSelectedLanguage();

      selectorArray.forEach(s => {
          const string = $(s).html();
          this.google_translate(string, lang).then(data => {
            const translatedValue = data.data.translations[0].translatedText;// utility.getStringById(key);
            $(s).html(translatedValue);
          });
      });
  }

  /**
   * Run the translation across all i18nable items
   */
  static translatePage() {
    const items = $(".i18nable").not($("a.opt.i18nable"));
    this.runTranslate(items);
    this.translateOptGroup();
    this.translateByGoogle();

    $('.selectpicker').selectpicker('refresh');
  }

  static google_translate(q, lang) {
    return new Promise(resolve => {
      $.ajax({
          url: 'https://translation.googleapis.com/language/translate/v2',
          type: 'POST',
          data: {
            key: this.google_translate_api_key,
            q: q,
            target: lang
          },
          success: function(data) {
            resolve(data);
          }
      });
    })
  }

  /*static google_translate_support_lang() {
    return new Promise(resolve => {
      $.ajax({
        url: 'https://translation.googleapis.com/language/translate/v2/languages',
        data: {
          key: this.google_translate_api_key,
          target: 'en'
        },
        success: function(data) {
          resolve(data);
        }
      });
    });
  }*/
}
