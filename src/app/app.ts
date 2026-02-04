import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomerCreditTableComponent } from './components/customer-credit-table/customer-credit-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [CustomerCreditTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class App {
    
  public readonly model = {
      a: 10,
      b: 20
  };
}
