import { useRootStore } from '@/app/providers'
import { observer } from 'mobx-react-lite'

export const TonCounter = observer(() => {
  const { tonCounterStore } = useRootStore()

  return (
    <div className="flex flex-row justify-between items-center text-fuchsia-600">
      <p>Currently staked [DEMO]</p>
      <p className="text-xl border-2 border-dotted border-fuchsia-600 px-2">{tonCounterStore.formatedValue}</p>
    </div>
  )
})
