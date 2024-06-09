import "./App.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { toast, Toaster } from "sonner";
//import react router dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./pages/Dashboard/Profile/Profile";
import VictimData from "./pages/Dashboard/VictimData/VictimData";
import Dashboard from "./pages/Dashboard/Dash/Dashboard";
import Map from "./pages/Dashboard/Map/Map";
import Requests from "./pages/Dashboard/Requests/Requests";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import UserProvider from "./context/UserProvider";
import AdminRescueTeamRequests from "./pages/Dashboard/RescueRequests/AdminRescueTeamRequests";
import SendCode from "./pages/SendCode/SendCode";

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
               {
                    path: "rescue-requests",
                    element: <AdminRescueTeamRequests />,
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
     {
          path: "sendcode",
          element: <SendCode />,
     },
]);

const queryClient = new QueryClient({
     defaultOptions: {
          mutations: {
               onError: (e) =>
                    toast.error(
                         e.response.data.message || "Something went wrong!!"
                    ),
          },
          queries: {
               refetchOnWindowFocus: false,
               retry: false,
          },
     },
});

function App() {
     return (
          <div>
               <Toaster position="top-center" richColors />
               <QueryClientProvider client={queryClient}>
                    <UserProvider>
                         <RouterProvider router={router} />
                    </UserProvider>
               </QueryClientProvider>
          </div>
     );
}

export default App;
