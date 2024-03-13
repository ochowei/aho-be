const { expect } = require('chai');
const { summaryUsers } = require('./dashboardHelper');

describe('test summaryUsers', () => {
  it('basic', async () => {
    const summary = await summaryUsers('sub');
    expect(summary).to.be.an('object');
    expect(summary).to.have.property('userCount');
    expect(summary).to.have.property('userSessionCount');
    expect(summary.userSessionCount).to.have.property('todayTotal');
    expect(summary.userSessionCount).to.have.property('last7DaysAverage');
    expect(summary.userSessionCount.last7DaysAverage).to.be.equals(0);
  });
});
