import { StatsStore } from '@/entities/stats'
import { TonCounterStore } from '@/entities/ton-counter'
import { ConnectWalletStore } from '@/feature/connect-wallet'
import { StakeStore } from '@/widgets/stake/model/store'
import { makeAutoObservable } from 'mobx'

export class RootStore {
  connectWalletStore: ConnectWalletStore
  stakeStore: StakeStore
  statsStore: StatsStore
  tonCounterStore: TonCounterStore
  constructor() {
    makeAutoObservable(this)

    this.connectWalletStore = new ConnectWalletStore()
    this.stakeStore = new StakeStore(this)
    this.statsStore = new StatsStore(this)
    this.tonCounterStore = new TonCounterStore(this)
  }
}

export const store = new RootStore()
