import { IDisposable } from '@rs-x/core';
import { IExpression } from '@rs-x/expression-parser';
import { IRiskCalcParameters } from '../services/risk.service';
import { ICredit } from './credit.interface';
import { ICustomer } from './customer.interface';

export interface IRiskClassifier extends IDisposable {
    readonly riskClassification: IExpression<string>;
    setCustomer(customer: ICustomer): void
    setCredit(credit: ICredit): void;
    setRiskCalcParameters(parameters: IRiskCalcParameters): void;
}