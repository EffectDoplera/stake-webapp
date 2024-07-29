import { useRootStore } from '@/app/providers'
import hton from '@/assets/hton.svg'
import ton from '@/assets/ton.svg'
import { useToggleTransactionType } from '@/feature/toggle-transaction-type'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  amount: z.string(),
})

export const Stake = observer(() => {
  const { isStaking } = useToggleTransactionType()
  const {
    tonCounterStore: { writeCounterValue },
  } = useRootStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col flex-1 p-5 relative will-change-transform break-words transition-all shadow-sm rounded-card border-[#41403e] border-2 border-solid"
        onSubmit={form.handleSubmit(async (data) => {
          await writeCounterValue(Number.parseInt(data.amount, 10))
          form.setValue('amount', '')
        })}
      >
        <h4 className="mt-0 mb-2">{isStaking ? 'Stake' : 'Unstake'}</h4>

        <FormField
          name="amount"
          render={({ field }) => (
            <FormItem className={'flex flex-row gap-2 items-center'}>
              <FormLabel>
                <img src={ton} className={cn('w-7', !isStaking && 'hidden')} />
                <img src={hton} className={cn('w-7', isStaking && 'hidden')} />
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  inputMode="decimal"
                  placeholder="Amount"
                  size={1}
                  className="h-full w-full flex-1 p-2 text-lg focus:outline-none"
                />
              </FormControl>
              <Button
                type="submit"
                className={cn(
                  'rounded-card border-2 border-[#41403e] text-[#41403e] bg-transparent self-center transition-all',
                )}
              >
                {isStaking ? 'Stake' : 'Unstake'}
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})
