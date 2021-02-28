# Solana JSON

## A library for storing and retrieving data in JSON format on the Solana blockchain

This library uses a smart contract located at solana-json.so to store text based data such as JSON on the Solana blockchain. An app is deployed with a set amount of storage 1000 characters as standard. JSON data can then be pushed as a text string to the Solana blockchain and easily retrieved just using the public key of the app account.

Note there is currently no security in place so any user can write and edit data stored. To change this set paramters in the smart contract, the source code for which is located in solana-json.rs

# Example
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

# Resources
https://docs.solana.com/developing/clients/javascript-api

https://jamesbachini.com/


# Contribute
If anyone would like to add code to the project, build templates or make improvements please do so via a pull request.

I'm keen to keep it lightweight but so anything that's not core should be setup as a 3rd party component.

# To Do
Easy way to adjust data size