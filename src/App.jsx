import "./App.css";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Toaster } from "sonner";
//import react router dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./Components/Dashboard/Profile/Profile";
import VictimData from "./Components/Dashboard/VictimData/VictimData";
import Dashboard from "./Components/Dashboard/Dash/Dashboard";
import Map from "./Components/Dashboard/Map/Map";
import Requests from "./Components/Dashboard/Requests/Requests";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import UserProvider from "./context/UserProvider";

// lets create a router
const router = createBrowserRouter([
     {
          path: "dashboard",
          element: <Dashboard />,
          children: [
               {
                    path: "",
                    element: <Profile />,
               },
               {
                    path: "victimData",
                    element: <VictimData />,
               },
               {
                    path: "map",
                    element: <Map />,
               },
               {
                    path: "requests",
                    element: <Requests />,
               },
          ],
     },
     {
          path: "/",
          element: <Login />,
     },

     {
          path: "register",
          element: <Register />,
     },
]);

const queryClient = new QueryClient();

function App() {
     return (
          <div>
               <QueryClientProvider client={queryClient}>
                    <UserProvider>
                         <Toaster position="top-center" richColors />
                         <RouterProvider router={router} />
                    </UserProvider>
               </QueryClientProvider>
          </div>
     );
}

export default App;
