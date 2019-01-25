const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const abi = require('./abi');
const config = require('./config');

if (!config) {
    throw new Error('No config found');
}

const provider = new HDWalletProvider(
    config.providerSecret,
    config.providerURL,
);
const web3 = new Web3(provider);

const contractAddress = config.contractAddress;

module.exports = {
    getIdentifierByUser: async ({ user }) => {
        const myContractInstance = await new web3.eth.Contract(abi, contractAddress, {
            from: config.walletAddress, // default from address
            gasPrice: config.gasPrice // default gas price in wei, 20 gwei in this case
        });

        try {
            return myContractInstance.methods.getHash(user).call();
        } catch (err) {
            console.log(err);

            return err;
        }
    },
    setIdentifierForUser: async ({ identifier, user }) => {
        const myContractInstance = await new web3.eth.Contract(abi, contractAddress, {
            from: config.walletAddress, // default from address
            gasPrice: config.gasPrice // default gas price in wei, 20 gwei in this case
        });

        try {
            return myContractInstance
                .methods
                .setHash(user, identifier)
                .send({ from: config.walletAddress });
        } catch (err) {
            console.log(err);

            return err;
        }
    },
};
