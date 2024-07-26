import { useRootStore } from '@/app/providers'
import { observer } from 'mobx-react-lite'

export const TonCounter = observer(() => {
  const { tonCounterStore } = useRootStore()

  return (
    <div className="flex flex-row justify-between">
      <p>Currently value</p>
      <p>{tonCounterStore.formatedValue}</p>
    </div>
  )
})
