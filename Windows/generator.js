"use strict";

process.title = "Bitcoin Stealer by Michal2SAB";

const CoinKey = require('coinkey');
const fs = require('fs');

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
  fetch("https://blockchain.info/q/addressbalance/+${addr}")
    .then(response => response.json())
    .then(balance => {
      // Format the balance as a fraction by dividing by 100,000,000
      const formattedBalance = balance / 100000000;
      
      // Get the current price of BTC from Coindesk API
      fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
        .then(response => response.json())
        .then(data => {
          // Get the BTC price in USD
          const priceUSD = data.bpi.USD.rate_float;
          
          // Calculate the balance value in USD
          const balanceValue = formattedBalance * priceUSD;
          
          /* // Update the HTML in the DIVI text module
          document.getElementById("textModuleId").innerHTML = `
            Address balance: ${formattedBalance} BTC <br>
            Current price of BTC: $${priceUSD} <br>
            Balance value at current rate: $${balanceValue.toFixed(2)}
          `; */
        });
    });
	return balanceValue;
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
