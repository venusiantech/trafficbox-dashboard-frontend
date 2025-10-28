"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type CampaignPerformanceData = {
  campaignId: string;
  title: string;
  sparkTrafficProjectId?: string;
  hits: number;
  visits: number;
  views: number;
  uniqueVisitors: number;
  speed: number;
  bounceRate: number;
  sessionDuration: number;
  lastUpdated: string;
  projectStatus: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-success/10 text-success';
    case 'paused':
      return 'bg-warning/10 text-warning';
    case 'unknown':
    default:
      return 'bg-default/10 text-default-600';
  }
}

export const columns: ColumnDef<CampaignPerformanceData>[] = [
  {
    accessorKey: "title",
    header: "Campaign",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex-1 text-start">
          <h4 className="text-sm font-medium text-default-900 whitespace-nowrap mb-1">
            {row.original.title}
          </h4>
          <div className="text-xs font-normal text-default-600">
            {row.original.sparkTrafficProjectId || 'N/A'}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "hits",
    header: "Hits",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium">{row.getValue("hits")}</span>
    ),
  },
  {
    accessorKey: "visits",
    header: "Visits",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.getValue("visits")}</span>
        {row.original.visits > 0 && (
          <TrendingUp className="text-success w-3 h-3" />
        )}
      </div>
    )
  },
  {
    accessorKey: "views",
    header: "Views",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("views")}</span>
    )
  },
  {
    accessorKey: "uniqueVisitors",
    header: "Unique",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("uniqueVisitors")}</span>
    )
  },
  {
    accessorKey: "bounceRate",
    header: "Bounce Rate",
    cell: ({ row }) => (
      <span className="font-medium">
        {(row.getValue("bounceRate") as number * 100).toFixed(1)}%
      </span>
    )
  },
  {
    accessorKey: "projectStatus",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={getStatusColor(row.getValue("projectStatus"))}>
        {row.getValue("projectStatus")}
      </Badge>
    )
  }
]

interface CompanyTableProps {
  data?: CampaignPerformanceData[];
}

const CompanyTable = ({ data = [] }: CompanyTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
  })

  return (
    <div className="w-full max-h-[550px] overflow-x-auto">
      <Table className="overflow-hidden">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-default-200">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="h-[75px]"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center py-4 gap-2 flex-none">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className='w-8 h-8'
        >
          <ChevronLeft className='w-4 h-4' />
        </Button>
        {table.getPageOptions().map((page, pageIndex) => (
          <Button
            key={`basic-data-table-${pageIndex}`}
            onClick={() => table.setPageIndex(pageIndex)}
            size="icon"
            className="w-8 h-8"
            variant={table.getState().pagination.pageIndex === pageIndex ? 'default' : 'outline'}
          >
            {page + 1}
          </Button>

        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className='w-8 h-8'
        >
          <ChevronRight className='w-4 h-4' />
        </Button>
      </div>
    </div>
  )
}

export default CompanyTable;

