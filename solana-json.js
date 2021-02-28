/*
	Solana JSON module for storing and retrieving data from the Solana blockchain

*/
const solanaWeb3 = require('@solana/web3.js');
const fs = require('fs').promises;
const BufferLayout = require('buffer-layout');

const solanaJSON = {

	setupConnection: (network='https://testnet.solana.com') => {
		return new solanaWeb3.Connection(network);
	},

	createUser: async () => {
		const user = new solanaWeb3.Account();
		console.log(`New solana account created: ${user.publicKey}`);
		return user;
	},

	fundUser: async (connection,account) => {
		const res = await connection.requestAirdrop(account.publicKey, 10000000000); // 1 SOL = 1,000,000,000 LAMPORTS
		await new Promise(r => setTimeout(r, 10000));
		const lamports = await connection.getBalance(account.publicKey);
		console.log(`Payer account ${account.publicKey.toBase58()} containing ${(lamports / 1000000000).toFixed(2)}SOL`);
	},

	loadProgram: async (connection,smartContract,payerAccount) => {
		// Load the program
		console.log('Loading program...');
		const data = await fs.readFile(smartContract.pathToProgram);
		const programAccount = new solanaWeb3.Account();
		await solanaWeb3.BpfLoader.load(
			connection,
			payerAccount,
			programAccount,
			data,
			solanaWeb3.BPF_LOADER_PROGRAM_ID,
		);
		programId = programAccount.publicKey;
		console.log('Program loaded to account', programId.toBase58());

		// Create the app account
		const appAccount = new solanaWeb3.Account();
		const appPubkey = appAccount.publicKey;
		console.log('Creating app account', appPubkey.toBase58());
		const space = smartContract.dataLayout.span;
		const lamports = 10000000000;
		console.log(`Lamports required ${lamports}`);
		const transaction = new solanaWeb3.Transaction().add(
			solanaWeb3.SystemProgram.createAccount({
				fromPubkey: payerAccount.publicKey,
				newAccountPubkey: appPubkey,
				lamports,
				space,
				programId,
			}),
		);
		await solanaWeb3.sendAndConfirmTransaction(
			connection,
			transaction,
			[payerAccount, appAccount],
			{
				commitment: 'singleGossip',
				preflightCommitment: 'singleGossip',
			},
		);
		return { appAccount, programId };
	},

	pushJSON: async (connection,app,jsonString) => {
		if (jsonString.length > 996) throw new Error({'e':'jsonString length greater than 996 chars'});
		const paddedMsg = jsonString.padEnd(1000);
		const buffer = Buffer.from(paddedMsg, 'utf8');
		const instruction = new solanaWeb3.TransactionInstruction({
			keys: [{pubkey: app.appAccount.publicKey, isSigner: false, isWritable: true}],
			programId: app.programId,
			data: buffer,
		});
		const confirmation = await solanaWeb3.sendAndConfirmTransaction(
			connection,
			new solanaWeb3.Transaction().add(instruction),
			[payerAccount],
			{
				commitment: 'singleGossip',
				preflightCommitment: 'singleGossip',
			},
		);
		return confirmation;
	},

	pullJSON:async (connection,appPubKey) => {
		const accountInfo = await connection.getAccountInfo(appPubKey);
		return Buffer.from(accountInfo.data).toString().substr(4,1000).trim();
	},

	deploy: async () => {
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
		return app;
	},

}

export default solanaJSON;
