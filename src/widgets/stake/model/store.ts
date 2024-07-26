import { RootStore } from '@/app/store'
import { fromNano, toNano } from '@ton/ton'
import { makeAutoObservable } from 'mobx'

export class StakeStore {
  public rootStore: RootStore
  public amount = ''
  public tonBalance: bigint | null = null

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    makeAutoObservable(this)
  }

  get maxAmount() {
    return 0n
  }

  get amountInNano() {
    const amount = this.amount.trim()
    try {
      return toNano(amount)
    } catch {
      return undefined
    }
  }

  get isAmountValid() {
    const nano = this.amountInNano
    return nano !== null && nano !== undefined && nano >= 0n && (this.tonBalance === null || nano <= this.maxAmount)
  }

  get isButtonEnabled() {
    return true
  }

  setAmount = (amount: string) => {
    this.amount = amount
  }

  setAmountToMax = () => {
    this.amount = fromNano(this.maxAmount)
  }
}
