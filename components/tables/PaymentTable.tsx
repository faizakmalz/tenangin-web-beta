"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PaymentTable({ data }: { data: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-700">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "profiles.anon_name",
      header: "User",
      cell: ({ row }) => row.original.profiles?.anon_name || "-",
    },
    {
      accessorKey: "amount",
      header: "Harga",
      cell: ({ getValue }) => `Rp ${Number(getValue()).toLocaleString()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const v = getValue() as string;
        const map: any = {
          pending: "🟡 Pending",
          paid: "🟢 Paid",
          failed: "🔴 Failed",
        };
        return map[v] || v;
      },
    },
    {
      accessorKey: "session_id",
      header: "Session",
      cell: ({ row }) => {
        const sid = row.original.session_id;

        if (!sid) return <span className="text-gray-400">-</span>;

        return (
          <Link
            href={`/active-users/${sid}`}
            className="text-blue-600 underline text-sm"
          >
            Lihat Sesi
          </Link>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleString("id-ID"),
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <div className="flex gap-2">
            {payment.status === "pending" && (
              <Button size="sm" variant="outline">
                Approve
              </Button>
            )}

            <Button size="sm" variant="secondary">
              Detail
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-sm border-b font-semibold text-gray-700"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td className="text-center text-gray-500 py-6" colSpan={columns.length}>
                Tidak ada data pembayaran.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
