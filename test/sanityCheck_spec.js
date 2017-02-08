import { expect } from 'chai';
import setup from '../';

describe('mocha', () => {
  it('runs a test', () => {
    expect(5).to.eql(5);
  });

  it('runs the boilerplate function', () => {
    expect(setup()).to.eql('hello, world');
  });
});
