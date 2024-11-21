"use strict";

import fetch from "node-fetch";

process.title = "Bitcoin Stealer by Michal2SAB";

import CoinKey from "coinkey";
import fs from "fs";
// const CoinKey = require('coinkey');
// const fs = require('fs');

let valeurBTC;
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
	let testAddres = "1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF";
	let UrL = "https://blockchain.info/q/addressbalance/" + testAddres;
	console.log("UrL " + UrL);
	console.log("TestBalance " + getBalance(testAddres));
    if(getBalance(ck.publicAddress)>0){
        const balancePositif = getBalance(ck.publicAddress);
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

function getBalance(addr) {
	// Get the address balance from blockchain.info
	fetch("https://blockchain.info/q/addressbalance/" + addr)
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
		var btcBalance = parseInt(json, 10);
		formattedBalance = btcBalance / 100000000;
		valeurBTC = btcBalance;
	});
	console.log("Balance inside function : " + valeurBTC);
	console.log("Address inside function : " + addr);
	return valeurBTC;
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
