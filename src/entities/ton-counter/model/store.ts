import { RootStore } from '@/app/store'
import { SimpleCounter } from '@/shared/blockchain'
import { sleep } from '@/shared/lib'
import { Address, beginCell, fromNano, SenderArguments, storeStateInit, toNano } from '@ton/ton'
import { autorun, makeAutoObservable } from 'mobx'

const UPDATE_TIMES_DELAY = 5 * 60 * 1000
const DEFAULT_TTL = 5 * 60 * 1000

export class TonCounterStore {
  value: bigint | null = null
  rootStore: RootStore
  timeoutReadTimes?: ReturnType<typeof setTimeout>

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      timeoutReadTimes: false,
    })

    this.rootStore = rootStore

    autorun(() => {
      this.readCounterValue()
    })
  }

  get formatedValue() {
    if (this.value !== null) {
      return Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'code',
      })
        .format(this.value)
        .replace('USD', 'TON')
    }
  }

  setValue = (value: bigint | null) => {
    this.value = value
  }

  readCounterValue = async () => {
    const tonClient = this.rootStore.connectWalletStore.tonClient
    const counterAddress = 'EQChHss_qFXJI3xqct2ef8I8js1IzRdvk6-N01AUcsuRxp7F'

    clearTimeout(this.timeoutReadTimes)

    if (document.hidden) {
      return
    }

    this.timeoutReadTimes = setTimeout(this.readCounterValue, UPDATE_TIMES_DELAY)

    if (tonClient == null || counterAddress === null) {
      this.setValue(null)
      return
    }

    tonClient
      .open(SimpleCounter.fromAddress(Address.parse(counterAddress)))
      .getValue()
      .then(this.setValue)
    // .catch(() => {
    //   clearTimeout(this.timeoutReadTimes)
    //   this.timeoutReadTimes = setTimeout(this.readCounterValue, RETRY_DELAY)
    // })
  }

  writeCounterValue = async (value: number) => {
    const tonClient = this.rootStore.connectWalletStore.tonClient
    const tonConnectUI = this.rootStore.connectWalletStore.tonConnectUI
    const counterAddress = 'EQChHss_qFXJI3xqct2ef8I8js1IzRdvk6-N01AUcsuRxp7F'

    if (document.hidden) {
      return
    }

    if (tonClient == null || counterAddress === null) {
      return
    }

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
        const prevValue = this.value
        while (this.value === prevValue) {
          await sleep(3500)
          this.readCounterValue()
        }
      })
  }
}
