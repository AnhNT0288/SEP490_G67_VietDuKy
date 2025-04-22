import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Environment } from './environments/Environment';

const clientId = Environment.GOOGLE_CLIENT_ID;
const root = ReactDOM.createRoot(document.getElementById('root'));

if (!clientId) {
  console.error("GOOGLE_CLIENT_ID is not defined. Check your .env file.");
}
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
