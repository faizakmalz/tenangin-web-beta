"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface AnonUser {
  id: string;
  anon_name: string;
  avatar?: string;
  bio?: string;
  is_online?: boolean;
  last_active_at?: string;
}

export function AnonUsersTable({ data }: { data: AnonUser[] }) {
  const columns: ColumnDef<AnonUser>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-700">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "anon_name",
      header: "Nama Anonim",
      cell: ({ getValue }) => (
        <span className="text-gray-800">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => {
        const avatar = row.original.avatar;
        return (
          <div className="flex items-center">
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                N/A
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "bio",
      header: "Bio",
      cell: ({ getValue }) => (
        <span className="text-gray-700">{getValue() as string || "-"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isOnline = row.original.is_online;
        const last = row.original.last_active_at
          ? new Date(row.original.last_active_at)
          : null;

        let active = isOnline;

        // fallback: based on last_active_at less than 5 minutes
        if (!isOnline && last) {
          const diff = (Date.now() - last.getTime()) / 1000;
          if (diff < 300) active = true;
        }

        return (
          <span className="font-medium">
            {active ? "🟢 Aktif" : "🔴 Tidak Aktif"}
          </span>
        );
      },
    },
    {
      accessorKey: "last_active_at",
      header: "Terakhir Aktif",
      cell: ({ getValue }) => {
        const v = getValue();
        if (!v) return "-";

        const date = new Date(v as string);
        return date.toLocaleString("id-ID");
      },
    },
    {
      header: "Aksi",
      cell: () => (
        <Button size="sm" variant="outline">
          Lihat
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
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
                Tidak ada data User Anonim.
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
