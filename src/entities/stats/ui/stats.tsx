import { useRootStore } from '@/app/providers'
import { TonCounter } from '@/entities/ton-counter'
import { Card, CardContent } from '@/shared/ui/card'
import { CircleHelp } from 'lucide-react'
import { observer } from 'mobx-react-lite'

export const Stats = observer(() => {
  const {
    statsStore: { explorerHref, protocolFee, currentlyStaked, apyFormatted },
  } = useRootStore()
  return (
    <div className="mx-auto w-full max-w-screen-lg font-body flex flex-col gap-2">
      <div className="flex flex-row items-center px-4">
        <p className="text-lg font-bold">Rhino statistics</p>
        <a href={explorerHref} target="rhino_explorer" className="ml-auto text-xs font-light">
          TON Explorer
        </a>
      </div>

      <Card className="text-sm">
        <CardContent className="flex flex-col gap-2 space-y-1.5 p-6">
          <div className="flex flex-row justify-between">
            <div className="relative flex flex-row gap-2 items-center">
              <p>APY</p>
              <CircleHelp className="w-4 h-4 peer" />
              <p className="absolute left-1/3 top-6 z-10 hidden -translate-x-1/4 rounded-lg bg-neutral-100 p-4 text-xs font-normal text-blue shadow-xl peer-hover:block">
                Your yearly earnings based on recent staking rewards.
              </p>
            </div>
            <p>{apyFormatted}</p>
          </div>

          <div className="flex flex-row justify-between">
            <div className="relative flex flex-row gap-2 items-center">
              <p>Protocol fee</p>
              <CircleHelp className="w-4 h-4 peer" />
              <p className="absolute left-1/3 top-6 z-10 hidden -translate-x-1/4 rounded-lg bg-neutral-100 p-4 text-xs font-normal text-blue shadow-xl peer-hover:block">
                This fee is subtracted from generated validator rewards, NOT your staked amount.
              </p>
            </div>
            <p>{protocolFee}</p>
          </div>

          <div className="flex flex-row justify-between">
            <p>Currently staked</p>
            <p>{currentlyStaked}</p>
          </div>

          <TonCounter />

          <div className="flex flex-row justify-center">
            <p>
              <a href="https://stats.hipo.finance" className="text-cyan-400" target="rhino_stats">
                More Stats
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
