
import { ICredit } from './credit.interface';
import { ICustomer } from './customer.interface';
import { IRiskClassifier } from './risk-classifier.interface';

export interface ICustomerCredit {
    id: number;
    customer: ICustomer;
    credit: ICredit;
}


export interface ICustomerCreditRisk extends ICustomerCredit {
    riskClassifier: IRiskClassifier
}