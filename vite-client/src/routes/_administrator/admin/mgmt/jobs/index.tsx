import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_administrator/admin/mgmt/jobs/')({
    component: JobsPage,
})

import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
} from "@heroui/react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  ChevronDown,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Briefcase,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Edit,
  Eye,
} from "lucide-react";
import { INTERNAL_URLS } from '../../../../../lib';

// --- Types based on Prisma Schema ---
type JobStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "CANCELLED";
type JobPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Job {
  id: string;
  no: string;
  title: string;
  client: string;
  type: string;
  status: JobStatus;
  priority: JobPriority;
  income: number;
  dueAt: string; // ISO Date
  assignees: { name: string; avatar: string }[];
}

// --- Mock Data ---
const JOBS_DATA: Job[] = [
  { id: "1", no: "FV-2024", title: "Website Redesign", client: "TechCorp", type: "Web Dev", status: "IN_PROGRESS", priority: "HIGH", income: 4500, dueAt: "2024-03-10", assignees: [{ name: "Sarah", avatar: "https://i.pravatar.cc/150?u=sarah" }] },
  { id: "2", no: "FV-2025", title: "Mobile App Assets", client: "Startup Inc", type: "Design", status: "URGENT", priority: "URGENT", income: 2800, dueAt: "2024-03-01", assignees: [{ name: "David", avatar: "https://i.pravatar.cc/150?u=david" }] },
  { id: "3", no: "FV-2026", title: "SEO Audit", client: "RetailChain", type: "Marketing", status: "DONE", priority: "MEDIUM", income: 1200, dueAt: "2024-02-28", assignees: [{ name: "Alex", avatar: "https://i.pravatar.cc/150?u=alex" }] },
  { id: "4", no: "FV-2027", title: "Server Migration", client: "Logistics Co", type: "DevOps", status: "TODO", priority: "LOW", income: 3100, dueAt: "2024-03-20", assignees: [] },
  { id: "5", no: "FV-2028", title: "Branding Kit", client: "CoffeeShop", type: "Design", status: "REVIEW", priority: "HIGH", income: 1500, dueAt: "2024-03-05", assignees: [{ name: "Sarah", avatar: "https://i.pravatar.cc/150?u=sarah" }] },
  { id: "6", no: "FV-2029", title: "API Integration", client: "FinTech", type: "Backend", status: "IN_PROGRESS", priority: "MEDIUM", income: 5000, dueAt: "2024-03-15", assignees: [{ name: "David", avatar: "https://i.pravatar.cc/150?u=david" }] },
];

// --- Options ---
const STATUS_OPTIONS = [
  { name: "To Do", uid: "TODO" },
  { name: "In Progress", uid: "IN_PROGRESS" },
  { name: "Review", uid: "REVIEW" },
  { name: "Done", uid: "DONE" },
];

const PRIORITY_OPTIONS = [
  { name: "Low", uid: "LOW" },
  { name: "Medium", uid: "MEDIUM" },
  { name: "High", uid: "HIGH" },
  { name: "Urgent", uid: "URGENT" },
];

// --- Helper: Status Colors ---
const statusColorMap: Record<string, ChipProps["color"]> = {
  TODO: "default",
  IN_PROGRESS: "primary",
  REVIEW: "warning",
  DONE: "success",
  CANCELLED: "danger",
};

const priorityColorMap: Record<string, ChipProps["color"]> = {
  LOW: "default",
  MEDIUM: "primary",
  HIGH: "warning",
  URGENT: "danger",
};

