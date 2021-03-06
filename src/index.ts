import * as fg from 'fast-glob';
import * as fs from 'fs';
import { IArweaveBlock, IArweaveTransaction } from './models';

export class ArweaveDB {
  private blocksCacheById: Map<string, IArweaveBlock> = new Map();
  private blocksCacheByHeight: Map<number, IArweaveBlock> = new Map();
  private transactionsCacheById: Map<string, IArweaveTransaction> = new Map();

  private readonly blocksFolder: string = 'blocks';
  private readonly transactionsFolder: string = 'txs';

  private path = '';

  constructor(path: string = '') {
    this.path = path;
    this.blocksFolder = `${path}/${this.blocksFolder}`;
    this.transactionsFolder = `${path}/${this.transactionsFolder}`;
  }

  public async getTransactionById(transactionId: string): Promise<IArweaveTransaction> {
    if (this.transactionsCacheById.has(transactionId)) {
      return this.transactionsCacheById.get(transactionId);
    }

    if (fs.existsSync(`${this.transactionsFolder}/${transactionId}.json`)) {
      const transaction: IArweaveTransaction = JSON.parse(
        fs.readFileSync(`${this.transactionsFolder}/${transactionId}.json`, { encoding: 'utf8' }),
      );
      this.transactionsCacheById.set(transactionId, transaction);
      return transaction;
    }

    return null;
  }

  public async getBlockById(blockId: string): Promise<IArweaveBlock> {
    if (this.blocksCacheById.has(blockId)) {
      return this.blocksCacheById.get(blockId);
    }

    const files: string[] = fg.sync([`${this.blocksFolder}/*${blockId}.json`]);
    if (files.length) {
      const block: IArweaveBlock = JSON.parse(fs.readFileSync(files[0], { encoding: 'utf8' }));

      this.blocksCacheByHeight.set(block.height, block);
      this.blocksCacheById.set(blockId, block);
      return block;
    }

    return null;
  }

  public async getBlockByHeight(height: number): Promise<IArweaveBlock> {
    if (height < 0) {
      return null;
    }

    if (this.blocksCacheByHeight.has(height)) {
      return this.blocksCacheByHeight.get(height);
    }

    const files: string[] = fg.sync([`${this.blocksFolder}/${height}_*.json`]);

    if (files.length) {
      const block: IArweaveBlock = JSON.parse(fs.readFileSync(files[0], { encoding: 'utf8' }));

      this.blocksCacheById.set(block.indep_hash, block);
      this.blocksCacheByHeight.set(height, block);
      return block;
    }

    return null;
  }

  public async addTransaction(transaction: IArweaveTransaction): Promise<boolean> {
    try {
      if (!fs.existsSync(this.transactionsFolder)) {
        fs.mkdirSync(this.transactionsFolder);
      }
      await fs.promises.writeFile(`${this.transactionsFolder}/${transaction.id}.json`, JSON.stringify(transaction));
    } catch (e) {
      return false;
    }

    return true;
  }

  public async addBlock(block: IArweaveBlock): Promise<boolean> {
    try {
      if (!fs.existsSync(this.blocksFolder)) {
        fs.mkdirSync(this.blocksFolder);
      }
      await fs.promises.writeFile(
        `${this.blocksFolder}/${block.height}_${block.indep_hash}.json`,
        JSON.stringify(block),
      );
    } catch (e) {
      return false;
    }

    return true;
  }
}
