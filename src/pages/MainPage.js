import Navigation from "../components/navigation";
import { Outlet } from "react-router-dom";

const MainPage = () => {
   return <>
      <Navigation/>
      <Outlet/>
   </>
};

export default MainPage;
