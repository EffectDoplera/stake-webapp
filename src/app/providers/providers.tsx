import { FC } from 'react'
import { StoreProvider } from './store-provider'

interface ProvidersProps {
  readonly children: JSX.Element
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return <StoreProvider>{children}</StoreProvider>
}
