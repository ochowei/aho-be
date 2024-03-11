const { expect } = require('chai');
const helper = require('./helper');
const { models } = require('../../models');

describe('test createUser&comparePassword', () => {
  afterEach(async () => {
    await models.User.destroy({ where: {} });
    await models.UserAuth.destroy({ where: {} });
  });
  it('createUser&comparePassword', async () => {
    const email = 'fakeemail';
    const password = 'fakepassword';
    await helper.createUser(email, password);
    const comparePassword = await helper.comparePassword(email, password);
    let error;

    try {
      await helper.comparePassword(email, 'wrongpassword');
    } catch (err) {
      error = err;
    }

    expect(!!comparePassword).to.equal(true);
    expect(!!error).to.equal(true);
  });
});
