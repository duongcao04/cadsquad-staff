import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/appearance')({
    component: AppearanceSettingsPage,
})

import React, { useState } from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    RadioGroup,
    Radio,
    Slider,
    Switch,
    Select,
    SelectItem,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Avatar,
    Divider,
    Tooltip,
} from '@heroui/react'
import {
    Moon,
    Sun,
    Monitor,
    LayoutGrid,
    Type,
    Palette,
    Check,
    Save,
    RotateCcw,
} from 'lucide-react'

// --- Mock Themes ---
const THEME_COLORS = [
    { key: 'blue', hex: '#3B82F6', label: 'Ocean Blue' },
    { key: 'violet', hex: '#8B5CF6', label: 'Royal Violet' },
    { key: 'emerald', hex: '#10B981', label: 'Emerald Green' },
    { key: 'orange', hex: '#F97316', label: 'Sunset Orange' },
    { key: 'rose', hex: '#F43F5E', label: 'Rose Red' },
    { key: 'slate', hex: '#64748B', label: 'Slate Grey' },
]

const TABLE_DENSITIES = [
    { key: 'compact', label: 'Compact', desc: 'Show more data, less padding' },
    { key: 'comfortable', label: 'Comfortable', desc: 'Default spacing' },
    { key: 'spacious', label: 'Spacious', desc: 'More breathing room' },
]

