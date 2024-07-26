import { RootStore } from '@/app/store'
import { formatPercent } from '@/shared/lib'
import { makeAutoObservable } from 'mobx'

export class StatsStore {
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    makeAutoObservable(this)

    this.rootStore = rootStore
  }

  get protocolFee() {
    const governanceFee = 5000
    if (governanceFee !== null) {
      return formatPercent(Number(governanceFee) / 65535)
    }
  }

  get currentlyStaked() {
    return Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'code',
    })
      .format(806024)
      .replace('USD', 'TON')
  }

  get apy() {
    // const times = this.times
    // const lastStaked = this.treasuryState?.lastStaked
    // const lastRecovered = this.treasuryState?.lastRecovered
    // if (times !== null && lastStaked !== null && lastRecovered !== null) {
    //   const duration = 2 * Number(times.nextRoundSince - times.currentRoundSince)
    //   const year = 365 * 24 * 60 * 60
    //   const compoundingFrequency = year / duration
    //   return Math.pow(Number(lastRecovered) / Number(lastStaked) || 1, compoundingFrequency) - 1
    // }

    return 0.0341
  }

  get apyFormatted() {
    if (this.apy !== null) {
      return formatPercent(this.apy)
    }
  }

  get explorerHref() {
    // const treasuryAddress = treasuryAddresses.get(this.network)
    // let address = ''
    // if (treasuryAddress != null) {
    //   address = treasuryAddress.toString({ testOnly: !this.isMainnet })
    // }
    // return (this.isMainnet ? 'https://tonviewer.com/' : 'https://testnet.tonviewer.com/') + address
    return 'https://testnet.tonviewer.com/'
  }
}
