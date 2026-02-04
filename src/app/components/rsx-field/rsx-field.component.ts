import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RsxPipe } from '@rs-x/angular';

@Component({
  selector: 'rsx-field',
  standalone: true,
  imports: [ RsxPipe],
  template: ' {{ expression | rsx: model }}',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RsxField {
    @Input()  expression!: string;
    @Input()  model!: object;
}