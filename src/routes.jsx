import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

export const renderRoutes = (routes = []) => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Element = route.element;

          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Guard>
                  <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
                </Guard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export const publicRoutes = [
  {
    exact: 'true',
    path: '/auth/login',
    element: lazy(() => import('./views/auth/signin/Login'))
  },
  {
    exact: 'true',
    path: '*',
    element: () => <Navigate to="/auth/login" />
  }
];

export const protectedRoutes = [
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/reports',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/admin/users',
        element: lazy(() => import('./views/admin/users'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/admin/add-user',
        element: lazy(() => import('./views/admin/add-user'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/admin/edit-user',
        element: lazy(() => import('./views/admin/edit-user'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/profile'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/categories/categories-list',
        element: lazy(() => import('./views/categories/categories-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/categories/add-category',
        element: lazy(() => import('./views/categories/add-category'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/categories/edit-category',
        element: lazy(() => import('./views/categories/edit-category'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/reports/reports-list',
        element: lazy(() => import('./views/reports/reports-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/diseases/diseases-list',
        element: lazy(() => import('./views/diseases/diseases-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/diseases/add-disease',
        element: lazy(() => import('./views/diseases/add-disease'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/diseases/edit-disease',
        element: lazy(() => import('./views/diseases/edit-disease'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/diseases/image-gallery',
        element: lazy(() => import('./views/diseases/image-gallery'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/diseases/video-gallery',
        element: lazy(() => import('./views/diseases/video-gallery'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/trivia/trivias-list',
        element: lazy(() => import('./views/trivia/trivias-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/profile/*',
        element: lazy(() => import('./views/profile'))
      },
      {
        exact: 'true',
        path: '*',
        element: () => <Navigate to="/app/dashboard/reports" />
      }
    ]
  }
];
