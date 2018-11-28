// TODO: Replace this with a proper way of handling transactions
export enum TransactionType { 'Challenge', 'ChallengeRespondWithMove', 'ChallengeRefute' }

export class TransactionToSend {
    type: TransactionType;
    data: any;
}