const columns = [
  { name: "JOB INFO", uid: "info", sortable: true },
  { name: "CLIENT", uid: "client", sortable: true },
  { name: "ASSIGNEES", uid: "assignees" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "PRIORITY", uid: "priority", sortable: true },
  { name: "DUE DATE", uid: "dueAt", sortable: true },
  { name: "INCOME", uid: "income", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

function JobsPage() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [priorityFilter, setPriorityFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "dueAt",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  
  // Modal State for Bulk Actions
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bulkActionType, setBulkActionType] = useState<"DELETE" | "STATUS" | null>(null);

  const hasSearchFilter = Boolean(filterValue);

  // --- Filtering Logic ---
  const filteredItems = useMemo(() => {
    let filteredJobs = [...JOBS_DATA];

    if (hasSearchFilter) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(filterValue.toLowerCase()) ||
        job.no.toLowerCase().includes(filterValue.toLowerCase()) ||
        job.client.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length !== STATUS_OPTIONS.length) {
      filteredJobs = filteredJobs.filter((job) =>
        Array.from(statusFilter).includes(job.status)
      );
    }
    
    if (priorityFilter !== "all" && Array.from(priorityFilter).length !== PRIORITY_OPTIONS.length) {
      filteredJobs = filteredJobs.filter((job) =>
        Array.from(priorityFilter).includes(job.priority)
      );
    }

    return filteredJobs;
  }, [JOBS_DATA, filterValue, statusFilter, priorityFilter]);

  // --- Sorting Logic ---
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Job, b: Job) => {
      const first = a[sortDescriptor.column as keyof Job] as number | string;
      const second = b[sortDescriptor.column as keyof Job] as number | string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  // --- Pagination Logic ---
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);


  // --- Render Cell ---
  const renderCell = useCallback((job: Job, columnKey: React.Key) => {
    const cellValue = job[columnKey as keyof Job];

    switch (columnKey) {
      case "info":
        return (
          <div>
            <p className="font-bold text-slate-800">{job.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-xs font-mono bg-slate-100 text-slate-500 px-1 py-0.5 rounded">{job.no}</span>
               <span className="text-xs text-slate-400">{job.type}</span>
            </div>
          </div>
        );
      case "client":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{job.client}</p>
          </div>
        );
      case "assignees":
         return (
             <div className="flex -space-x-2">
                 {job.assignees.length > 0 ? job.assignees.map((a, i) => (
                     <User 
                        key={i} 
                        name={a.name} 
                        avatarProps={{src: a.avatar, size: "sm"}} 
                        classNames={{ name: "hidden" }} // Hide name to stack avatars
                     />
                 )) : <span className="text-xs text-slate-400 italic">Unassigned</span>}
             </div>
         );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[job.status]}
            size="sm"
            variant="flat"
          >
            {job.status.replace("_", " ")}
          </Chip>
        );
      case "priority":
        return (
            <Chip
                className="capitalize border-none"
                color={priorityColorMap[job.priority]}
                size="sm"
                variant="dot"
            >
                {job.priority}
            </Chip>
        );
      case "dueAt":
        return (
            <div className="flex items-center gap-1 text-slate-500 text-sm">
                <Calendar size={14} />
                {job.dueAt}
            </div>
        );
      case "income":
        return (
            <span className="font-bold text-slate-700">${job.income.toLocaleString()}</span>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem startContent={<Eye size={16}/>}>View Details</DropdownItem>
                <DropdownItem startContent={<Edit size={16}/>}><Link to={INTERNAL_URLS.editJob('a')}>Edit Job</Link></DropdownItem>
                <DropdownItem startContent={<CheckCircle2 size={16}/>} className="text-success" color="success">Mark Done</DropdownItem>
                <DropdownItem startContent={<Trash2 size={16}/>} className="text-danger" color="danger">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  // --- Handlers ---
  const onBulkAction = (type: "DELETE" | "STATUS") => {
      setBulkActionType(type);
      onOpen();
  };

  const handleBulkConfirm = () => {
      // Logic to call API for bulk delete/update
      const selectedIds = Array.from(selectedKeys);
      console.log(`Performing ${bulkActionType} on IDs:`, selectedIds);
      // Clean up
      setSelectedKeys(new Set([]));
      onOpenChange(); // Close modal
  };

  // --- Top Content Toolbar ---
  const topContent = useMemo(() => {
    const selectedCount = selectedKeys === "all" ? filteredItems.length : selectedKeys.size;

    return (
      <div className="flex flex-col gap-4">
        {/* Header Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">All Jobs</h1>
            <p className="text-slate-500 text-sm">Manage, track and update all ongoing projects.</p>
          </div>
          <div className="flex gap-3">
             <Button color="primary" endContent={<Plus size={16} />}>
                Create New Job
             </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by job name, ID, or client..."
            startContent={<Search className="text-default-300" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
            size="sm"
            variant="bordered"
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown className="text-small" />} variant="flat" size="sm">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {STATUS_OPTIONS.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown className="text-small" />} variant="flat" size="sm">
                  Priority
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Priority Filter"
                closeOnSelect={false}
                selectedKeys={priorityFilter}
                selectionMode="multiple"
                onSelectionChange={setPriorityFilter}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <DropdownItem key={p.uid} className="capitalize">
                    {p.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button variant="flat" isIconOnly size="sm">
                <Filter size={16} />
            </Button>
          </div>
        </div>
        
        {/* Bulk Action Bar (Visible only when items selected) */}
        {selectedCount > 0 && (
             <div className="bg-primary-50 px-4 py-2 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                 <span className="text-sm text-primary-700 font-semibold">{selectedCount} jobs selected</span>
                 <div className="flex gap-2">
                     <Button size="sm" color="primary" variant="flat" onPress={() => onBulkAction("STATUS")}>Update Status</Button>
                     <Button size="sm" color="danger" variant="flat" startContent={<Trash2 size={16} />} onPress={() => onBulkAction("DELETE")}>Delete</Button>
                 </div>
             </div>
        )}
      </div>
    );
  }, [filterValue, statusFilter, priorityFilter, selectedKeys, filteredItems.length]);

  // --- Bottom Pagination ---
  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={Math.ceil(filteredItems.length / rowsPerPage)}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={page === 1} size="sm" variant="flat" onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}>
            Previous
          </Button>
          <Button isDisabled={page === Math.ceil(filteredItems.length / rowsPerPage)} size="sm" variant="flat" onPress={() => setPage((prev) => (prev < Math.ceil(filteredItems.length / rowsPerPage) ? prev + 1 : prev))}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, filteredItems.length]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50">
      <Card className="shadow-sm border border-slate-200">
         <Table
            aria-label="Jobs Table"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[700px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            >
            <TableHeader columns={columns}>
                {(column) => (
                <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    allowsSorting={column.sortable}
                >
                    {column.name}
                </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No jobs found"} items={items}>
                {(item) => (
                <TableRow key={item.id}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
                )}
            </TableBody>
        </Table>
      </Card>

      {/* Confirmation Modal for Bulk Actions */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm {bulkActionType === 'DELETE' ? 'Deletion' : 'Update'}</ModalHeader>
              <ModalBody>
                <p className="text-slate-600">
                    Are you sure you want to {bulkActionType === 'DELETE' ? 'permanently delete' : 'update'} the <strong>{selectedKeys === 'all' ? filteredItems.length : selectedKeys.size}</strong> selected jobs?
                    {bulkActionType === 'DELETE' && <span className="block mt-2 text-red-500 font-bold">This action cannot be undone.</span>}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color={bulkActionType === 'DELETE' ? "danger" : "primary"} onPress={handleBulkConfirm}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
};