import { expect } from 'chai';

import env from '../../env';
import Network from '../../source/javascripts/network';

describe('buildUrl', () => {
  it('should return the base url cleanly', () => {
    const network = new Network();
    const result = network.buildUrl("");
    expect(result).to.equal(`${env.api_url}/v1/`);
  });

  it('should return the query params', () => {
    const network = new Network();
    const result = network.buildUrl("", { key: 'value' });
    expect(result).to.equal(`${env.api_url}/v1/?key=value&`);
  });

  it('should use canned responses', () => {
    expect(__json__['test/fixtures/network/base']).to.deep.equal({ data: [1,2,3] });
  });
});
