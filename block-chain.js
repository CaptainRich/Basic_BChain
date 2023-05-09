// Classes for block chain manipulation.

// Import the crypto-hashing function from the nodejs package.  Note that "crypto-js" must be installed from "npm".
const SHA256 = require( 'crypto-js/sha256');

// Import the 'moment' library for date/time functions.
const moment = require( 'moment' );

// Import the library for private/public key generation
const EC = require( 'elliptic').ec;

// Create an instance of the elliptic library
const ec = new EC( 'secp256k1' );     // specify the elliptic curve to use

// Define the size of the "nonce", the number of leading zeroes the block's hash must start with
const num_zeros = 4;

// Define what the block's data looks like (this could be a transaction in the cyrpto-currency arena).
// Transactions are typically "from" someone, "to" someone.
class Transaction{
    constructor( fromAddress, toAddress, dataAmount ){
        this.fromAddress = fromAddress;
        this.toAddress   = toAddress;
        this.dataAmount  = dataAmount;
    }

    // Compute the hash of this transaction.  This transaction is what will be signed by the private key.
    calculateTHash(){
        return SHA256( this.fromAddress + this.toAddress + this.dataAmount ).toString();
    }

    // Method to "sign" a transaction - this protects the transaction from illicit modification
    signTransaction( signingKey ){           // 'signingKey' is an object with both public/private keys
       
        // Verify the public keys match
        if( signingKey.getPublic( 'hex' ) !== this.fromAddress ) {
            throw new Error( 'You cannot sign a transaction that is not yours.');
        }

        const hashTransaction = this.calculateTHash();
        const signature       = signingKey.sign( hashTransaction, 'base64' );
        console.log( "Signing transaction with a hash value of: ", hashTransaction );
        console.log( "Signature for the hash is: ", signature );

        // Store the signature in this transaction
        this.signature = signature.toDER( 'hex' );                // 'toDer' is an encoding format
        console.log( "Signed Transaction with a signature of: ", this.signature );
    }

    // Method to verify a transaction has been properly signed.
    isValid(){
        // Assume if there is no "fromAddress" this transaction is from the 'mining' activity
        if(this.fromAddress === null ) return true;               
        
        if( !this.signature || this.signature.length === 0 ) {
            throw new Error( 'No signature in this transaction.' );
        }

        // Check that the transaction was signed with the correct key.
        const publicKey = ec.keyFromPublic( this.fromAddress, 'hex' );
        return publicKey.verify( this.calculateTHash(), this.signature );
    }
}

// Define what a "block" looks like/contains.
class Block{
    //constructor( indexNum, timeStamp, nonce, transactions, previousHash = "" ) {
    constructor( timeStamp, transactions, previousHash = "" ) {
       // indexNum     - the number of the block in the chain (not really needed since the position of the 
       //                block in the chain determines the block number.)
       // timeStamp    - the date/time the block was created/added to the chain
       // nonce        - a random number determined to make the hash start with '0000' (num_zeros)
       // blockData    - the data contained in the block - this can be complex (tokens, transactions, etc.)
       // previousHash - the hash of the previous/preceding block, to insure integrity of the chain

       //this.indexNum     = indexNum;
       this.timeStamp    = timeStamp;
       this.nonce        = 0;                      // don't know this yet
       this.transactions = transactions;
       this.previousHash = previousHash;
       this.hash         = this.nonceBlockHash();   // determine the hash of the current block

    }

    // Define the method/function to compute he hash of the current block
    calculateHash() {
        // Use the hashing function to compute the hash of the block, returned as a string
        return SHA256( this.timeStamp +  this.nonce + JSON.stringify(this.transactions) + this.previousHash ).toString();
    }

    // Define the method/function to determine the proper 'nonce' for a (new) block.  The block's hash is supposed to start with 4 zeroes.  This is one of the requirements of a valid block.  Some call this process "mining".
    nonceBlockHash() {       

        // Get a string with the needed number of zeros.
        var needed_zeros = Array(num_zeros+1).join("0");

        // Get the hash of the block (same as 'calculateHash' above)
        var blockHash = this.calculateHash();

        // Get the leading 4 characters, which we ultimately want to be '0000'.
        var leadingZ = blockHash.slice(0,num_zeros);

        // As long as the leading 'num_zeros' characters are NOT all zeroes, increment the 'nonce' and try again.      
        while( leadingZ != needed_zeros ) {
            this.nonce++;
            blockHash = this.calculateHash();
            leadingZ  = blockHash.slice(0,num_zeros);
        }

        return blockHash;
    }

    // Verify the block contains valid transactions.
    hasValidTransactions() {

        // Loop over all the transactions in the block
        for( const transact of this.transactions ){
            if( !transact.isValid() ){
                return false;
            }
        }

        return true;       // all the transactions in the block are valid
    }
}

