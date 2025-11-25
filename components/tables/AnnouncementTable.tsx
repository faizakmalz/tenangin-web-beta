"use client";

import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AnnouncementTable({ data }: { data: any[] }) {

  const columns: ColumnDef<any>[] = [
    { accessorKey: "title", header: "Judul" },
    { accessorKey: "category", header: "Kategori" },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("id-ID")
    },
    {
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/announcements/${row.original.id}`}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>

          <Button size="sm" variant="destructive">Hapus</Button>
        </div>
      )
    }
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="bg-white rounded-lg overflow-x-auto border border-gray-200">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="px-4 py-3 border-b font-semibold">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-t hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <p className="text-center text-gray-500 py-6">Tidak ada data.</p>
      )}
    </div>
  );
}
