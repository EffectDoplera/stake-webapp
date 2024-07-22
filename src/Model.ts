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
