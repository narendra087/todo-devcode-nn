import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css';
import Root from './pages/Root';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/activity/:id",
        element: <Activity />
      }
    ]
  },
]);

const theme = extendTheme({
  colors: {
    primary: {
      100: '#16ABF8',
    },
    priority: {
      'very-high': '#ED4C5C',
      'high': '#F8A541',
      'normal': '#00A790',
      'low': '#428BC1',
      'very-low': '#8942C1'
    },
    text: {
      100: '#111111',
      200: '#888888',
    }
  },
  components:{
    Button: {
      baseStyle: {
        borderRadius: '45px',
        fontWeight: '600'
      },
      sizes: {
        md: {
          h: '54px',
          fontSize: '18px',
          padding: '13.5px 39px',
        }
      }
    }
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