import clsx from "clsx";
import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  loading?: boolean;
  emptyMessage?: string;
}

function DataTable<T>({
  data,
  columns,
  keyField,
  loading = false,
  emptyMessage = "No data available.",
}: DataTableProps<T>) {
  const isEmpty = !loading && data.length === 0;

  return (
    <div className="bg-card border border-app rounded-xl overflow-hidden">

      {/* ✅ Desktop Table */}
      <div className="hidden sm:block">
        <table className="w-full text-sm">
          <thead className="bg-app border-b border-app">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="text-left px-6 py-4 font-medium opacity-70"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isEmpty && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 opacity-60"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row) => (
                <tr
                  key={String(row[keyField])}
                  className="border-b border-app last:border-none hover:bg-app transition-all"
                >
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className={clsx("px-6 py-4", col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.accessor] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card Layout */}
      <div className="sm:hidden divide-y divide-app">

        {isEmpty && (
          <div className="p-6 text-center opacity-60">
            {emptyMessage}
          </div>
        )}

        {!loading &&
          data.map((row) => (
            <div
              key={String(row[keyField])}
              className="p-4 space-y-3"
            >
              {columns.map((col, index) => {

                // ✅ Skip empty header columns (like action column)
                if (!col.header) return null;

                return (
                  <div
                    key={index}
                    className="flex justify-between gap-4"
                  >
                    <span className="text-xs opacity-60">
                      {col.header}
                    </span>

                    <span className="text-sm font-medium text-right">
                      {col.render
                        ? col.render(row)
                        : String(row[col.accessor] ?? "-")}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
      </div>

    </div>
  );
}

export default DataTable;