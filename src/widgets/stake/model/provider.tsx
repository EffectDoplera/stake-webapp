import { RootStore } from '@/app/store'
import React from 'react'
import { StakeStore } from './store'

const StakeContext = React.createContext<StakeStore | null>(null)
const store = new RootStore().stakeStore

export const StakeProvider = ({ children }: { children: React.ReactNode }) => {
  return <StakeContext.Provider value={store}>{children}</StakeContext.Provider>
}

export const useStake = () => {
  const store = React.useContext(StakeContext)
  if (!store) {
    throw new Error('useStake must be used within a StakeProvider')
  }

  return store
}
