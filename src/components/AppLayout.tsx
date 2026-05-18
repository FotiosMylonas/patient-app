import { Outlet } from "react-router-dom";
import TabBar from "./TabBar";

export default function AppLayout() {
  return(
    <div className="min-h-screen bg-bg-primary text-text-primary pb-20">
        {/* thats the page contetnt and gets swapped based on URL */}
        <main className="max-w-md mx-auto">
            <Outlet />
        </main>
        {/* tab bar always visible */}
        <TabBar />
    </div>

    );

}