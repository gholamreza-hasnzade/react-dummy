import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ProductList } from '@/modules/product/views/ProductList';
import { ProductDetail } from '@/modules/product/views/detail/ProductDetail';

export const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  ),
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProductList,
});

export const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: ProductDetail,
});

export const routeTree = rootRoute.addChildren([indexRoute, productRoute]);
