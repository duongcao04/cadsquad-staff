import {
    Calendar,
    CheckSquare,
    ChevronDown, // Mapped to Job
    FileText,
    LayoutDashboard, // Mapped to FileSystem/Notes
    Mail, // Schedule based on Job dueAt
    PieChart, // Invite Team
    Settings, // Mapped to User
    UserPlus, // Reports
    Users, // Mapped to User
} from 'lucide-react'
import React from 'react'

interface SidebarItemProps {
    icon: React.ElementType
    label: string
    isActive?: boolean
    badge?: number
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    isActive,
    badge,
}) => (
    <div
        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
            isActive
                ? 'bg-primary-50 text-primary-800 font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon
                className={`w-5 h-5 ${isActive ? 'text-primary-800' : 'text-slate-400 group-hover:text-slate-600'}`}
            />
            <span>{label}</span>
        </div>
        {badge && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {badge}
            </span>
        )}
    </div>
)

export const AdminSidebar = () => {
    return (
        <aside className="w-64 bg-white flex flex-col overflow-y-auto">
            {/* Navigation Groups */}
            <div className="flex-1 px-4 space-y-8">
                {/* Main Menu */}
                <div>
                    <p className="px-2 text-xs font-semibold text-text-subdued tracking-wider mb-2">
                        Main Menu
                    </p>
                    <div className="space-y-1">
                        <SidebarItem
                            icon={LayoutDashboard}
                            label="Dashboard"
                            isActive
                        />
                        {/* Map 'Tasks' to your 'Job' model */}
                        <SidebarItem
                            icon={CheckSquare}
                            label="All Jobs"
                            badge={12}
                        />
                        {/* Map 'Notes' to 'JobActivityLog' or 'FileSystem' */}
                        <SidebarItem icon={FileText} label="Files & Docs" />
                        {/* Map 'Email' to 'Notification' */}
                        <SidebarItem icon={Mail} label="Inbox" badge={5} />
                        <SidebarItem icon={Calendar} label="Schedule" />
                    </div>
                </div>

                {/* Management */}
                <div>
                    <p className="px-2 text-xs font-semibold text-text-subdued tracking-wider mb-2">
                        Management
                    </p>
                    <div className="space-y-1">
                        <SidebarItem icon={PieChart} label="Revenue Reports" />
                        <SidebarItem icon={Users} label="Staff Directory" />
                        <SidebarItem icon={UserPlus} label="Invite Member" />
                    </div>
                </div>

                {/* Projects / Departments */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <p className="text-xs font-semibold text-text-subdued tracking-wider">
                            Departments
                        </p>
                        <Settings className="w-3 h-3 text-slate-400 cursor-pointer" />
                    </div>
                    <div className="space-y-1">
                        {['Design Team', 'Development', 'Marketing'].map(
                            (dept, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-emerald-700 cursor-pointer text-sm"
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-purple-500' : idx === 1 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                    ></span>
                                    {dept}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* User Profile at Bottom */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all">
                    <img
                        src="https://i.pravatar.cc/150?u=admin"
                        alt="User"
                        className="w-9 h-9 rounded-lg bg-emerald-100 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">
                            Cao Hải Dương
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                            Admin Workspace
                        </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
            </div>
        </aside>
    )
}
