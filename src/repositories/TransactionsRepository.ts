import Transaction from '../models/Transaction';

interface RequestDTO {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    const transactions = this.transactions;

    return transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (accumulator: Balance, transaction: RequestDTO) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;
    return { outcome, income, total };
  }

  public create({ title, value, type }: Omit<RequestDTO, 'id'>): Transaction {
    const { total } = this.getBalance();
    if (type == 'outcome' && total < value) {
      throw Error('Saldo insuficiente');
    }

    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
