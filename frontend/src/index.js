import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home/Home";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import NotFound from "./Pages/NotFound/NotFound";
import "./Assests/fontAwesomeProIcons/fontAwesomeIcons.css";
import "./index.css";
import UpdateEmployeeDetails from "./Pages/UpdateEmployeeDetails/UpdateEmployeeDetails";
import EmployeeCard from "./Components/EmployeeCard/EmployeeCard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/update-employee-details/:employeeId",
    element: <UpdateEmployeeDetails />,
    errorElement: <NotFound />,
  },

  {
    path: "/sign-in",
    element: <SignIn />,
    errorElement: <NotFound />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
    errorElement: <NotFound />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={router} />);
