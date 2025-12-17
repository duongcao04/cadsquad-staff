import React from "react";
import {
  Listbox,
  ListboxItem,
  ListboxSection,
  cn
} from "@heroui/react";
import {
  User,
  Bell,
  Lock,
  Palette,
  CreditCard,
  Building,
  Globe,
  Smartphone,
  ShieldAlert,
  HelpCircle,
  LogOut
} from "lucide-react";

// Define the structure of the settings menu
const SETTINGS_MENU = [
  {
    title: "Account",
    items: [
      { key: "profile", label: "My Profile", icon: User, href: "/settings/profile" },
      { key: "security", label: "Login & Security", icon: Lock, href: "/settings/security" },
      { key: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications" },
    ]
  },
  {
    title: "Workspace",
    items: [
      { key: "general", label: "General & Branding", icon: Building, href: "/settings/general" },
      { key: "appearance", label: "Appearance", icon: Palette, href: "/settings/appearance" },
      { key: "billing", label: "Billing & Plans", icon: CreditCard, href: "/settings/billing" },
      { key: "language", label: "Language & Region", icon: Globe, href: "/settings/language" },
    ]
  },
  {
    title: "App",
    items: [
      { key: "devices", label: "Device Management", icon: Smartphone, href: "/settings/devices" },
      { key: "privacy", label: "Privacy & Data", icon: ShieldAlert, href: "/settings/privacy" },
    ]
  }
];

interface SettingsSidebarProps {
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

export const SettingsSidebar = ({ selectedKey = "profile", onSelect }: SettingsSidebarProps) => {
  
  // Wrapper class for the centered layout style
  // Often used inside a grid like: grid-cols-[280px_1fr] max-w-5xl mx-auto
  return (
    <aside className="w-full max-w-[280px] hidden md:flex flex-col gap-6 sticky top-8 h-fit">
      
      {/* Header Area (Optional) */}
      <div className="px-2 mb-2">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">Manage your account preferences</p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden py-2">
        <Listbox 
          variant="flat" 
          aria-label="Settings Menu"
          className="p-2"
          itemClasses={{
            base: "px-3 py-2.5 rounded-xl data-[hover=true]:bg-slate-50 data-[hover=true]:text-slate-900 mb-1 transition-colors",
            title: "text-sm font-medium",
            selectedIcon: "hidden" // Hide default checkmark
          }}
        >
          {SETTINGS_MENU.map((section) => (
            <ListboxSection 
              key={section.title} 
              title={section.title} 
              showDivider 
              classNames={{
                heading: "text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2",
                divider: "my-2 bg-slate-100"
              }}
            >
              {section.items.map((item) => {
                const isSelected = selectedKey === item.key;
                return (
                  <ListboxItem
                    key={item.key}
                    startContent={
                      <item.icon 
                        size={18} 
                        className={cn(
                          "mr-2 transition-colors", 
                          isSelected ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                        )} 
                      />
                    }
                    className={cn(
                      isSelected ? "bg-primary-50 text-primary font-semibold" : "text-slate-600"
                    )}
                    // Logic to handle selection (e.g. navigation)
                    onPress={() => onSelect && onSelect(item.key)}
                  >
                    {item.label}
                  </ListboxItem>
                );
              })}
            </ListboxSection>
          ))}
        </Listbox>

        {/* Bottom Actions */}
        <div className="mt-2 pt-2 px-4 border-t border-slate-100 space-y-1">
           <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
              <HelpCircle size={18} className="text-slate-400" />
              Help & Support
           </button>
           <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={18} />
              Log Out
           </button>
        </div>
      </div>
      
      {/* Optional: Version Info */}
      <div className="px-4 text-xs text-slate-400 text-center">
        v2.4.0 • Built with HeroUI
      </div>

    </aside>
  );
};