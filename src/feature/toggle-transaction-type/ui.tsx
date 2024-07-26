import { cn } from '@/shared/lib'
import { observer } from 'mobx-react-lite'
import { useToggleTransactionType } from './model'

export const ToggleTransactionType = observer(() => {
  const { setStakeTab, isStaking } = useToggleTransactionType()
  return (
    <div className="bg-transparent w-1/2 m-auto h-12 cursor-pointer select-none perspective">
      <ul
        className={cn(
          'border-2 rounded-card border-[#41403e] bg-transparent h-full w-full relative transition-transform duration-800 preserve-3d',
          isStaking && 'rotate-x-180',
        )}
        onClick={() => {
          setStakeTab(isStaking ? 'UNSTAKE' : 'STAKE')
        }}
      >
        <li className="px-2 absolute h-full w-full text-center backface-hidden shadow-lg">Stake</li>

        <li className="px-2 absolute h-full w-full text-center backface-hidden rotate-180 shadow-lg rotate-x-180">
          Unstake
        </li>
      </ul>
    </div>
  )
})
