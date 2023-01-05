import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { store, RootState } from '../Store/store'
// As a basic setup, import your same slice reducers

import authMiddleware from '../Store/middleware/auth'
import authReducer from '../Store/reducers/auth'
import configMiddleware from '../Store/middleware/config'
import configReducer from '../Store/reducers/config'
import dataCacheReducer from '../Store/reducers/data'
import documentsReducer from '../Store/reducers/documentsList'
import globalConfirmControls from '../Store/reducers/globalConfirmControls'
import globalNotificationControls from '../Store/reducers/globalNotificationControls'
import globalProgressControls from '../Store/reducers/globalProgressControls'
import thunkMiddleware from 'redux-thunk'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: typeof store
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    // Automatically create a store instance if no store was passed in
    store = configureStore({
        reducer: {
            authReducer,
            configReducer,
            dataCacheReducer,
            documentsReducer,
            globalConfirmControls,
            globalNotificationControls,
            globalProgressControls
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
        }).prepend(authMiddleware.middleware).prepend(configMiddleware.middleware).concat(thunkMiddleware),
        devTools: true
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}