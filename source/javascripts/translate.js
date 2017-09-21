import utility from './utility';

const runTranslate = (items, type) => {
  items.each(i => {
    const item = items[i];
    const key = item.dataset.key;
    const translatedValue = utility.getStringById(key);

    if (translatedValue) {
      if (type === 'optgroup') {
        item.label = translatedValue;
      } else {
        item.innerHTML = translatedValue;
      }
    }
  });
};

const translateOptGroup = () => {
  const items = $(".i18nable-optgroup");
  runTranslate(items, 'optgroup');
};

const translatePage = () => {
  const items = $(".i18nable");
  runTranslate(items, 'optgroup');
  translateOptGroup();

  $('.selectpicker').selectpicker('refresh');
};

const translate = {
  translatePage,
};

export default translate;
