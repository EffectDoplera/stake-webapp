import { makeAutoObservable } from 'mobx'

export type StakeTab = 'STAKE' | 'UNSTAKE'

export class ToggleTransactionTypeStore {
  public stakeTab: StakeTab = 'STAKE'

  constructor() {
    makeAutoObservable(this)
  }

  get isStaking() {
    return this.stakeTab === 'STAKE'
  }

  get stakeTabValue() {
    return this.stakeTab
  }

  public setStakeTab = (stakeTab: StakeTab) => {
    this.stakeTab = stakeTab
  }
}
