import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/')({
    component: SettingsIndexPage,
})
import React from "react";
import {
  Card,
  CardBody,
  Button,
  Divider,
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
  ChevronRight,
} from "lucide-react";

// --- Configuration Data (Matches Sidebar) ---
const SETTINGS_SECTIONS = [
  {
    title: "Account",
    description: "Manage your personal details and login security.",
    items: [
      { key: "profile", label: "My Profile", desc: "Update name, avatar & bio", icon: User, href: "/settings/profile", color: "text-blue-500", bg: "bg-blue-50" },
      { key: "security", label: "Login & Security", desc: "Password, 2FA & Sessions", icon: Lock, href: "/settings/security", color: "text-rose-500", bg: "bg-rose-50" },
      { key: "notifications", label: "Notifications", desc: "Email & Push preferences", icon: Bell, href: "/settings/notifications", color: "text-amber-500", bg: "bg-amber-50" },
    ]
  },
  {
    title: "Workspace",
    description: "Customize your team environment and branding.",
    items: [
      { key: "general", label: "General & Branding", desc: "Logo, Name & Timezone", icon: Building, href: "/settings/general", color: "text-purple-500", bg: "bg-purple-50" },
      { key: "appearance", label: "Appearance", desc: "Dark mode, themes & density", icon: Palette, href: "/settings/appearance", color: "text-pink-500", bg: "bg-pink-50" },
      { key: "billing", label: "Billing & Plans", desc: "Invoices & Payment methods", icon: CreditCard, href: "/settings/billing", color: "text-emerald-500", bg: "bg-emerald-50" },
      { key: "language", label: "Language & Region", desc: "System language & currency", icon: Globe, href: "/settings/language", color: "text-indigo-500", bg: "bg-indigo-50" },
    ]
  },
  {
    title: "App & Privacy",
    description: "Control device access and data privacy.",
    items: [
      { key: "devices", label: "Device Management", desc: "Active sessions & trusted devices", icon: Smartphone, href: "/settings/devices", color: "text-slate-600", bg: "bg-slate-100" },
      { key: "privacy", label: "Privacy & Data", desc: "Data export & deletion", icon: ShieldAlert, href: "/settings/privacy", color: "text-red-500", bg: "bg-red-50" },
    ]
  }
];

function SettingsIndexPage(){
  return (
    <div className="p-8 max-w-[1000px] mx-auto min-h-screen bg-slate-50 space-y-10">
      
      {/* --- Page Header --- */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      {/* --- Sections Loop --- */}
      {SETTINGS_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-4">
          
          {/* Section Header */}
          <div className="flex items-end gap-4 border-b border-slate-200 pb-2 mb-6">
             <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
             <p className="text-sm text-slate-400 pb-1 hidden sm:block">{section.description}</p>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((item) => (
              <Card 
                key={item.key} 
                isPressable 
                isHoverable 
                className="border border-slate-200 shadow-sm hover:border-primary/50 transition-all bg-white group"
                onPress={() => console.log("Navigate to", item.href)} // Replace with router.push
              >
                <CardBody className="p-4 flex items-center gap-4">
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* --- Quick Support Footer --- */}
      <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
         <div>
            <h4 className="font-bold text-blue-900 text-lg">Need help?</h4>
            <p className="text-sm text-blue-700">Can't find the setting you're looking for? Check our documentation.</p>
         </div>
         <div className="flex gap-3">
            <Button variant="solid" color="primary" className="bg-blue-600">Documentation</Button>
            <Button variant="light" className="text-blue-700">Contact Support</Button>
         </div>
      </div>

    </div>
  );
};