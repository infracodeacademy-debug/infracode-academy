import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r border-slate-800 bg-slate-950 flex flex-col overflow-y-auto shadow-sm">
      <div className="p-6 flex items-center font-bold text-xl text-white">
        <span className="text-indigo-500 mr-2">{"</>"}</span> InfraCode
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  )
}
