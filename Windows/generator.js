"use strict";

import fetch from "node-fetch";

process.title = "Bitcoin Checker";

import CoinKey from "coinkey";
import fs from "fs";

// const CoinKey = require('coinkey');
// const fs = require('fs');

let privateKeyHex, ck, addresses;
addresses = new Map();

/* const data = fs.readFileSync('./riches.txt');
data.toString().split("\n").forEach(address => addresses.set(address, true)); */

function generate() {
    // generate random private key hex
    let privateKeyHex = r(64);
    
    // create new bitcoin key pairs
    let ck = new CoinKey(Buffer.from(privateKeyHex, 'hex'));
    
    ck.compressed = false;
    //console.log(ck.publicAddress)
    // ^ remove "//" from line above if you wanna see the logs, but remember it slows down the whole process a lot.
        
    // if generated wallet matches any from the riches.txt file, tell us we won!
	// addresses.has(ck.publicAddress)

	const balancePositif = getBitcoinBalance(ck.publicAddress);
    if (balancePositif > 0) {
		console.log("");
        process.stdout.write('\x07');
        console.log("\x1b[32m%s\x1b[0m", ">> Success: " + ck.publicAddress);
        var successString = "Wallet: " + ck.publicAddress + "\n\nSeed: " + ck.privateWif + "Balance : " + balancePositif + "BTC";
            
        // save the wallet and its private key (seed) to a Success.txt file in the same folder 
        fs.writeFileSync('./Success.txt', successString, (err) => {
            if (err) throw err; 
        })
            
        // close program after success
        process.exit();
    } else {
		// Balance nulle
		// Exemple d'utilisation
		const bitcoinAddress = "1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF";  // Remplacez par l'adresse Bitcoin que vous souhaitez vérifier
		getBitcoinBalance(bitcoinAddress).then(balance => {
		  console.log(`Balance récupérée : ${balance}`);
		});
		//console.log("Balance addresse fixe : " + getBitcoinBalance(bitcoinAddress));
	}
    // destroy the objects
    ck = null;
    privateKeyHex = null;
}

// the function to generate random hex string
function r(l) {
    let randomChars = 'ABCDEF0123456789';
    let result = '';
    for ( var i = 0; i < l; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

// Fonction asynchrone pour récupérer la balance d'une adresse Bitcoin
async function getBitcoinBalance(address) {
  try {
    const url = "https://blockchain.info/q/addressbalance/" + address;
    const response = await fetch(url);  // Attendre la réponse de l'API
    const data = await response.json(); // Attendre que la réponse soit convertie en JSON
    
    // Vérifier si la réponse contient des données valides
    if (data.data && data.data[address]) {
      const balance = data.data[address].address.balance;
      console.log(`La balance de l'adresse ${address} est : ${balance}/100000000 BTC`);
      return balance;
    } else {
      console.log("Adresse Bitcoin invalide ou pas de données disponibles.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la balance :", error);
  }
}

console.log("\x1b[32m%s\x1b[0m", ">> Program Started and is working silently (edit code if you want logs)"); // don't trip, it works
// run forever
while(true){
    generate();
    if (process.memoryUsage().heapUsed / 1000000 > 500) {
        global.gc();
    }
    //console.log("Heap used : ", process.memoryUsage().heapUsed / 1000000);
}
