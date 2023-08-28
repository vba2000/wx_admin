import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import MainPage from '../pages/MainPage';
import Pools from "../pages/Pools/Pools";
import Assets from "../pages/Assets";

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
                path: "/pools",
                element: <Pools />,
                default: true,
            },
            {
                path: "/pools/:poolId",
                element: <Pools />,
            },
            {
                path: "/assets",
                element: <Assets />,
            },
            {
                path: "/assets/:assetId",
                element: <Assets />,
            },
        ]
    }
]);

const Routing = (props) => <RouterProvider router={router}>{props.children}</RouterProvider>;

export default Routing;
