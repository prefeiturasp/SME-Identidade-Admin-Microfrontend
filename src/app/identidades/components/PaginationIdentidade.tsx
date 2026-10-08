'use client'

import { CustomPagination } from "@/components/CustomPagination"
import { useIdentidadeContext } from "../hooks/useIdentidadeContext";

export function PaginationIdentidade() {
    const { dataUserList, setPage } = useIdentidadeContext();

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <CustomPagination
                actualPage={dataUserList?.page ?? 1}
                onChange={(page) => setPage(page)}
                rowsPerPage={10}
                totalItems={dataUserList?.count ?? 0}
            />
        </div>
    )
}