// --- Preview Component (Mock Table) ---
const PreviewTable = ({ density, fontSize, themeColor }: any) => {
    const rowHeight =
        density === 'compact'
            ? 'py-1'
            : density === 'spacious'
              ? 'py-4'
              : 'py-2'
    const textSize =
        fontSize === 'sm'
            ? 'text-xs'
            : fontSize === 'lg'
              ? 'text-base'
              : 'text-sm'

    return (
        <div
            className={`border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm`}
        >
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">
                    Preview: Data Table
                </span>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th
                            className={`text-left px-4 py-2 font-semibold text-slate-500 ${textSize}`}
                        >
                            Name
                        </th>
                        <th
                            className={`text-left px-4 py-2 font-semibold text-slate-500 ${textSize}`}
                        >
                            Role
                        </th>
                        <th
                            className={`text-left px-4 py-2 font-semibold text-slate-500 ${textSize}`}
                        >
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {[1, 2].map((i) => (
                        <tr
                            key={i}
                            className="border-b border-slate-50 last:border-0"
                        >
                            <td className={`px-4 ${rowHeight}`}>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        size="sm"
                                        src={`https://i.pravatar.cc/150?u=${i}`}
                                    />
                                    <div>
                                        <p
                                            className={`font-bold text-slate-700 ${textSize}`}
                                        >
                                            User {i}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            user{i}@example.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td
                                className={`px-4 ${rowHeight} text-slate-600 ${textSize}`}
                            >
                                Developer
                            </td>
                            <td className={`px-4 ${rowHeight}`}>
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    className="capitalize"
                                    style={{
                                        color: themeColor,
                                        backgroundColor: `${themeColor}20`,
                                    }}
                                >
                                    Active
                                </Chip>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function AppearanceSettingsPage() {
    const [mode, setMode] = useState('system') // light, dark, system
    const [color, setColor] = useState(THEME_COLORS[0])
    const [density, setDensity] = useState('comfortable')
    const [fontSize, setFontSize] = useState('md') // sm, md, lg
    const [reducedMotion, setReducedMotion] = useState(false)

    return (
        <div className="p-8 max-w-[1200px] mx-auto min-h-screen bg-slate-50 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Appearance
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Customize the look and feel of your workspace.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="flat"
                        color="warning"
                        startContent={<RotateCcw size={18} />}
                    >
                        Reset Default
                    </Button>
                    <Button color="primary" startContent={<Save size={18} />}>
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN: Settings Controls --- */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 1. Theme Mode */}
                    <section>
                        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                            <Sun size={20} /> Interface Theme
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'light', icon: Sun, label: 'Light Mode' },
                                { id: 'dark', icon: Moon, label: 'Dark Mode' },
                                {
                                    id: 'system',
                                    icon: Monitor,
                                    label: 'System Sync',
                                },
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setMode(item.id)}
                                    className={`
                        cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all
                        ${
                            mode === item.id
                                ? 'border-primary bg-primary-50 text-primary'
                                : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50'
                        }
                      `}
                                >
                                    <item.icon size={24} />
                                    <span className="font-semibold text-sm">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Divider />

                    {/* 2. Brand Color */}
                    <section>
                        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                            <Palette size={20} /> Accent Color
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {THEME_COLORS.map((c) => (
                                <Tooltip key={c.key} content={c.label}>
                                    <button
                                        onClick={() => setColor(c)}
                                        className={`
                           w-12 h-12 rounded-full flex items-center justify-center transition-all border-2
                           ${color.key === c.key ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}
                        `}
                                        style={{ backgroundColor: c.hex }}
                                    >
                                        {color.key === c.key && (
                                            <Check
                                                className="text-white"
                                                size={20}
                                            />
                                        )}
                                    </button>
                                </Tooltip>
                            ))}
                        </div>
                    </section>

                    <Divider />

                    {/* 3. Data Density & Font */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                <LayoutGrid size={20} /> Table Density
                            </h3>
                            <RadioGroup
                                value={density}
                                onValueChange={setDensity}
                                color="primary"
                            >
                                {TABLE_DENSITIES.map((d) => (
                                    <Radio
                                        key={d.key}
                                        value={d.key}
                                        description={d.desc}
                                        classNames={{
                                            label: 'font-semibold text-slate-700',
                                        }}
                                    >
                                        {d.label}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                <Type size={20} /> Text Scaling
                            </h3>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between mb-2 px-1">
                                    <span className="text-xs font-bold text-slate-400">
                                        Small
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">
                                        Large
                                    </span>
                                </div>
                                <Slider
                                    step={1}
                                    maxValue={3}
                                    minValue={1}
                                    defaultValue={2}
                                    showSteps={true}
                                    size="sm"
                                    color="primary"
                                    className="max-w-md"
                                    onChange={(v) =>
                                        setFontSize(
                                            v === 1
                                                ? 'sm'
                                                : v === 3
                                                  ? 'lg'
                                                  : 'md'
                                        )
                                    }
                                />
                                <div className="mt-4 text-center">
                                    <span className="text-sm font-semibold text-primary capitalize">
                                        {fontSize === 'sm'
                                            ? 'Compact'
                                            : fontSize === 'lg'
                                              ? 'Large'
                                              : 'Standard'}{' '}
                                        Size
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm">
                                        Reduced Motion
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Disable animations
                                    </p>
                                </div>
                                <Switch
                                    size="sm"
                                    isSelected={reducedMotion}
                                    onValueChange={setReducedMotion}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- RIGHT COLUMN: Live Preview --- */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider">
                            Live Preview
                        </h3>

                        {/* Preview Card */}
                        <Card
                            className="w-full shadow-lg border-t-4"
                            style={{ borderColor: color.hex }}
                        >
                            <CardHeader className="flex gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    A
                                </div>
                                <div className="flex flex-col">
                                    <p
                                        className={`font-bold text-slate-800 ${fontSize === 'lg' ? 'text-lg' : fontSize === 'sm' ? 'text-sm' : 'text-base'}`}
                                    >
                                        App Dashboard
                                    </p>
                                    <p className="text-small text-default-500">
                                        Theme Preview
                                    </p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="gap-4">
                                <p
                                    className={`text-slate-600 ${fontSize === 'lg' ? 'text-base' : fontSize === 'sm' ? 'text-xs' : 'text-sm'}`}
                                >
                                    This is how your content will look. The
                                    table below demonstrates the{' '}
                                    <strong>{density}</strong> density setting.
                                </p>

                                {/* Dynamic Table Preview */}
                                <PreviewTable
                                    density={density}
                                    fontSize={fontSize}
                                    themeColor={color.hex}
                                />

                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        style={{
                                            color: color.hex,
                                            backgroundColor: `${color.hex}20`,
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        style={{
                                            backgroundColor: color.hex,
                                            color: 'white',
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-xs text-blue-800">
                                <strong>Note:</strong> Some changes (like Dark
                                Mode) may require a page refresh to apply fully
                                across all charts and maps.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
