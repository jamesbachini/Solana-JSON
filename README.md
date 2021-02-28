# Solana JSON

## A library for storing and retrieving data in JSON format on the Solana blockchain

# Example
```
const connection = setupConnection('https://testnet.solana.com');
const version = await connection.getVersion();
console.log('Connection to cluster established:', version);
const payerAccount = await createUser();
await fundUser(connection,payerAccount);
const smartContract = {
  pathToProgram: './solana-json.so',
  dataLayout: BufferLayout.struct([BufferLayout.blob(1000,'txt')]),
}
const app = await loadProgram(connection,smartContract,payerAccount);
console.log('app',app);
const confirmationTicket = await pushJSON(connection,app,'{"abc":123}');
const testJSON = pullJSON(connection,app.appAccount.publicKey);
console.log(`Test: ${JSON.parse(testJSON).abc}`);
```

# Resources
https://docs.solana.com/developing/clients/javascript-api

https://jamesbachini.com/


# Contribute
If anyone would like to add code to the project, build templates or make improvements please do so via a pull request.

I'm keen to keep it lightweight but so anything that's not core should be setup as a 3rd party component.

# To Do
Easy way to adjust data size