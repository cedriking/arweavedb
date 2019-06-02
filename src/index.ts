import * as fs from 'fs';
import * as fg from 'fast-glob';
import {ArweaveBlock, ArweaveInfo, ArweaveTransaction} from "./models";

export class ArweaveDB {
    private _blocksCacheById: Map<string, ArweaveBlock> = new Map();
    private _blocksCacheByHeight: Map<number, ArweaveBlock> = new Map();
    private _transactionsCacheById: Map<string, ArweaveTransaction> = new Map();

    private _blocksFolder: string = 'blocks';
    private _transactionsFolder: string = 'txs';

    private _triggers: Map<string, Function[]> = new Map();

    private _path = '';
    constructor(path: string = '') {
        this._path = path;
        this._blocksFolder = `${path}/${this._blocksFolder}`;
        this._transactionsFolder = `${path}/${this._transactionsFolder}`;
    }

    async getTransactionById(transactionId: string) {
        if(this._transactionsCacheById.has(transactionId)) {
            return this._transactionsCacheById.get(transactionId);
        }

        if(fs.existsSync(`${this._transactionsFolder}/${transactionId}.json`)) {
            const transaction: ArweaveTransaction = JSON.parse(fs.readFileSync(`${this._transactionsFolder}/${transactionId}.json`, {encoding: 'utf8'}));
            this._transactionsCacheById.set(transactionId, transaction);
            return transaction;
        }

        return false;
    }

    async getBlockById(blockId: string) {
        if(this._blocksCacheById.has(blockId)) {
            return this._blocksCacheById.get(blockId);
        }

        const files: string[] = await fg(`${this._blocksFolder}/*${blockId}.json`);
        if(files.length) {
            const block: ArweaveBlock = JSON.parse(fs.readFileSync(files[0], {encoding: 'utf8'}));

            this._blocksCacheByHeight.set(block.height, block);
            this._blocksCacheById.set(blockId, block);
            return block;
        }

        return false;
    }

    async getBlockByHeight(height: number) {
        if(height < 0) {
            return false;
        }

        if(this._blocksCacheByHeight.has(height)) {
            return this._blocksCacheByHeight.get(height);
        }

        const files: string[] = await fg(`${this._blocksFolder}/${height}_*.json`);
        if(files.length) {
            const block: ArweaveBlock = JSON.parse(await fs.readFileSync(files[0], {encoding: 'utf8'}));

            this._blocksCacheById.set(block.indep_hash, block);
            this._blocksCacheByHeight.set(height, block);
            return block;
        }

        return false;
    }

    async addTransaction(transaction: ArweaveTransaction) {
        try {
            !fs.existsSync(this._transactionsFolder) && fs.mkdirSync(this._transactionsFolder);
            await fs.promises.writeFile(`${this._transactionsFolder}/${transaction.id}.json`, JSON.stringify(transaction));
        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }

    async addBlock(block: ArweaveBlock) {
        try {
            !fs.existsSync(this._blocksFolder) && fs.mkdirSync(this._blocksFolder);
            await fs.promises.writeFile(`${this._blocksFolder}/${block.height}_${block.indep_hash}.json`, JSON.stringify(block));
        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }
}

