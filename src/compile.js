const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'User.sol');
const source = {
  language: "Solidity",
  sources: {
    "User": {
      content: fs.readFileSync(contractPath, 'utf-8'),
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": [ "abi", "evm.bytecode" ]
      }
    }
  }
};

module.exports = JSON.parse(solc.compile(JSON.stringify(source)));
