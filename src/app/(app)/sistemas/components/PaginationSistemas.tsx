'use client'

import { CustomPagination } from "@/components/CustomPagination"
import { useSistemasContext } from "../hooks/useSistemasContext";

export function PaginationSistemas() {
    const {
        dataClientsList,
        isLoadingDataClientsList,
        setPage,
        page,
        pageSize
    } = useSistemasContext();

    if (isLoadingDataClientsList) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <CustomPagination
                actualPage={page}
                onChange={(page) => setPage(page)}
                rowsPerPage={pageSize}
                totalItems={dataClientsList?.length ?? 0}
            />
        </div>
    )
}
