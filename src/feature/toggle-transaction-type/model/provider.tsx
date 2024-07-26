import React from 'react'
import { ToggleTransactionTypeStore } from './store'

const ToggleTransactionTypeContext = React.createContext<ToggleTransactionTypeStore | null>(null)

export const ToggleTransactionTypeProvider = ({ children }: { children: React.ReactNode }) => {
  const store = React.useMemo(() => new ToggleTransactionTypeStore(), [])

  return <ToggleTransactionTypeContext.Provider value={store}>{children}</ToggleTransactionTypeContext.Provider>
}

export const useToggleTransactionType = () => {
  const store = React.useContext(ToggleTransactionTypeContext)
  if (!store) {
    throw new Error('useToggleTransactionType must be used within a ToggleTransactionTypeProvider')
  }

  return store
}
