import { createBrowserRouter } from "react-router";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import MainLayout from "../Layouts/MainLayouts";
import Home from "../Pages/ErrorPage/Home/Home";
import Login from "../Pages/ErrorPage/login/Login";
import SignUp from "../Pages/ErrorPage/signUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Layouts/Dashboard";
import BookParcel from "../Pages/ErrorPage/Dashboard/user/BookParcel";
import MyProfile from "../Pages/ErrorPage/Dashboard/user/MyProfile";
import MyParcel from "../Pages/ErrorPage/Dashboard/user/MyParcel";
import UpdateParcel from "../Pages/ErrorPage/Dashboard/user/UpdateParcel";
import AdminRoute from "./AdminRoute";
import Statistics from "../Pages/ErrorPage/Dashboard/Admin/Statistics/Statistics";
import AllUsers from "../Pages/ErrorPage/Dashboard/Admin/AllUsers/AllUsers";
import AllParcel from "../Pages/ErrorPage/Dashboard/Admin/AllParcel/AllParcel";
import AllDeliveryMen from "../Pages/ErrorPage/Dashboard/Admin/AllDeliveryMen/AllDeliveryMen";
import DeliveryMenRoute from "./DeliveryMenRoute";
import MyReviews from "../Pages/ErrorPage/Dashboard/DeliveryMen/MyReviews";
import MyDeliveries from "../Pages/ErrorPage/Dashboard/DeliveryMen/MyDeliveries";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [{ path: "/", element: <Home /> }],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // user routes
      { path: "bookParcel", element: <BookParcel /> },
      {
        path: "myProfile",
        element: <MyProfile />,
      },
      {
        path: "myParcel",
        element: <MyParcel />,
      },
      {
        path: "updateParcels/:id",
        element: <UpdateParcel />,
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/parcels/${params.id}`),
      },

      // admin routes
      {
        path: "statistics",
        element: (
          <AdminRoute>
            <Statistics></Statistics>
          </AdminRoute>
        ),
      },
      {
        path: "allUser",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "allParcel",
        element: (
          <AdminRoute>
            <AllParcel></AllParcel>
          </AdminRoute>
        ),
      },

      {
        path: "allDeliveryMen",
        element: (
          <AdminRoute>
            <AllDeliveryMen />
          </AdminRoute>
        ),
      },

      // deliveryMenRoute
      {
        path: "myDeliveries",
        element: (
          <DeliveryMenRoute>
            <MyDeliveries />
          </DeliveryMenRoute>
        ),
      },
      {
        path: "myReviews",
        element: (
          <DeliveryMenRoute>
            <MyReviews />
          </DeliveryMenRoute>
        ),
      },
    ],
  },
]);
