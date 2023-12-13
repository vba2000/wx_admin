import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import MainPage from '../pages/MainPage';
import Pools from "../pages/Pools/Pools";
import Assets from "../pages/Assets/Assets";
import Stats from "../pages/Stats";
import Txs from "../pages/txs";
import Data from "../pages/txs/Data";
import Transfer from "../pages/txs/Transfer";
import Burn from "../pages/txs/Burn";
import Invoke from "../pages/txs/Ivoke";

const router = createHashRouter([
    {
        path: "/",
        element: <MainPage/>,
        children: [
            {
                path: "/",
                element: Pools,
                default: true,
            },
            {
                path: "pools",
                Component: Pools,
                default: true,
            },
            {
                path: "assets",
                Component: Assets,
            },
            {
                path: "stats",
                Component: Stats,
            },
            {
                path: "transactions",
                Component: Txs,
            },
            {
                path: "transactions/data",
                Component: Data,
            },
            {
                path: "transactions/transfer",
                Component: Transfer,
            },
            {
                path: "transactions/burn",
                Component: Burn,
            },
            {
                path: "transactions/invoke",
                Component: Invoke,
            },
        ]
    }
]);

const Routing = (props) => <RouterProvider router={router}>{props.children}</RouterProvider>;

export default Routing;
