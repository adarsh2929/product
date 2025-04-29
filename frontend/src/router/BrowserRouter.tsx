import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import  GlobalLayout  from '../layouts/Global';
import Product from '../pages/Product';



const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
          {
            path: "/",
            element: <GlobalLayout />,
            children: [
              {
                index: true,
                element: <Product />,
              },
            ],
          },
        ],
      },
]);


export default router;

