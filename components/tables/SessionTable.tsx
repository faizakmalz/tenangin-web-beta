"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Session } from "@/lib/types";

export function SessionTable({ data }: { data: Session[] }) {
  const columns: ColumnDef<Session>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-700">{getValue() as any}</span>
      ),
    },
    { accessorKey: "anon_name", header: "Nama Pengguna",
      cell: ({row}) => (
          <span className="font-medium text-gray-700">{row.original.profiles?.anon_name}</span>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue() as string;
        if (s === "waiting") return "🟡 Menunggu";
        if (s === "active") return "🟢 Aktif";
        return "🔵 Selesai";
      },
    },
    {
      accessorKey: "started_at",
      header: "Durasi",
      cell: ({ row }) => {
        const started = row.original.started_at;
        const ended = row.original.ended_at;
        return getDuration(started, ended);
      },
    },
    {
      accessorKey: "aksi",
      header: "Aksi",
      cell: ({row}) => (
        <Button className="font-mono text-sm">
          Lihat
        </Button>
      ),
    },
  ];

  function getDuration(startedAt: string | null, endedAt: string | null) {
    if (!startedAt) return "0 menit";

    const start = new Date(startedAt).getTime();
    const end = endedAt ? new Date(endedAt).getTime() : Date.now();

    const diffMin = Math.floor((end - start) / 60000);
    return diffMin + " menit";
  }


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 border-b">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                Tidak ada data Sesi.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border-b text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
