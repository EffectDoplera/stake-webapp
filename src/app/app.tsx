import { RootPage } from '@/pages'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { observer } from 'mobx-react-lite'
import { Providers } from './providers'

const App = observer(() => {
  return (
    <Providers>
      <>
        <Header />
        <main className="grid place-content-center text-4xl gap-4 mx-auto w-full max-w-screen-lg">
          <RootPage />

          {/* <div
          className={
            'h-8 transition-all duration-700 motion-reduce:transition-none' +
            (model.isWalletConnected ? ' max-h-0' : ' max-h-8')
          }
        ></div> */}
        </main>
        <Footer />
      </>
    </Providers>
  )
})

export default App
