import logo from '@/assets/logo_transparent.webp'
import { observer } from 'mobx-react-lite'

export const Footer = observer(() => {
  return (
    <div className="mt-auto bg-milky font-body text-brown dark:bg-dark-900 dark:text-dark-50">
      <div className="mx-auto w-full max-w-screen-lg justify-center sm:flex sm:flex-row-reverse sm:items-start sm:px-0">
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4">
          <div className="mx-8 my-4">
            <h3 className="font-bold text-orange dark:text-brown">Social</h3>
            <a className="my-4 block text-sm" href="#" target="rhino_telegram">
              Telegram
            </a>
            <a className="my-4 block text-sm" href="#" target="rhino_twitter">
              Twitter
            </a>
            <a className="my-4 block text-sm" href="#" target="rhino_blog">
              Blog
            </a>
          </div>

          <div className="mx-8 my-4">
            <h3 className="font-bold text-orange dark:text-brown">Community</h3>
            <a className="my-4 block text-sm" href="#" target="rhino_chat">
              Rhino Chat
            </a>
            <a className="my-4 block text-sm" href="#" target="rhino_hub">
              Rhino Hub
            </a>
          </div>

          <div className="mx-8 my-4">
            <h3 className="font-bold text-orange dark:text-brown">Docs</h3>
            <a className="my-4 block text-sm" href="#" target="rhino_audits">
              Audits
            </a>
            <a className="my-4 block text-sm" href="#" target="rhino_github">
              GitHub
            </a>
            <a className="my-4 block text-sm" href="#" target="rhino_docs">
              Documentation
            </a>
          </div>

          <div className="mx-8 my-4">
            <h3 className="font-bold text-orange dark:text-brown">About</h3>
            <a className="my-4 block text-sm" href="#" target="rhino_roadmap">
              Roadmap
            </a>
            <a className="my-4 block text-sm" href="#" target="rhino_how">
              How Rhino Works?
            </a>
            <a className="my-4 block text-sm" href="#" target="rhino_why">
              Why Choose Rhino?
            </a>
          </div>
        </div>

        <div
          className="mx-8 my-8 flex select-none flex-row items-center gap-4 pb-16 font-logo text-2xl dark:text-orange"
          // onClick={model.switchNetwork}
        >
          <img src={logo} className="-ml-4 -mr-3 h-20" />
          <p>Rhino</p>
        </div>
      </div>
    </div>
  )
})
