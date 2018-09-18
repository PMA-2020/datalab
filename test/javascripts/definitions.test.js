import chai, { expect } from 'chai';
import spies from 'chai-spies';

chai.use(spies);

import Definitions from '../../source/javascripts/definitions';
import Utility from '../../source/javascripts/utility';

describe('getDefinition', () => {
  after(() => {
    chai.spy.restore(Utility);
  });

  it('should return an empty string if `definitionId` or `itemNameId` are not present', () => {
    const item = { dataset: {} };
    const definition = Definitions.getDefinition(item);
    expect(definition).to.equal('');
  });

  it('should return a name and definition separated by a colon when a definition is found', () => {
    chai.spy.on(Utility, 'getStringById', id => id);
    const item = { dataset: { definitionId: 'definition', labelId: 'label' } };
    const definition = Definitions.getDefinition(item);
    expect(definition).to.equal('label: definition');
  });
});

