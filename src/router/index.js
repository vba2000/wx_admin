import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import MainPage from '../pages/MainPage';
import Pools from "../pages/Pools/Pools";
import Assets from "../pages/Assets/Assets";
import Stats from "../pages/Stats";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
        children: [
            {
                path: "/",
                element: <Pools />,
                default: true,
            },
            {
                path: "pools",
                element: <Pools />,
                default: true,
            },
            {
                path: "assets",
                element: <Assets />,
            },
            {
                path: "stats",
                element: <Stats />,
            },
        ]
    }
]);

const Routing = (props) => <RouterProvider router={router}>{props.children}</RouterProvider>;

export default Routing;
