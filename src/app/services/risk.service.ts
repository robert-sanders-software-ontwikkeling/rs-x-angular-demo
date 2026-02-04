import { Injectable } from '@angular/core';

export interface IMarket {
  readonly baseInterestRate: number;
}

export interface IRisk {
  readonly volatilityIndex: number;
  readonly recessionProbability: number;
}

export interface IRiskCalcParameters {
  readonly market: IMarket;
  readonly risk: IRisk;
}

@Injectable({ providedIn: 'root' })
export class RiskService {
  private riskCalcParameters: IRiskCalcParameters;

  constructor() {
    this.riskCalcParameters = {
      market: {
        baseInterestRate: 0.035
      },
      risk: {
        volatilityIndex: 0.28,
        recessionProbability: 0.12,
      },
    };
  }

  public async getRiskCalcParameters(): Promise<IRiskCalcParameters> {
    return JSON.parse(JSON.stringify(this.riskCalcParameters));
  }

  public async updateMarket(updates: Partial<IMarket>): Promise<IMarket> {
    Object.assign(this.riskCalcParameters.market, updates);
    return { ...this.riskCalcParameters.market };
  }

  public async updateRisk(updates: Partial<IRisk>): Promise<IRisk> {
    Object.assign(this.riskCalcParameters.risk, updates);
    return { ...this.riskCalcParameters.risk };
  }
}