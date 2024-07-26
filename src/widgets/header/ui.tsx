import logo from '@/assets/logo_transparent.webp'
import { ConnectWalletButton } from '@/feature/connect-wallet'
import { observer } from 'mobx-react-lite'

export const Header = observer(() => {
  return (
    <header className="mx-auto w-full max-w-screen-lg font-body text-black dark:text-dark-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-1">
          <img src={logo} className="h-16 w-16" />
          <h5>Rhino</h5>
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  )
})
