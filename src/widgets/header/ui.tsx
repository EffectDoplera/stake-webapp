import logo from '@/assets/logo_transparent.webp'
import type { Model } from '@/Model'
import { observer } from 'mobx-react-lite'

interface HeaderProps {
  model: Model
}

export const Header = observer(({ model }: HeaderProps) => {
  console.log(model)
  return (
    <header className="mx-auto w-full max-w-screen-lg font-body text-black dark:text-dark-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center justify-center gap-1">
          <img src={logo} className="h-16 w-16" />
          <h5>Rhino</h5>
        </div>
        <div id="ton-connect-button" className="min-w-max"></div>
      </div>
    </header>
  )
})
