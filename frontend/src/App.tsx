import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <div className="App">
     <RouterProvider router={router} />
     <Toaster
        position="top-center"
        reverseOrder={false}
        containerClassName="toast-container-custom"
        toastOptions={{
          success: {
            
            style: {
              backgroundColor: "#009049",
              color: "#fff",
              fontSize: "16px",
            },
          },
          error: {
            style: {
              backgroundColor: "red",
              color: "#fff",
              fontSize: "16px",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
