import { Stats } from '@/entities/stats'
import { ToggleTransactionType, ToggleTransactionTypeProvider } from '@/feature/toggle-transaction-type'
import { Stake } from '@/widgets/stake'

export const RootPage = () => {
  return (
    <ToggleTransactionTypeProvider>
      <div className="text-center">
        <h1 className="pt-4 text-center text-3xl font-bold">Rhino</h1>
        <p className="my-8 text-center">Stake TON and receive rTON while staking</p>
      </div>

      <ToggleTransactionType />
      <Stake />
      <Stats />
    </ToggleTransactionTypeProvider>
  )
}
