import * as React from 'react';
import { render } from 'react-dom';
import { DrizzleProvider } from "drizzle-react";

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './redux/store';
import { drizzleOptions } from './drizzleOptions'

render(
  <DrizzleProvider options={drizzleOptions} store={store}>
    <App />
  </DrizzleProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
