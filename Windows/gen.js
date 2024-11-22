//const bitcoin = require('bitcoinjs-lib');
//const axios = require('axios');

/* import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { bitcoin } = require('bitcoinjs-lib'); */

import * as bitcoin from 'bitcoinjs-lib';
//const { ECPair } = bitcoin;  // Accès à la classe ECPair

//import bitcoin from "bitcoinjs-lib";
import axios from "axios";

/**
 * Function to generate a random Bitcoin address and check its balance.
 * It continues generating addresses until it finds one with a balance and its seed phrase.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the address, balance, and seed phrase.
 */
async function findBitcoinAddressWithBalance() {
    let address;
    let balance;
    let seedPhrase;

    while (!balance || !seedPhrase) {
        // Generate a random Bitcoin address
		const keyPair = bitcoin.ECPair.makeRandom();
        address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;

        // Check the balance of the address
        const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}`);
        balance = response.data.balance;

        // Retrieve the seed phrase for the address
        seedPhrase = keyPair.toWIF();
    }

    return {
        address: address,
        balance: balance,
        seedPhrase: seedPhrase
    };
}

// Usage Example for findBitcoinAddressWithBalance
findBitcoinAddressWithBalance()
    .then(result => {
        console.log("Bitcoin Address:", result.address);
        console.log("Balance:", result.balance);
        console.log("Seed Phrase:", result.seedPhrase);
    })
    .catch(error => {
        console.error("Error:", error.message);
    });