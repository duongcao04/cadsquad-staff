import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_administrator/financial/profit-loss')({
  component: ProfitLossPage,
})

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@heroui/react";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  PieChart as PieIcon,
  BarChart as BarIcon,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";

// --- Mock Data ---
const PL_DATA = [
  { month: "Jan", revenue: 45000, cogs: 15000, opex: 8000, net: 22000 },
  { month: "Feb", revenue: 52000, cogs: 18000, opex: 9500, net: 24500 },
  { month: "Mar", revenue: 48000, cogs: 16000, opex: 8200, net: 23800 },
  { month: "Apr", revenue: 61000, cogs: 22000, opex: 11000, net: 28000 },
];

const CATEGORY_BREAKDOWN = [
  { category: "Revenue (Sales)", amount: 206000, type: "income" },
  { category: "Cost of Goods Sold (Staff)", amount: -71000, type: "expense" },
  { category: "Operating Expenses (Rent/Server)", amount: -36700, type: "expense" },
  { category: "Taxes (Est. 8%)", amount: -7864, type: "expense" },
];

function ProfitLossPage() {
  const totalNetIncome = 206000 - 71000 - 36700 - 7864;
  const netMargin = ((totalNetIncome / 206000) * 100).toFixed(1);

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profit & Loss Statement</h1>
          <p className="text-slate-500 text-sm mt-1">Financial performance summary for Q1 2024.</p>
        </div>
        <div className="flex gap-3">
          <Select placeholder="Time Period" className="w-40" defaultSelectedKeys={["q1"]} size="sm">
            <SelectItem key="q1">Q1 2024</SelectItem>
            <SelectItem key="ytd">Year to Date</SelectItem>
          </Select>
          <Button color="primary" variant="ghost" startContent={<Download size={18} />}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm border border-slate-200">
          <CardBody className="p-6">
             <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p>
             <h3 className="text-2xl font-bold text-slate-900 mt-1">$206,000</h3>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-slate-200">
          <CardBody className="p-6">
             <p className="text-xs font-bold text-slate-400 uppercase">Total Expenses</p>
             <h3 className="text-2xl font-bold text-red-600 mt-1">($115,564)</h3>
          </CardBody>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-emerald-500">
          <CardBody className="p-6">
             <p className="text-xs font-bold text-slate-400 uppercase">Net Income</p>
             <h3 className="text-2xl font-bold text-emerald-600 mt-1">${totalNetIncome.toLocaleString()}</h3>
          </CardBody>
        </Card>
         <Card className="shadow-sm border border-slate-200 bg-slate-900 text-white">
          <CardBody className="p-6">
             <p className="text-xs font-bold text-slate-400 uppercase">Net Margin</p>
             <h3 className="text-2xl font-bold text-white mt-1">{netMargin}%</h3>
             <p className="text-xs text-slate-400 mt-1">Healthy Zone</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Waterfall Chart Visual */}
        <Card className="lg:col-span-2 shadow-sm border border-slate-200">
            <CardBody className="p-6">
                <h3 className="font-bold text-slate-800 mb-6">Financial Performance (Waterfall)</h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PL_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                            <ReferenceLine y={0} stroke="#000" />
                            <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="cogs" fill="#F59E0B" name="Staff Cost" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="net" fill="#10B981" name="Net Profit" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardBody>
        </Card>

        {/* Breakdown Table */}
        <Card className="shadow-sm border border-slate-200">
            <CardBody className="p-0">
                <div className="p-6 border-b border-border-default">
                    <h3 className="font-bold text-slate-800">Statement Summary</h3>
                </div>
                <Table aria-label="P&L Breakdown" shadow="none" removeWrapper className="h-full">
                    <TableHeader>
                        <TableColumn>CATEGORY</TableColumn>
                        <TableColumn align="end">AMOUNT</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {CATEGORY_BREAKDOWN.map((item, idx) => (
                            <TableRow key={idx} className="border-b border-slate-50 last:border-0">
                                <TableCell>
                                    <span className={`font-medium ${item.category.includes("Net") ? "font-bold text-slate-900" : "text-slate-600"}`}>
                                        {item.category}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`font-bold ${item.type === 'income' ? 'text-slate-800' : 'text-red-500'}`}>
                                        {item.type === 'expense' ? '(' : ''}${Math.abs(item.amount).toLocaleString()}{item.type === 'expense' ? ')' : ''}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="bg-slate-50">
                             <TableCell><span className="font-bold text-emerald-700 uppercase tracking-wide text-xs">Net Income</span></TableCell>
                             <TableCell><span className="font-bold text-lg text-emerald-700">${totalNetIncome.toLocaleString()}</span></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
      </div>
    </div>
  );
};