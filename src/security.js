'use strict';

const fs = require('fs')
  , ursa = require('ursa')
  , config = require('./config');

const key = ursa.createPrivateKey(fs.readFileSync(config.privateKeyPath));
const crt = ursa.createPublicKey(fs.readFileSync(config.publicKeyPath));

module.exports = {
    getPublicKey: () => {
        return fs.readFileSync(config.publicKeyPath);
    },
    encryptWithPublic: ({ msg }) => {
        const encrypted = crt.encrypt(msg, 'utf8', 'base64');

        return encrypted;
    }, decryptWithPrivate: ({ encrypted }) => {
        const msg = key.decrypt(encrypted, 'base64', 'utf8');

        return msg;
    },
    encryptWithPrivate: ({ msg }) => {
        const encrypted = key.privateEncrypt(msg, 'utf8', 'base64');

        return msg;
    },
};
