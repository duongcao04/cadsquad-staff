import {
    Spinner,
    Table as HeroUITable,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableProps as HeroUITableProps,
    TableRow,
    SortDescriptor,
} from '@heroui/react'
import {
    flexRender,
    Table as TanStackTableInstance,
} from '@tanstack/react-table'
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area'

interface TanStackHeroTableProps<TData> extends Omit<
    HeroUITableProps,
    'children'
> {
    table: TanStackTableInstance<TData>
    isLoading?: boolean
    emptyContent?: React.ReactNode
}

export function TanStackHeroTable<TData>({
    table,
    isLoading = false,
    emptyContent = 'No rows to display.',
    ...props
}: TanStackHeroTableProps<TData>) {
    // 1. Sync TanStack State -> HeroUI SortDescriptor
    const sortingState = table.getState().sorting
    const sortDescriptor: SortDescriptor | undefined = sortingState?.[0]
        ? {
              column: sortingState[0].id,
              direction: sortingState[0].desc ? 'descending' : 'ascending',
          }
        : undefined

    // 2. Handle HeroUI Event -> Update TanStack State
    const handleSortChange = (descriptor: SortDescriptor) => {
        // HeroUI returns the column key (which we set to header.id below)
        const column = table.getColumn(descriptor.column as string)
        if (column) {
            // Determine new direction. HeroUI toggles automatically, so we just follow its lead.
            const isDesc = descriptor.direction === 'descending'
            column.toggleSorting(isDesc)
        }
    }

    return (
        <HeroUITable
            aria-label="TanStack Data Table"
            isHeaderSticky
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange} // <--- Event handler goes here on the Table
            BaseComponent={(found) => (
                <ScrollArea className="size-full h-full! border-1 border-border-default p-2 rounded-md min-h-[calc(100%-150px)]">
                    <ScrollBar orientation="horizontal" />
                    <ScrollBar orientation="vertical" />
                    {found.children}
                </ScrollArea>
            )}
            classNames={{
                table: !isLoading ? 'relative' : 'relative min-h-[430px]!',
                ...props.classNames,
            }}
            {...props}
        >
            <TableHeader>
                {table.getHeaderGroups()[0].headers.map((header) => {
                    return (
                        <TableColumn
                            key={header.id} // This ID matches descriptor.column in handleSortChange
                            allowsSorting={header.column.getCanSort()}
                            align={
                                (header.column.columnDef.meta as any)?.align ||
                                'start'
                            }
                            // REMOVED: onSortChange prop (it does not exist on TableColumn)
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                  )}
                        </TableColumn>
                    )
                })}
            </TableHeader>
            <TableBody
                emptyContent={emptyContent}
                items={table.getRowModel().rows}
                isLoading={isLoading}
                loadingContent={
                    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-content1/50 backdrop-blur-sm z-50">
                        <Spinner
                            size="lg"
                            color="primary"
                            label="Loading data..."
                        />
                    </div>
                }
            >
                {(row) => (
                    <TableRow key={row.id} data-selected={row.getIsSelected()}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                )}
            </TableBody>
        </HeroUITable>
    )
}
