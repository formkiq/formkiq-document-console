import { act, render } from '@testing-library/react';
import 'reflect-metadata'
import { BrowserRouter } from 'react-router-dom';

import App from './app';
import { Provider } from 'react-redux';
import { store } from './Store/store';

describe('App', () => {
  it('should render successfully', async () => {

    const { baseElement } = await act( async () => render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    ) as any) as any

    expect(baseElement).toBeTruthy();
  });
});
