import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { observer } from 'mobx-react-lite'
import type { Model } from './Model'

interface AppProps {
  model: Model
}

const App = observer(({ model }: AppProps) => {
  return (
    <>
      <Header model={model} />
      <main className="grid place-content-center text-4xl">
        <div className="text-center">
          <h1>Rhino</h1>
          <p>Stake TON and receive rTON while staking</p>
        </div>
      </main>
      <Footer model={model} />
    </>
  )
})

export default App
