import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IExpressionFactoryToken, RsxPipe } from '@rs-x/angular';
import { IExpression } from '@rs-x/expression-parser';
import { ICustomerCredit, ICustomerCreditRisk } from '../../models/customer-credit-risk.interface';
import { CustomerCreditRiskService } from '../../services/customer-credit-risk.service';
import { CustomerCreditEditComponent } from '../customer-credit-edit/customer-credit-edit.component';
import { RsxField } from '../rsx-field/rsx-field.component';

@Component({
  selector: 'rsx-customer-credit-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RsxPipe, RsxField, CustomerCreditEditComponent],
  templateUrl: './customer-credit-table.component.html',
  styleUrls: ['./customer-credit-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerCreditTableComponent {
  private readonly _service = inject(CustomerCreditRiskService);
  private readonly _expressionFactory = inject(IExpressionFactoryToken);
  public readonly customerCredits: IExpression<ICustomerCreditRisk[]>;
  public selected?: ICustomerCreditRisk;
  public editing?: ICustomerCreditRisk;

  constructor() {
    const model = {
      customerCredits: this._service.getAll()
    };
    this.customerCredits = this._expressionFactory.create(model, 'customerCredits');
  }

  public select(item: ICustomerCreditRisk) {
    this.selected = item;
  }

  public edit(item: ICustomerCreditRisk) {
    this.selected = item;
    this.editing = item;
  }

  public closeEditor() {
    this.editing = undefined;
  }

  public async save(updated: ICustomerCredit) {
    try {
      await this._service.update(updated.id, updated);
      alert(`Customer credit with ${updated.id} updated successfully.`);
      this.editing = undefined;
      this.closeEditor();
    } catch (error) {
      alert(`Error updating customer credit with id ${updated.id}: ${error}`);
    }
  }

  public async delete(item: ICustomerCreditRisk) {
    try {
      await this._service.delete(item.id);
      if (this.selected === item) {
        this.selected = undefined;
      }
      alert(`Customer credit with id ${item.id} deleted successfully.`);
    } catch (error) {
      alert(`Error deleting customer credit with id ${item.id}: ${error}`);
    }
  }

  public isEditing(item: ICustomerCreditRisk): boolean {
    return this.editing === item;
  }
}