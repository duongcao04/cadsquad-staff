'use client'

import React from "react";
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
	Pagination,
	Selection,
	SortDescriptor,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export interface Column<T> {
	name: string;
	uid: keyof T | string;
	sortable?: boolean;
	renderCell?: (item: T, columnKey: keyof T | string) => React.ReactNode;
}

interface AbstractTableProps<T> {
	data: T[];
	columns: Column<T>[];
	enableSearch?: boolean;
	enablePagination?: boolean;
	enableColumnSelection?: boolean;
	enableSorting?: boolean;
	enableRowSelection?: boolean;
	initialRowsPerPage?: number;
	searchPlaceholder?: string;
	emptyContent?: string;
	onRowAction?: (key: React.Key, item: T) => void;
	onSelectionChange?: (keys: Selection) => void;
}

export const AbstractTable = <T extends Record<string, unknown> & { id?: string | number; key?: string | number }>({
	data,
	columns,
	enableSearch = false,
	enablePagination = false,
	enableColumnSelection = false,
	enableSorting = false,
	enableRowSelection = false,
	initialRowsPerPage = 10,
	searchPlaceholder = "Search...",
	emptyContent = "No data available",
	onRowAction,
	onSelectionChange,
}: AbstractTableProps<T>) => {
	// State for table functionality
	const [filterValue, setFilterValue] = React.useState("");
	const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
	const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
		new Set(columns.map(col => String(col.uid)))
	);
	const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
	const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
		column: columns.find(col => col.sortable)?.uid as string || "",
		direction: "ascending",
	});
	const [page, setPage] = React.useState(1);

	// Derived state
	const hasSearchFilter = Boolean(filterValue);

	// Get visible columns
	const headerColumns = React.useMemo(() => {
		return columns.filter((column) => Array.from(visibleColumns).includes(String(column.uid)));
	}, [visibleColumns, columns]);

	// Filter items based on search
	const filteredItems = React.useMemo(() => {
		let filteredData = [...data];

		if (hasSearchFilter && enableSearch) {
			filteredData = filteredData.filter((item) => {
				return Object.keys(item).some((key) => {
					const value = item[key as keyof T];
					if (typeof value === 'string' || typeof value === 'number') {
						return String(value).toLowerCase().includes(filterValue.toLowerCase());
					}
					return false;
				});
			});
		}

		return filteredData;
	}, [data, filterValue, enableSearch, hasSearchFilter]);

	// Calculate total pages
	const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

	// Get paginated items
	const paginatedItems = React.useMemo(() => {
		if (!enablePagination) return filteredItems;

		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage, enablePagination]);

	// Sort items
	const sortedItems = React.useMemo(() => {
		if (!enableSorting || !sortDescriptor.column) return paginatedItems;

		return [...paginatedItems].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof T];
			const second = b[sortDescriptor.column as keyof T];

			if (first === undefined || second === undefined) return 0;

			// Handle different data types
			const cmp = (() => {
				if (typeof first === 'string' && typeof second === 'string') {
					return first.localeCompare(second);
				}
				if (typeof first === 'number' && typeof second === 'number') {
					return first - second;
				}
				if (typeof first === 'boolean' && typeof second === 'boolean') {
					return first === second ? 0 : first ? 1 : -1;
				}
				// Fallback for other types
				return String(first).localeCompare(String(second));
			})();

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, paginatedItems, enableSorting]);

	// Default cell renderer
	const defaultRenderCell = React.useCallback((item: T, columnKey: keyof T | string) => {
		const cellValue = item[columnKey as keyof T];
		return cellValue !== undefined ? String(cellValue) : "";
	}, []);

	// Event handlers
	const onSearchChange = React.useCallback((value: string) => {
		setFilterValue(value);
		setPage(1);
	}, []);

	const onClear = React.useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);

	const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setRowsPerPage(Number(e.target.value));
		setPage(1);
	}, []);

	const onNextPage = React.useCallback(() => {
		if (page < pages) setPage(page + 1);
	}, [page, pages]);

	const onPreviousPage = React.useCallback(() => {
		if (page > 1) setPage(page - 1);
	}, [page]);

	const handleSelectionChange = React.useCallback((keys: Selection) => {
		setSelectedKeys(keys);
		if (onSelectionChange) onSelectionChange(keys);
	}, [onSelectionChange]);

	// Top content with search, filters, etc.
	const topContent = React.useMemo(() => {
		if (!enableSearch && !enableColumnSelection) return null;

		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					{enableSearch && (
						<Input
							isClearable
							className="w-full sm:max-w-[44%]"
							placeholder={searchPlaceholder}
							startContent={<Icon icon="lucide:search" />}
							value={filterValue}
							onClear={onClear}
							onValueChange={onSearchChange}
						/>
					)}

					<div className="flex gap-3">
						{enableColumnSelection && (
							<Dropdown>
								<DropdownTrigger className="hidden sm:flex">
									<Button
										endContent={<Icon icon="lucide:chevron-down" className="text-small" />}
										variant="flat"
									>
										Columns
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									disallowEmptySelection
									aria-label="Table Columns"
									closeOnSelect={false}
									selectedKeys={visibleColumns}
									selectionMode="multiple"
									onSelectionChange={setVisibleColumns}
								>
									{columns.map((column) => (
										<DropdownItem key={String(column.uid)} className="capitalize">
											{column.name}
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						)}
					</div>
				</div>

				{enablePagination && (
					<div className="flex justify-between items-center">
						<span className="text-default-400 text-small">
							Total {filteredItems.length} items
						</span>
						<label className="flex items-center text-default-400 text-small">
							Rows per page:
							<select
								className="bg-transparent outline-none text-default-400 text-small ml-2"
								onChange={onRowsPerPageChange}
								value={rowsPerPage}
							>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="15">15</option>
								<option value="20">20</option>
								<option value="50">50</option>
							</select>
						</label>
					</div>
				)}
			</div>
		);
	}, [
		enableSearch,
		enableColumnSelection,
		enablePagination,
		filterValue,
		visibleColumns,
		columns,
		onSearchChange,
		onClear,
		rowsPerPage,
		onRowsPerPageChange,
		filteredItems.length,
		searchPlaceholder,
	]);

	// Bottom content with pagination
	const bottomContent = React.useMemo(() => {
		if (!enablePagination) return null;

		return (
			<div className="py-2 px-2 flex justify-between items-center">
				{enableRowSelection && (
					<span className="w-[30%] text-small text-default-400">
						{selectedKeys === "all"
							? "All items selected"
							: `${selectedKeys.size} of ${filteredItems.length} selected`}
					</span>
				)}

				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={page}
					total={pages}
					onChange={setPage}
				/>

				<div className="hidden sm:flex w-[30%] justify-end gap-2">
					<Button
						isDisabled={pages === 1 || page === 1}
						size="sm"
						variant="flat"
						onPress={onPreviousPage}
					>
						Previous
					</Button>
					<Button
						isDisabled={pages === 1 || page === pages}
						size="sm"
						variant="flat"
						onPress={onNextPage}
					>
						Next
					</Button>
				</div>
			</div>
		);
	}, [
		enablePagination,
		enableRowSelection,
		selectedKeys,
		filteredItems.length,
		page,
		pages,
		onPreviousPage,
		onNextPage,
	]);

	return (
		<Table
			aria-label="Abstract table component"
			isHeaderSticky={true}
			removeWrapper
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			topContent={topContent}
			topContentPlacement="outside"
			selectedKeys={enableRowSelection ? selectedKeys : undefined}
			selectionMode={enableRowSelection ? "multiple" : "none"}
			sortDescriptor={enableSorting ? sortDescriptor : undefined}
			onSelectionChange={enableRowSelection ? handleSelectionChange : undefined}
			onSortChange={enableSorting ? setSortDescriptor : undefined}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={String(column.uid)}
						allowsSorting={enableSorting && column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				emptyContent={emptyContent}
				items={sortedItems}
			>
				{(item) => (
					<TableRow key={item.id || item.key || Math.random()}>
						{(columnKey) => {
							const column = columns.find(col => String(col.uid) === columnKey);
							return (
								<TableCell>
									{column?.renderCell
										? column.renderCell(item, String(columnKey))
										: defaultRenderCell(item, String(columnKey))
									}
								</TableCell>
							);
						}}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};