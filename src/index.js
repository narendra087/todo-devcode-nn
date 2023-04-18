import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css';
import Root from './pages/Root';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
  },
]);

const theme = extendTheme({
  colors: {
    primary: {
      100: '#16ABF8',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#F4F4F4',
        color: '#111111',
        lineHeight: 1.5,
      }
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);