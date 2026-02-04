import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICustomerCredit, ICustomerCreditRisk } from '../../models/customer-credit-risk.interface';
import { CommonModule } from '@angular/common';

export interface CustomerCreditForm {
  customer: FormGroup<{
    age: FormControl<number>;
    income: FormControl<number>;
    employmentYears: FormControl<number>;
  }>;
  credit: FormGroup<{
    score: FormControl<number>;
    outstandingDebt: FormControl<number>;
  }>;
}

@Component({
  selector: 'rsx-customer-credit-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-credit-edit.component.html',
  styleUrls: ['./customer-credit-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerCreditEditComponent implements OnChanges {
  @Input({ required: true })
  customerCreditRisk!: ICustomerCreditRisk;

  @Output()
  save = new EventEmitter<ICustomerCredit>();

  @Output()
  cancel = new EventEmitter<void>();

  public readonly form: FormGroup<CustomerCreditForm>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      customer: this.fb.nonNullable.group({
        age: [0, Validators.required],
        income: [0, Validators.required],
        employmentYears: [0, Validators.required],
      }),
      credit: this.fb.nonNullable.group({
        score: [0, Validators.required],
        outstandingDebt: [0, Validators.required],
      }),
    });
  }




  public get age(): FormControl<number> {
    return this.form.get('customer.age') as FormControl<number>;
  }

  public get income(): FormControl<number> {
    return this.form.get('customer.income') as FormControl<number>;
  }

  public get employmentYears(): FormControl<number> {
    return this.form.get('customer.employmentYears') as FormControl<number>;
  }

  public get score(): FormControl<number> {
    return this.form.get('credit.score') as FormControl<number>;
  }

  public get outstandingDebt(): FormControl<number> {
    return this.form.get('credit.outstandingDebt') as FormControl<number>;
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes['customerCreditRisk']) {
      return;
    }

    if (!this.customerCreditRisk) {
      return;
    }

    this.form.setValue({
      customer: {
        age: this.customerCreditRisk.customer.age,
        income: this.customerCreditRisk.customer.income,
        employmentYears: this.customerCreditRisk.customer.employmentYears,
      },
      credit: {
        score: this.customerCreditRisk.credit.score,
        outstandingDebt: this.customerCreditRisk.credit.outstandingDebt,
      },
    });
  }

  public onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updated: ICustomerCredit = {
      ...this.form.getRawValue(),
      id: this.customerCreditRisk.id,
    };

    this.save.emit(updated);
  }
}