import chai, { expect } from 'chai';
import spies from 'chai-spies';

chai.use(spies);

import Utility from '../../source/javascripts/utility';

describe('getOverrideValue', () => {
  afterEach(() => {
    chai.spy.restore(sessionStorage);
    chai.spy.restore(document);
  });

  it('should return a fallback value if no value exists', () => {
    chai.spy.on(document, 'getElementById', id => ({}));
    chai.spy.on(sessionStorage, 'saved_style', () => false);
    const overrideValue = Utility.getOverrideValue(null, true);
    expect(overrideValue).to.equal(true);
  });

  it('should return an override style if one is found in the DOM', () => {
    chai.spy.on(document, 'getElementById', id => ({ value: 'red' }));
    chai.spy.on(sessionStorage, 'saved_style', () => false);
    const overrideValue = Utility.getOverrideValue(null, null);
    expect(overrideValue).to.equal('red');
  });

  it('should return a saved style from localStorage if that exists', () => {
    chai.spy.on(document, 'getElementById', id => ({}));
    chai.spy.on(sessionStorage, 'getItem', (id) => {
      if (id === 'saved_style') {
        return 1;
      }
      return 'red';
    });
    const overrideValue = Utility.getOverrideValue(null, null);
    expect(overrideValue).to.equal('red');
  });
});

describe('getStringById', () => {
  afterEach(() => {
    chai.spy.restore(Utility);
  });

  it('should return false if no matching string is found for an id', () => {
    chai.spy.on(Utility, 'loadStringsFromSessionStorage', () => ({}));
    chai.spy.on(Utility, 'getSelectedLanguage', () => 'en');
    const string = Utility.getStringById('label');
    expect(string).to.equal(false);
  });

  it('should return a specific language string if available', () => {
    chai.spy.on(Utility, 'loadStringsFromSessionStorage', () => ({label: {en: 'label', es: 'etiqueta'}}));
    chai.spy.on(Utility, 'getSelectedLanguage', () => 'es');
    const string = Utility.getStringById('label');
    expect(string).to.equal('etiqueta');
  });

  it('should return an english string if a language specific one is not found', () => {
    chai.spy.on(Utility, 'loadStringsFromSessionStorage', () => ({label: {en: 'label' }}));
    chai.spy.on(Utility, 'getSelectedLanguage', () => 'es');
    const string = Utility.getStringById('label');
    expect(string).to.equal('label');
  });
});

describe('parseDate', () => {
  it('should parse dates as the first of the month if only year and month are provided', () => {
    const date = '01-2018';
    const parsedDate = Utility.parseDate(date);
    expect(parsedDate).to.equal(new Date(2018, 0, 1).getTime());
  });

  it('should handle full dates', () => {
    const date = '01-01-2018';
    const parsedDate = Utility.parseDate(date);
    expect(parsedDate).to.equal(new Date(date).getTime());
  });
});

describe('getDefinition', () => {
  after(() => {
    chai.spy.restore(Utility);
  });

  it('should return an empty string if either definitionId or itemNameId are not present', () => {
    const item = {dataset: {}};
    const definition = Utility.getDefinition(item);
    expect(definition).to.equal('');
  });

  it('should return an item name and definition, separated by a colon if both exist', () => {
    chai.spy.on(Utility, 'getStringById', id => id);
    const item = {dataset: {definitionId: 'definition', labelId: 'label'}};
    const definition = Utility.getDefinition(item);
    expect(definition).to.equal('label: definition');
  });
});
