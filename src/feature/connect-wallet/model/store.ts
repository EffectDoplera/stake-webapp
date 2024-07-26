import { getHttpV4Endpoint, Network } from '@orbs-network/ton-access'
import { Address, TonClient4 } from '@ton/ton'
import { CHAIN, THEME, TonConnectUI } from '@tonconnect/ui'
import { autorun, makeAutoObservable, runInAction } from 'mobx'

const tonConnectButtonRootId = 'ton-connect-button'

export class ConnectWalletStore {
  walletConnected = false
  network: Network = 'testnet'
  tonClient?: TonClient4
  tonConnectUI?: TonConnectUI
  address: Address | null = null

  timeoutConnectTonAccess?: ReturnType<typeof setTimeout>
  timeoutReadTimes?: ReturnType<typeof setTimeout>

  constructor() {
    makeAutoObservable(this, {
      timeoutConnectTonAccess: false,
      timeoutReadTimes: false,
    })
  }

  public get isWalletConnected() {
    return this.address !== null
  }

  public setWalletConnected = (walletConnected: boolean) => {
    this.walletConnected = walletConnected
  }

  setAddress = (address: Address | null) => {
    this.address = address
  }

  setTonClient = (endpoint: string) => {
    this.tonClient = new TonClient4({ endpoint })
  }

  initTonConnect = () => {
    if (document.getElementById(tonConnectButtonRootId) !== null) {
      this.connectWallet()
    } else {
      setTimeout(this.initTonConnect, 10)
    }
  }

  init = () => {
    this.initTonConnect()

    autorun(() => {
      this.connectTonAccess()
    })

    // autorun(() => {
    //   console.log('val', this.value)
    // })

    // autorun(() => {
    //   this.readCounterValue()
    // })
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
            this.setAddress(null)
            // this.setErrorMessage(errorMessageNetworkMismatch + (this.isMainnet ? 'MainNet' : 'TestNet'), 10000)
          })
        }
      } else {
        this.setAddress(null)
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
}
