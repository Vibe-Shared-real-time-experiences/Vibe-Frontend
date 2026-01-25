// src/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import ServerSidebar from '../chat/ServerSideBar';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen w-screen bg-[#313338] overflow-hidden text-gray-100 font-sans">
            <ServerSidebar />
            <div className="flex-1 flex overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}