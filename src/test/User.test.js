const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);
const { contracts } = require('../compile');

let accounts;
let user;

const User = contracts.User.User;

before(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  // console.log(abi);
  user = await new web3.eth.Contract(User.abi)
    .deploy({ data: User.evm.bytecode.object, arguments: [] })
    .send({ from: accounts[0], gas:'1000000' });
});

describe('User', () => {
  it('deploys a contract', () => {
    assert.ok(user.options.address);
  });

  it('set a user and hash and gets the hash value', async () => {
    await user.methods.setHash('foo', 'bar').send({ from: accounts[0] })

    const hashVal = await user.methods.getHash('foo').call();
    assert.equal(hashVal, 'bar');
  });
});
