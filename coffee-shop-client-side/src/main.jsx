import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/Route';
import UtilitiesProviders from './providers/UtilitiesProviders/UtilitiesProviders';
import AuthProviders from './providers/AuthProviders/AuthProviders';
import { Worker } from '@react-pdf-viewer/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>

     <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
    <AuthProviders>
      <UtilitiesProviders>
        <RouterProvider router={router} />
      </UtilitiesProviders>
    </AuthProviders>
    </Worker>
    </QueryClientProvider>,

  </React.StrictMode>,
)
