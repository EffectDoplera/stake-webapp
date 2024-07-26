import { SimpleCounter } from '@/blockchain/wrappers/SimpleCounter'
import { RootStore } from '@/Model'
import { Address, beginCell, fromNano, SenderArguments, storeStateInit, toNano } from '@ton/ton'
import { makeAutoObservable } from 'mobx'

const DEFAULT_TTL = 5 * 60 * 1000

export class StakeStore {
  public rootStore: RootStore
  public amount = ''
  public value?: bigint | null = null
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

  setValue = (value?: bigint) => {
    this.value = value
  }

  writeCounterValue = async (value: number) => {
    const tonClient = this.rootStore.connectWalletStore.tonClient
    const tonConnectUI = this.rootStore.connectWalletStore.tonConnectUI

    console.log({ tonConnectUI })

    const counterAddress = 'EQChHss_qFXJI3xqct2ef8I8js1IzRdvk6-N01AUcsuRxp7F'
    if (document.hidden) {
      return
    }

    if (tonClient == null || counterAddress === null) {
      return
    }

    console.log('acc', tonConnectUI!.account)

    const sender = {
      send: async (args: SenderArguments) => {
        tonConnectUI!.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(10),
              stateInit: args.init
                ? beginCell().storeWritable(storeStateInit(args.init)).endCell().toBoc().toString('base64')
                : undefined,
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + DEFAULT_TTL,
        })
      },
      address: tonConnectUI!.account ? Address.parse(tonConnectUI!.account.address) : undefined,
    }

    tonClient
      .open(SimpleCounter.fromAddress(Address.parse(counterAddress)))
      .send(
        sender,
        {
          value: toNano('0.05'),
        },
        {
          $$type: 'Add',
          amount: toNano(fromNano(value)),
        },
      )
      .then(async () => {
        // const prevValue = this.value
        // while (this.value === prevValue) {
        //   await sleep(3500)
        //   readCounterValue()
        // }
      })
  }
}
