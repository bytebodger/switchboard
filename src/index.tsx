import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './app/configuration/i18NextConfig';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { App } from './app/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
   <BrowserRouter>
      <App/>
   </BrowserRouter>
);