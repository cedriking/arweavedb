export interface IArweaveTransaction {
  id: string;
  last_tx: string;
  owner: string;
  tags?: Array<{ [key: string]: string }>;
  target?: string;
  quantity?: string;
  data?: string;
  reward: string;
  signature: string;
}
