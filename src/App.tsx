import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routers/routes';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  return <RouterProvider router={router} />;
};
