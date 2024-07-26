import React from 'react'
import { store, type RootStore } from '../store'

// TODO: fix it
store.connectWalletStore.init()

const RootStoreContext = React.createContext<RootStore | null>(null)

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>
}

export const useRootStore = () => {
  const store = React.useContext(RootStoreContext)

  if (!store) throw new Error('useRootStore must be used within a StoreProvider')

  return store
}
