const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const config = require('./config');
const { contracts } = require('./compile');

const User = contracts.User.User;
console.log(User.abi);
const provider = new HDWalletProvider(
  config.providerSecret,
  config.providerURL,
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(User.abi)
    .deploy({ data: '0x' + User.evm.bytecode.object, arguments: [] })
    .send({ gas: '5000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};

deploy();
