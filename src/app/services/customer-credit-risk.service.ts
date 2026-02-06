import { inject, Injectable } from '@angular/core';
import { IExpressionFactoryToken } from '@rs-x/angular';
import { ICustomerCredit, ICustomerCreditRisk } from '../models/customer-credit-risk.interface';
import { RiskClassifier } from '../models/risk-classifier';
import { RiskService } from './risk.service';
import { IRiskCalcParameters } from '../models/risk-calc-parameters.interface';



@Injectable({ providedIn: 'root' })
export class CustomerCreditRiskService {
    private readonly _riskService = inject(RiskService);
    private readonly _expressionFactory = inject(IExpressionFactoryToken);
    private _customerCreditRisks: ICustomerCreditRisk[] = [];
    private _riskCalcParameters!: IRiskCalcParameters

    public async getAll(): Promise<ICustomerCreditRisk[]> {
        if (!this._riskCalcParameters) {
            this._riskCalcParameters = await this._riskService.getRiskCalcParameters()
        }

        if (this._customerCreditRisks.length === 0) {
            for (let i = 1; i <= 20; i++) {
                const customer = {

                    age: 20 + Math.floor(Math.random() * 40), // 20 - 60
                    income: 30000 + Math.floor(Math.random() * 70000), // 30k - 100k
                    employmentYears: Math.floor(Math.random() * 30), // 0 - 30 years
                }
                const credit = {
                    score: 600 + Math.floor(Math.random() * 200), // 600 - 800
                    outstandingDebt: Math.floor(Math.random() * 50000), // 0 - 50k
                };

                const riskClassifier = new RiskClassifier(
                    customer,
                    credit,
                    this._riskCalcParameters,
                    this._expressionFactory
                );

                this._customerCreditRisks.push({
                    id: i,
                    customer,
                    credit,
                    riskClassifier
                });
            }
        }
        return this._customerCreditRisks;
    }

    public async get(id: number): Promise<ICustomerCreditRisk | undefined> {
        return this._customerCreditRisks.find(c => c.id === id);
    }

    public async create(customerData: Omit<ICustomerCreditRisk, 'id'>): Promise<ICustomerCreditRisk> {
        const customerCredit: ICustomerCredit = {
            id: this._customerCreditRisks.length ? Math.max(...this._customerCreditRisks.map(c => c.id)) + 1 : 1,
            ...customerData,

        };

        const riskClassifier = new RiskClassifier(
            customerData.customer,
            customerData.credit,
            this._riskCalcParameters,
            this._expressionFactory
        )
        const customerCreditRisk: ICustomerCreditRisk = {
            ...customerCredit,
            riskClassifier
        };

        this._customerCreditRisks.push(customerCreditRisk);

        return customerCreditRisk;
    }

    public async update(id: number, updates: Partial<Omit<ICustomerCredit, 'id'>>): Promise<ICustomerCreditRisk | undefined> {
        const customerCreditRisk = this._customerCreditRisks.find(c => c.id === id);
        if (!customerCreditRisk) {
            return undefined;
        }

        customerCreditRisk.customer
        Object.assign(customerCreditRisk.customer, updates.customer);
         Object.assign(customerCreditRisk.credit, updates.credit);
        return customerCreditRisk;
    }

    public async delete(id: number): Promise<boolean> {
        const index = this._customerCreditRisks.findIndex(c => c.id === id);
        if (index === -1) {
            return false;
        }

        this._customerCreditRisks[index].riskClassifier.dispose();
        this._customerCreditRisks.splice(index, 1);

        return true;
    }
}