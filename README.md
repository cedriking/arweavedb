# ArweaveDB
ArweaveDB is used to write and read the arweave blockchain database.

<a href="https://snyk.io/test/github/GoldZeus/arweavedb?targetFile=package.json"><img src="https://snyk.io/test/github/GoldZeus/arweavedb/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/GoldZeus/arweavedb?targetFile=package.json" style="max-width:100%;"></a>
<img src="https://img.shields.io/david/dev/GoldZeus/arweavedb.svg?style=flat-square" />
<img src="https://img.shields.io/bundlephobia/min/arweavedb.svg?style=flat-square" />
<img src="https://img.shields.io/github/package-json/v/GoldZeus/arweavedb.svg?style=flat-square">
<img src="https://img.shields.io/github/license/GoldZeus/arweavedb.svg?style=flat-square" />

Arweave uses an unique way of storing it's data, and this package can be used on servers or any other application that interacts with the blockchain.

ArweaveDB uses `fs` to write files and `fast-glob` to find blocks by height or by ID.

## Installation
```
npm install arweavedb --save
```

## Initialisation
```js
import { ArweaveDB } from 'arweavedb';

const arweaveDB = new ArweaveDB(__dirname);
```

## Getting started
And enjoy
```js
// Add a block
await arweaveDB.addBlock(myBlock);

// Add a transaction
await arweaveDB.addTransaction(myTx);

// Get a block by ID
const block = await arweaveDB.getBlockById(blockId);

// Get a block by height
const block = await arweaveDB.getBlockByHeight(height);

```

