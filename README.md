# Solana JSON

## A library for storing and retrieving data in JSON format on the Solana blockchain

This library uses a smart contract located at solana-json.so to store text based data such as JSON on the Solana blockchain. An app is deployed with a set amount of storage 1000 characters as standard. JSON data can then be pushed as a text string to the Solana blockchain and easily retrieved just using the public key of the app account.

Note there is currently no security in place so any user can write and edit data stored. To change this set paramters in the smart contract, the source code for which is located in solana-json.rs

# Testnet Example
This code exaple will set up a connection to the Solana testnet, create a user and request airdrop funding. It will then deploy the contract to testnet and push and pull example JSON data to the contract.
```
const solanaJSON = require('./solana-json.js');

(async() => {
  console.log('deploying...');
  const connection = solanaJSON.setupConnection('https://testnet.solana.com');
  const payerAccount = await solanaJSON.createUser();
  await solanaJSON.fundUser(connection,payerAccount);
  const smartContract = {
    pathToProgram: './solana-json.so',
    dataLayout: solanaJSON.setDataStructure(1000),
  }
  const app = await solanaJSON.loadProgram(connection,smartContract,payerAccount);
  console.log('app',app);
  const confirmationTicket = await solanaJSON.pushJSON(connection,app,'{"abc":123}');
  const testJSON = solanaJSON.pullJSON(connection,app.appAccount.publicKey);
  console.log(`Test: ${JSON.parse(testJSON).abc}`);
})();
```

# Deploying Mainnet

To deploy the contract on mainnet you'll need an account with some SOL tokens to pay for the transactions. You can load a user account using a private key buffer array.
```
const payerAccount = solanaJSON.loadUser([1,185,72,49,215,81,171,50,85,54,122,53,24,248,3,221,42,85,82,43,128,80,215,127,68,99,172,141,116,237,232,85,185,31,141,73,173,222,173,174,4,212,0,104,157,80,63,147,21,81,140,201,113,76,156,161,154,92,70,67,163,52,219,72]);
```

# Resources
https://docs.solana.com/developing/clients/javascript-api

https://jamesbachini.com/


# Contribute
If anyone would like to add code to the project, build templates or make improvements please do so via a pull request.

I'm keen to keep it lightweight but so anything that's not core should be setup as a 3rd party component.

# To Do
Easy way to adjust data size