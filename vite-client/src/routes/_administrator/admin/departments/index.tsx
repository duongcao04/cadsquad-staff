import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_administrator/admin/departments/')({
  component: DepartmentsSettingsPage,
})
import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Palette,
  Users,
  Hash,
} from "lucide-react";

// --- Types based on Prisma Schema ---
interface Department {
  id: string;
  displayName: string; // e.g. "Design Team"
  code: string;        // e.g. "DES"
  hexColor: string;    // e.g. "#8B5CF6"
  notes?: string;
  memberCount: number; // Aggregated from Users
}

// --- Mock Data ---
const MOCK_DEPARTMENTS: Department[] = [
  { id: "d1", displayName: "Design Team", code: "DES", hexColor: "#8B5CF6", memberCount: 8, notes: "UI/UX and Graphic Design" },
  { id: "d2", displayName: "Development", code: "DEV", hexColor: "#3B82F6", memberCount: 12, notes: "Frontend, Backend, and DevOps" },
  { id: "d3", displayName: "Marketing", code: "MKT", hexColor: "#F59E0B", memberCount: 5, notes: "SEO, Content, and Ads" },
  { id: "d4", displayName: "Finance", code: "FIN", hexColor: "#10B981", memberCount: 3, notes: "Accounting and Payroll" },
];

// --- Color Palette Options ---
const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#64748B", // Slate
];

function DepartmentsSettingsPage(){
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Department>>({
    displayName: "",
    code: "",
    hexColor: "#3B82F6",
    notes: "",
  });

  // --- Filtering ---
  const filteredDepts = useMemo(() => {
    return departments.filter(d => 
      d.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [departments, searchQuery]);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({ displayName: "", code: "", hexColor: "#3B82F6", notes: "" });
    onOpen();
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ ...dept });
    onOpen();
  };

  const handleSave = () => {
    if (editingDept) {
      // Edit Logic
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, ...formData } as Department : d));
    } else {
      // Create Logic
      const newDept = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        memberCount: 0,
      } as Department;
      setDepartments([...departments, newDept]);
    }
    onOpenChange();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure? This will remove the department tag from all users.")) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen bg-slate-50 space-y-8">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your teams. These appear in the main sidebar for quick filtering.
          </p>
        </div>
        <Button 
          color="primary" 
          startContent={<Plus size={18} />} 
          onPress={handleOpenAdd}
          className="font-semibold shadow-md shadow-blue-500/20"
        >
          Add Department
        </Button>
      </div>

      {/* --- Content Card --- */}
      <Card className="shadow-sm border border-slate-200">
        <CardBody className="p-0">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-border-default flex justify-between items-center bg-white rounded-t-xl">
             <Input 
                placeholder="Search departments..." 
                startContent={<Search size={16} className="text-slate-400" />}
                className="max-w-xs"
                size="sm"
                variant="bordered"
                value={searchQuery}
                onValueChange={setSearchQuery}
                isClearable
                onClear={() => setSearchQuery("")}
             />
             <span className="text-xs text-slate-400 font-medium">
                {filteredDepts.length} Groups
             </span>
          </div>

          {/* Table */}
          <Table aria-label="Departments List" shadow="none" removeWrapper className="min-w-full">
            <TableHeader>
              <TableColumn>DEPARTMENT NAME</TableColumn>
              <TableColumn>CODE</TableColumn>
              <TableColumn>COLOR TAG</TableColumn>
              <TableColumn>MEMBERS</TableColumn>
              <TableColumn align="end">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No departments found.">
              {filteredDepts.map((dept) => (
                <TableRow key={dept.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-none group">
                  <TableCell>
                    <div>
                        <p className="font-bold text-slate-700">{dept.displayName}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{dept.notes || "No description"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                        {dept.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                            style={{ backgroundColor: dept.hexColor }}
                        ></div>
                        <span className="text-xs text-slate-500 font-mono">{dept.hexColor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Users size={16} className="text-slate-400" />
                        {dept.memberCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button isIconOnly size="sm" variant="light" onPress={() => handleOpenEdit(dept)}>
                            <Edit size={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(dept.id)}>
                            <Trash2 size={16} />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* --- Add/Edit Modal --- */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingDept ? "Edit Department" : "New Department"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                    
                    {/* Name & Code Row */}
                    <div className="flex gap-4">
                        <Input 
                            label="Name" 
                            placeholder="e.g. Design Team" 
                            labelPlacement="outside" 
                            variant="bordered"
                            className="flex-1"
                            value={formData.displayName}
                            onValueChange={(v) => setFormData({...formData, displayName: v})}
                        />
                        <Input 
                            label="Code" 
                            placeholder="e.g. DES" 
                            labelPlacement="outside" 
                            variant="bordered"
                            className="w-24"
                            startContent={<Hash size={14} className="text-slate-400" />}
                            value={formData.code}
                            onValueChange={(v) => setFormData({...formData, code: v.toUpperCase()})}
                        />
                    </div>

                    {/* Description */}
                    <Textarea 
                        label="Description" 
                        placeholder="What does this team do?" 
                        labelPlacement="outside" 
                        variant="bordered"
                        minRows={2}
                        value={formData.notes}
                        onValueChange={(v) => setFormData({...formData, notes: v})}
                    />

                    {/* Color Picker */}
                    <div>
                        <label className="text-small font-medium text-foreground mb-2 block">Theme Color</label>
                        <Popover placement="bottom" showArrow={true}>
                            <PopoverTrigger>
                                <Button 
                                    variant="bordered" 
                                    className="w-full justify-start"
                                    startContent={
                                        <div 
                                            className="w-5 h-5 rounded-full border border-slate-200" 
                                            style={{ backgroundColor: formData.hexColor }}
                                        ></div>
                                    }
                                >
                                    {formData.hexColor}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                <div className="px-1 py-2 w-full">
                                    <p className="text-small font-bold text-foreground mb-2">Select Color</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.hexColor === color ? 'border-slate-800' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setFormData({...formData, hexColor: color})}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-border-default">
                                        <Input 
                                            size="sm" 
                                            label="Custom Hex" 
                                            variant="flat" 
                                            value={formData.hexColor}
                                            onValueChange={(v) => setFormData({...formData, hexColor: v})}
                                            startContent={<Palette size={14} />}
                                        />
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save Department
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
};