import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import '@fontsource/poppins/300.css';
// import '@fontsource/poppins/400.css';
// import '@fontsource/poppins/500.css';
// import '@fontsource/poppins/700.css'
import '@fontsource/patrick-hand-sc'
import './index.css'
import { Model } from './Model.ts'

const model = new Model()
model.init()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App model={model} />
  </React.StrictMode>,
)
