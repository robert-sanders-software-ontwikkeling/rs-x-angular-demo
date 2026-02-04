# RS-X Angular DEMO


## Getting started

- Make sure you have the Angular CLI installed. If not, run `npm install -g @angular/cli`.
- Make sure you have [Node.js](https://nodejs.org/en) installed.
- Run `npm install` to install the required packages.
- Run `npm start` to start the demo.

## Usinge the rsx-pipe

This demo illustrates the use of the rsx-pipe. It makes use of the [RS-X framework](https://github.com/robert-sanders-software-ontwikkeling/rs-x/blob/main/readme.md).

You can think of the **rsx-pipe** as the *async pipe on steroids*. It allows you to bind not only to asynchronous data, but also to expressions that are updated **only when the data they depend on changes**.

The main advantage of using **RS-X** is that you can define a data model that is a mix of asynchronous and synchronous data and make it reactive by attaching **RS-X expressions** to it. Expressions can be as simple as identifiers or as complex as full JavaScript formulas.

Your data model is the **single source of truth** that you bind to. You can freely manipulate this model, and RS-X ensures that all linked expressions are automatically updated when the underlying data changes. The **rsx-pipe** acts as the bridge that connects your reactive data model to the UI.

For this demo we use the rsx-pipe in the following scenarios:

- Bind to async data for creating rows  
    ```html
    <tr *ngFor="let item of customerCredits | rsx" [class.selected]="item === selected" (click)="select(item)">
        ... 
    </tr>
    ```
- Bind to an expression string  
    ```html
    <rsx-field
        expression="customer.age + ` (${customer.age > 40 ? 'becoming old' : 'still young'})`"  
        [model]="item">
    </rsx-field>
    ```

    You could, of course, achieve the same result using standard Angular bindings. However, this approach is inefficient because Angular re-evaluates the entire expression every time the component is checked. In a table with many rows, this can quickly become a performance issue.
    ```html
    {{ customer.age + ` (${customer.age > 40 ? 'becoming old' : 'still young'})` }}
    ```

    The `rsx-field` component is a simple wrapper using the rsx-pipe:  
    ```ts
    import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
    import { RsxPipe } from '@rs-x/angular';

    @Component({
        selector: 'rsx-field',
        standalone: true,
        imports: [ RsxPipe ],
        template: '{{ expression | rsx: model }}',
        changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class RsxField {
        @Input() expression!: string;
        @Input() model!: object;
    }
    ```

- Bind to a parsed expression:  
    ```html
    {{ item.riskClassifier.riskClassification | rsx }}
    ```

    Here, `riskClassification` is an expression tree returned by the RS-X expression parser. The following code shows how it is created:
    ```ts
    import { IExpression, IExpressionFactory } from '@rs-x/expression-parser';
    import { BehaviorSubject } from 'rxjs';
    import { IRiskCalcParameters } from '../services/risk.service';
    import { ICredit } from './credit.interface';
    import { ICustomer } from './customer.interface';
    import { IRiskClassifier } from './risk-classifier.interface';

    interface IRiskModel {
        readonly customer: BehaviorSubject<ICustomer>;
        readonly credit: BehaviorSubject<ICredit>;
        readonly riskParameters: BehaviorSubject<IRiskCalcParameters>;
    }

    export class RiskClassifier implements IRiskClassifier {
        public readonly riskClassification: IExpression<string>;
        private readonly _model: IRiskModel;
        private _isDisposed = false;

        constructor(
            customer: ICustomer,
            credit: ICredit,
            riskParameters: IRiskCalcParameters,
            expressionFactory: IExpressionFactory) {

            this._model = {
                customer: new BehaviorSubject(customer),
                credit: new BehaviorSubject(credit),
                riskParameters: new BehaviorSubject(riskParameters),
            };
            const basePersonalRisk = expressionFactory.create(
                this._model, `
                (credit.score < 600 ? 0.4 : 0.1) +
                (credit.outstandingDebt / customer.income) * 0.6 -
                (customer.employmentYears * 0.03) 
            `) as IExpression<number>;

            const ageBasedRiskAdjustment = expressionFactory.create(
                this._model, `
                customer.age < 25 ? 0.15 :
                customer.age < 35 ? 0.05 :
                customer.age < 55 ? 0.00 :
                0.08
            `) as IExpression<number>;

            const marketRisk = expressionFactory.create(
                this._model, `
                (riskParameters.risk.volatilityIndex * 0.5) +
                (riskParameters.risk.recessionProbability * 0.5)
            `) as IExpression<number>;

            const interestRateImpact = expressionFactory.create(
                this._model, `
                riskParameters.market.baseInterestRate * 2
            `) as IExpression<number>;

            const riskScore = expressionFactory.create(
                {
                    basePersonalRisk,
                    ageBasedRiskAdjustment,
                    marketRisk,
                    interestRateImpact
                }, `
                basePersonalRisk + 
                ageBasedRiskAdjustment +
                marketRisk + 
                interestRateImpact
            `);

            this.riskClassification = expressionFactory.create(
                {
                    riskScore: riskScore as IExpression<number>,
                    thresholds: {
                        highRisk: 0.75,
                        mediumRisk: 0.45
                    }
                }, `
                riskScore >= thresholds.highRisk
                    ? 'HIGH'
                    : riskScore >= thresholds.mediumRisk
                        ? 'MEDIUM'
                        : 'LOW'
                `
            );
        }
        public dispose(): void {
            if(this._isDisposed) {
                return;
            }

            this.riskClassification.dispose();
            this._isDisposed = true;
        }

        public setCustomer(customer: ICustomer): void {
            this._model.customer.next(customer);
        }

        public setCredit(credit: ICredit): void {
            this._model.credit.next(credit);
        }

        public setRiskCalcParameters(parameters: IRiskCalcParameters): void {
            this._model.riskParameters.next(parameters);
        }
    }
    ```

