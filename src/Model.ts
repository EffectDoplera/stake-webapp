import { THEME, TonConnectUI } from '@tonconnect/ui'
import { makeAutoObservable } from 'mobx'

const tonConnectButtonRootId = 'ton-connect-button'

export class Model {
  tonConnectUI?: TonConnectUI

  constructor() {
    makeAutoObservable(this)
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
  }
}
