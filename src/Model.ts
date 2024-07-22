import { getHttpV4Endpoint, Network } from '@orbs-network/ton-access'
import { Address, beginCell, fromNano, SenderArguments, storeStateInit, toNano, TonClient4 } from '@ton/ton'
import { CHAIN, THEME, TonConnectUI } from '@tonconnect/ui'
import { autorun, makeAutoObservable, runInAction } from 'mobx'
import { SimpleCounter } from './blockchain/wrappers/SimpleCounter'

const tonConnectButtonRootId = 'ton-connect-button'

const UPDATE_TIMES_DELAY = 5 * 60 * 1000
// const RETRY_DELAY = 3 * 1000
const DEFAULT_TTL = 5 * 60 * 1000

export class Model {
  network: Network = 'testnet'
  tonClient?: TonClient4
  tonConnectUI?: TonConnectUI
  tonBalance?: bigint
  amount = ''
  address?: Address
  value?: bigint

  timeoutConnectTonAccess?: ReturnType<typeof setTimeout>
  timeoutReadTimes?: ReturnType<typeof setTimeout>

  constructor() {
    makeAutoObservable(this, {
      timeoutConnectTonAccess: false,
      timeoutReadTimes: false,
    })
  }

  get isWalletConnected() {
    return this.address !== null
  }

  get maxAmount() {
    const tonBalance = this.tonBalance
    return tonBalance ?? 0n
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

  get formatedValue() {
    if (this.value != null) {
      return this.value.toLocaleString()
    }
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

  setAddress = (address?: Address) => {
    this.address = address
    this.tonBalance = undefined
  }

  setTonClient = (endpoint: string) => {
    this.tonClient = new TonClient4({ endpoint })
  }

  init = () => {
    this.initTonConnect()

    autorun(() => {
      this.connectTonAccess()
    })

    autorun(() => {
      console.log('val', this.value)
    })

    autorun(() => {
      this.readCounterValue()
    })
  }

  initTonConnect = () => {
    if (document.getElementById(tonConnectButtonRootId) !== null) {
      this.connectWallet()
    } else {
      setTimeout(this.initTonConnect, 10)
    }
  }

  connectWallet = () => {
    this.tonConnectUI = new TonConnectUI({
      manifestUrl: 'https://app.hipo.finance/tonconnect-manifest.json',
      buttonRootId: tonConnectButtonRootId,
      actionsConfiguration: {
        twaReturnUrl: 'https://t.me/HipoFinanceBot',
      },
      uiPreferences: {
        theme: THEME.LIGHT,
        colorsSet: {
          [THEME.LIGHT]: {
            connectButton: {
              background: '#fff',
              foreground: '#41403e',
            },
          },
        },
      },
    })

    this.tonConnectUI.onStatusChange((wallet) => {
      if (wallet !== null) {
        const chain = wallet.account.chain
        if (chain === CHAIN.MAINNET || chain === CHAIN.TESTNET) {
          this.setAddress(Address.parseRaw(wallet.account.address))
        } else {
          void this.tonConnectUI?.disconnect()
          runInAction(() => {
            this.setAddress(undefined)
            // this.setErrorMessage(errorMessageNetworkMismatch + (this.isMainnet ? 'MainNet' : 'TestNet'), 10000)
          })
        }
      } else {
        this.setAddress(undefined)
      }
    })
  }

  connectTonAccess = () => {
    const network = this.network
    clearTimeout(this.timeoutConnectTonAccess)
    if (document.hidden) {
      return
    }
    getHttpV4Endpoint({ network })
      .then(this.setTonClient)
      .catch(() => {
        // this.timeoutConnectTonAccess = setTimeout(this.connectTonAccess, RETRY_DELAY)
      })
  }

  readCounterValue = async () => {
    const tonClient = this.tonClient
    const counterAddress = 'EQChHss_qFXJI3xqct2ef8I8js1IzRdvk6-N01AUcsuRxp7F'
    clearTimeout(this.timeoutReadTimes)
    if (document.hidden) {
      return
    }
    this.timeoutReadTimes = setTimeout(this.readCounterValue, UPDATE_TIMES_DELAY)

    if (tonClient == null || counterAddress == null) {
      this.setValue(undefined)
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
    const tonClient = this.tonClient
    const counterAddress = 'EQChHss_qFXJI3xqct2ef8I8js1IzRdvk6-N01AUcsuRxp7F'
    if (document.hidden) {
      return
    }

    if (tonClient == null || counterAddress == null) {
      return
    }

    const sender = {
      send: async (args: SenderArguments) => {
        this.tonConnectUI!.sendTransaction({
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
      address: this.tonConnectUI!.account ? Address.parse(this.tonConnectUI!.account.address) : undefined,
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatPercent(amount: number): string {
  return amount.toLocaleString(undefined, {
    style: 'percent',
    maximumFractionDigits: 2,
  })
}
