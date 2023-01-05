import 'reflect-metadata'
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/Store/store'
import { Provider } from 'react-redux'
import App from './app/app';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('ORg4AjUWIQA/Gnt2VVhhQlFacF5JXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0djXX5WdHxVT2hVWUA=');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
