import Header from "./Header";
import {Outlet} from "react-router-dom";
import HeaderC from "./HeaderC";

export default function Layout() {
  return (
    
    <div className="py-4 px-8 flex flex-col min-h-screen max-w-9xl mx-auto">
      <HeaderC/>
      <Outlet />
    </div>
  );
}