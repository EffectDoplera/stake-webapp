import { Address, fromNano, toNano } from '@ton/ton'
import { CHAIN, THEME, TonConnectUI } from '@tonconnect/ui'
import { makeAutoObservable, runInAction } from 'mobx'

const tonConnectButtonRootId = 'ton-connect-button'

export class Model {
  tonConnectUI?: TonConnectUI
  tonBalance?: bigint
  amount = ''
  address?: Address

  constructor() {
    makeAutoObservable(this)
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

  setAmount = (amount: string) => {
    this.amount = amount
  }

  setAmountToMax = () => {
    this.amount = fromNano(this.maxAmount)
  }

  setAddress = (address?: Address) => {
    this.address = address
    this.tonBalance = undefined
  }

  init = () => {
    this.initTonConnect()
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
}

function formatPercent(amount: number): string {
  return amount.toLocaleString(undefined, {
    style: 'percent',
    maximumFractionDigits: 2,
  })
}
