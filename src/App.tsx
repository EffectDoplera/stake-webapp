import hton from '@/assets/hton.svg'
import ton from '@/assets/ton.svg'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import type { Model } from './Model'

interface AppProps {
  model: Model
}

const App = observer(({ model }: AppProps) => {
  const [stakeTab, setStakeTab] = useState<'STAKE' | 'UNSTAKE'>('STAKE')

  return (
    <>
      <Header model={model} />
      <main className="grid place-content-center text-4xl gap-4">
        <div className="text-center">
          <h1 className="pt-4 text-center text-3xl font-bold">Rhino</h1>
          <p className="my-8 text-center">Stake TON and receive rTON while staking</p>
        </div>

        <div
          className="bg-transparent w-1/2 m-auto h-12 cursor-pointer"
          style={{
            perspective: '1000px',
          }}
        >
          <ul
            className="bg-transparent border-transparent h-full w-full relative transition-transform duration-800 "
            style={{
              borderBottomLeftRadius: '15px 255px',
              borderBottomRightRadius: '225px 15px',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderColor: '#41403e',
              // borderColor: 'var(--primary)',
              borderStyle: 'solid',
              borderWidth: '2px',
              transformStyle: 'preserve-3d',
              ...(stakeTab === 'STAKE' && {
                transform: 'rotateX(180deg)',
              }),
            }}
            onClick={() => {
              setStakeTab((prev) => (prev === 'STAKE' ? 'UNSTAKE' : 'STAKE'))
            }}
          >
            <li
              className="px-2"
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                textAlign: 'center',
                boxShadow: '2px 8px 8px -5px rgba(0, 0, 0, 0.3)',
              }}
            >
              Stake
            </li>
            <li
              className="px-2"
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                textAlign: 'center',
                boxShadow: '2px 8px 8px -5px rgba(0, 0, 0, 0.3)',
                transform: 'rotateX(180deg)',
              }}
            >
              Unstake
            </li>
          </ul>
        </div>

        <div
          className={
            'h-8 transition-all duration-700 motion-reduce:transition-none' +
            (model.isWalletConnected ? ' max-h-0' : ' max-h-8')
          }
        ></div>

        <div
          className="flex flex-col flex-1 p-5 relative will-change-transform break-words transition-all shadow-sm border-[#41403e] border-2 border-solid"
          style={{
            borderBottomLeftRadius: '15px 255px',
            borderBottomRightRadius: '225px 15px',
            borderTopLeftRadius: '255px 15px',
            borderTopRightRadius: '15px 225px',
          }}
        >
          <h4 className="mt-0 mb-2">{stakeTab === 'STAKE' ? 'Stake' : 'Unstake'}</h4>

          <Label>
            <div
              className={
                'flex flex-row gap-2' +
                (model.isAmountValid
                  ? ''
                  : 'border-orange focus-within:border-orange dark:border-orange dark:focus-within:border-orange')
              }
            >
              <img src={ton} className={'w-7' + (stakeTab === 'STAKE' ? '' : ' hidden')} />
              <img src={hton} className={'w-7' + (stakeTab === 'STAKE' ? ' hidden' : '')} />

              <Input
                type="text"
                inputMode="decimal"
                placeholder="Amount"
                size={1}
                className={
                  'h-full w-full flex-1 px-3 text-lg focus:outline-none dark:bg-dark-900 dark:text-dark-50' +
                  (model.isAmountValid ? '' : ' text-orange dark:text-orange')
                }
                style={{
                  color: '#41403e',
                  // color: 'var(--primary)',
                  borderColor: '#41403e',
                  // borderColor: 'var(--primary)',
                  background: 'transparent',
                  borderBottomLeftRadius: '15px 255px',
                  borderBottomRightRadius: '225px 15px',
                  borderStyle: 'solid',
                  borderTopLeftRadius: '255px 15px',
                  borderTopRightRadius: '15px 225px',
                  borderWidth: '2px',
                  display: 'block',
                  fontSize: '1rem',
                  outline: 'none',
                  padding: '0.5rem',
                }}
                value={model.amount}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  model.setAmount(target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && model.isButtonEnabled) {
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
                className={
                  'rounded-lg bg-milky px-3 text-xs hover:bg-gray-200 focus:outline-none active:bg-gray-300 dark:text-dark-600' +
                  (model.isAmountValid
                    ? ''
                    : ' bg-orange text-white hover:!bg-brown active:!bg-dark-600 dark:hover:text-dark-50')
                }
                style={{
                  borderBottomLeftRadius: '15px 255px',
                  borderBottomRightRadius: '225px 15px',
                  borderTopLeftRadius: '255px 15px',
                  borderTopRightRadius: '15px 225px',
                  transition: 'all 235ms ease 0s',
                  boxShadow: '15px 28px 25px -18px rgba(0, 0, 0, 0.2)',
                  // transition: 'all 235ms ease-in-out 0s',
                  color: '#41403e',
                  // color: 'var(--primary)',
                  borderColor: '#41403e',
                  // borderColor: 'var(--primary)',
                  // backgroundColor: '#41403e',
                  backgroundColor: 'var(--main-background)',
                  alignSelf: 'center',
                  borderStyle: 'solid',
                  borderWidth: '2px',
                  fontSize: '1rem',
                  outline: 'none',
                }}
                onClick={model.setAmountToMax}
              >
                Max
              </Button>
            </div>
          </Label>
        </div>
      </main>
      <Footer model={model} />
    </>
  )
})

export default App
