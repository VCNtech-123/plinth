import clsx from "clsx";
import type { ReactNode } from "react";

export interface Column<T> {
  header: string; // keep, can be ""
  accessor: keyof T;
  render?: (row: T) => ReactNode;
  className?: string;

  // Mobile enhancements
  hideOnMobile?: boolean;
  mobileLabel?: string;
  mobileRender?: (row: T) => ReactNode;
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

  // Desktop: unchanged
  const desktopColumns = columns;

  // Mobile: allow columns to opt out
  const mobileColumns = columns.filter((c) => !c.hideOnMobile);

  // Identify action-like columns (header empty) so we can render them on mobile
  const mobileActionColumns = mobileColumns.filter((c) => !c.header);
  const mobileValueColumns = mobileColumns.filter((c) => c.header);

  return (
    <div className="bg-card border border-app rounded-xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <table className="w-full text-sm">
          <thead className="bg-app border-b border-app">
            <tr>
              {desktopColumns.map((col, index) => (
                <th
                  key={index}
                  className={clsx(
                    "text-left px-6 py-4 font-medium text-app/70",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isEmpty && (
              <tr>
                <td colSpan={desktopColumns.length} className="text-center py-10 text-app/60">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row) => (
                <tr
                  key={String(row[keyField])}
                  className="border-b border-app last:border-none hover:bg-app transition-colors duration-150 ease-out"
                >
                  {desktopColumns.map((col, index) => (
                    <td key={index} className={clsx("px-6 py-4", col.className)}>
                      {col.render ? col.render(row) : String(row[col.accessor] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden divide-y divide-border">
        {isEmpty && (
          <div className="p-6 text-center text-app/60">{emptyMessage}</div>
        )}

        {!loading &&
          data.map((row) => (
            <div key={String(row[keyField])} className="p-4">
              <div className="space-y-3">
                {mobileValueColumns.map((col, index) => (
                  <div key={index} className="flex justify-between gap-4">
                    <span className="text-xs text-app/60">
                      {col.mobileLabel ?? col.header}
                    </span>

                    <span className="text-sm font-medium text-app text-right">
                      {col.mobileRender
                        ? col.mobileRender(row)
                        : col.render
                          ? col.render(row)
                          : String(row[col.accessor] ?? "-")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile Actions Footer */}
              {mobileActionColumns.length > 0 && (
                <div className="mt-4 pt-3 border-t border-app flex justify-end gap-2">
                  {mobileActionColumns.map((col, index) => (
                    <div key={index}>
                      {col.mobileRender
                        ? col.mobileRender(row)
                        : col.render
                          ? col.render(row)
                          : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default DataTable;