import { IMarket } from './market.interface';
import { IRisk } from './risk.interface';

export interface IRiskCalcParameters {
  readonly market: IMarket;
  readonly risk: IRisk;
}