// Define what a "block chain" looks like/contains, and its methods.
class BlockChain{
    constructor(){
        // The block chain is an array of blocks, the first of which is the 'genesis block".
        this.chain = [ this.createGenesisBlock() ];
        this.pendingTransactions = [];                // defined as an empty array
        this.miningReward        = 100;               // the reward for creating (mining) a block
    }

    // The first block on a chain is the "genesis" block and is created manually.  
    // The "index", "nonce" and "previous hash" are set to zero.
    createGenesisBlock() {
        let timestamp = moment().format();
        return new Block(  timestamp, "Genesis Block", "0" );
    }

    // Method to get/return the last block.
    getLatestBlock() {
        return this.chain[ this.chain.length-1 ];
    }

    // This is the initial function to create a block.
    // Method to add a new block to the chain.  "Mining" is the action of determining and adding the 'nonce'.
    // addBlock( newBlock, toAddress ) {
    //     // Set the value of the previous block's hash in the current block
    //     newBlock.previousHash = this.getLatestBlock().hash;

    //     // Since the properties of the current block were just changed, its hash must be
    //     // recomputed.
    //     newBlock.hash = newBlock.nonceBlockHash();    'mine' the block

    //     // Add the new block to the chain
    //     this.chain.push( newBlock );
    // }

    // Mine (create,add) a new block.
    minePendingTransactions( miningRewardAddress ){

        console.log( "In 'minePendingTransactions' ..." );
        console.log( "Pending Transactions are: \n" );
        console.log( this.pendingTransactions );


        // miningRewardAddress  - the address of the miner's wallet where the reward is sent if mining is successful.
        let block = new Block( Date.now(), this.pendingTransactions );
        block.previousHash = this.getLatestBlock().hash;
        block.nonceBlockHash();
        console.log( "Block Mined: ", block );
       

        this.chain.push( block );
        this.pendingTransactions = [
            new Transaction( null, miningRewardAddress, this.miningReward )  // no "fromAddress" when creating (mining) a block
        ];

        console.log( "New block added (mined)." );
        console.log( "mining transaction added to pending: ", this.pendingTransactions );
    }

    // Put the current transaction into the "pending" array
    addTransaction( transaction ){

        // Verify the transaction has from/to addresses before adding to the 'pending' array
        if( !transaction.fromAddress || !transaction.toAddress ){
            throw new Error( 'Transactions must have both from/to addresses. ' );
        }

        // Verify the transaction is valid before adding to the 'pending' array
        if( !transaction.isValid() ){
            throw new Error( 'Cannot add invalid transactions.' );
        }

        // All ok, add the transaction to the "pending" array.
        this.pendingTransactions.push( transaction );
    }

    // Determine the balance of a specified address.
    getBalanceOfAddress( address ){
        let balance = 0;

        // Loop over all of the transactions in all of the blocks, looking for the specified address.  Update the balance accordingly.
        for( const block of this.chain ){
            for( const trans of block.transactions ) {
                if( trans.fromAddress == address ){
                   balance -= trans.dataAmount;            // reduce the balance since an amount was "sent". 
                }

                if( trans.toAddress == address ){
                    balance += trans.dataAmount;           // increase the balance since an amount is "received".
                }
            }
        }

        return balance;

    }


    // Add validation for the chain.
    isChainValid() {
        // No need to check the first block (index = 0) since we manually created it.

        // Loop over all the blocks in the chain and verify their data.  (Skip the 'genesis' block.)
        for( let i = 1; i < this.chain.length; i++ ) {
            // Grab the current and previous blocks
            const currentBlock  = this.chain[i];
            const previousBlock = this.chain[i-1];

            // Verify that all of the transactions in the current block are valid
            if( !currentBlock.hasValidTransactions() ){
                console.log( "This block has invalid transactions: " + i );
                return false;
            }

            // Recompute the hash of the current block and make sure it matches
            if( currentBlock.hash !== currentBlock.calculateHash() ) {
                console.log( "currentBlock.hash: ", currentBlock.hash );
                console.log( "Recomputed hash  : ", currentBlock.calculateHash() );
                return "No, bad block hash for block: " + i;
            }

            // Check that the current block's previous hash value matches the hash of the previous block.
            if( currentBlock.previousHash !== previousBlock.hash ) {
                return "No, previous hash mismatch for block: " + i;
            }

            // Check that (based on the 'nonce') the hash of the current block begins with '0000'
            // Number of leading zeros needed in the hash.    
            // Get a string with the needed number of zeros.
            var needed_zeros = Array(num_zeros+1).join("0");

            const first4 = currentBlock.hash.slice(0,num_zeros);
            if( first4 != needed_zeros ) {
                return "No, invalid nonce/hash for block: " + i;
            }
        }

        // If we get this far, the chain is valid.
        return "yes";
    }
}


module.exports.BlockChain  = BlockChain;
module.exports.Transaction = Transaction;