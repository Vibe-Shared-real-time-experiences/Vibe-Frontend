import { Provider } from 'react-redux'
import { router } from './router/router'
import { RouterProvider } from 'react-router-dom'
import { persistor, store } from './features/store'
import { PersistGate } from 'redux-persist/integration/react'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider >
  )
}

export default App