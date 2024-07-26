import { useRootStore } from '@/app/providers'
import hton from '@/assets/hton.svg'
import ton from '@/assets/ton.svg'
import { useToggleTransactionType } from '@/feature/toggle-transaction-type'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { observer } from 'mobx-react-lite'

export const Stake = observer(() => {
  const { isStaking } = useToggleTransactionType()
  const {
    stakeStore: { isAmountValid, amount, setAmount, isButtonEnabled, setAmountToMax },
    tonCounterStore: { writeCounterValue },
  } = useRootStore()

  return (
    <div className="flex flex-col flex-1 p-5 relative will-change-transform break-words transition-all shadow-sm rounded-card border-[#41403e] border-2 border-solid">
      <h4 className="mt-0 mb-2">{isStaking ? 'Stake' : 'Unstake'}</h4>

      <Label>
        <div
          className={cn(
            'flex flex-row gap-2',
            !isAmountValid &&
              'border-orange focus-within:border-orange dark:border-orange dark:focus-within:border-orange',
          )}
        >
          <img src={ton} className={cn('w-7', !isStaking && 'hidden')} />
          <img src={hton} className={cn('w-7', isStaking && 'hidden')} />

          <Input
            type="text"
            inputMode="decimal"
            placeholder="Amount"
            size={1}
            className={cn(
              'h-full w-full flex-1 p-2 text-lg focus:outline-none',
              !isAmountValid && 'text-orange dark:text-orange',
            )}
            value={amount}
            onInput={(e) => {
              const target = e.target as HTMLInputElement
              setAmount(target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isButtonEnabled) {
                // TEST
                writeCounterValue(Number.parseInt(amount, 10))
                const button = document.querySelector<HTMLInputElement>('#submit')
                if (button != null) {
                  button.click()
                  const target = e.target as HTMLInputElement
                  target.blur()
                }
              }
            }}
          />
          <Button
            className={cn(
              'rounded-card border-2 border-[#41403e] text-[#41403e] bg-transparent self-center transition-all',
              !isAmountValid && 'bg-orange ',
            )}
            onClick={setAmountToMax}
          >
            Max
          </Button>
        </div>
      </Label>
    </div>
  )
})
