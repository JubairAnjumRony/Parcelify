import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './Routes/Routes'
import AuthProvider from './Providers/AuthProvider'
// Create a client
const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <StrictMode>
       <AuthProvider>
    
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
        {/* <Toaster position='top-right' reverseOrder={false} /> */}
     
    </AuthProvider>
  </StrictMode>,
)

