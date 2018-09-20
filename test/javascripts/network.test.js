import chai, { expect } from 'chai';
import spies from 'chai-spies';

chai.use(spies);

import env from '../../env';
import Network from '../../source/javascripts/network';

describe('buildUrl', () => {
  it('should return the base url cleanly', () => {
    const network = new Network();
    const result = network.buildUrl("");
    expect(result).to.equal(`${env.api_url}/v1/`);
  });

  it('should return a single query param', () => {
    const network = new Network();
    const result = network.buildUrl("", { key: 'value' });
    expect(result).to.equal(`${env.api_url}/v1/?key=value`);
  });
  
  it('should return multiple query params joined with `&`', () => {
    const network = new Network();
    const result = network.buildUrl("", { foo: 'bar', baz: 2 });
    expect(result).to.equal(`${env.api_url}/v1/?foo=bar&baz=2`);
  });
});
