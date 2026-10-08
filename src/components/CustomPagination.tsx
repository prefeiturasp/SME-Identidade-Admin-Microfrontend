'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
    rowsPerPage: number;
    actualPage: number;
    totalItems: number;
    onChange: (page: number) => void;
}

export function CustomPagination({
    rowsPerPage,
    actualPage,
    totalItems,
    onChange,
}: CustomPaginationProps) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    if (totalPages <= 1) {
        return null;
    }

    const handleChangePage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onChange(page);
        }
    };

    const renderPages = () => {
        const pages: React.ReactNode[] = [];

        const startPage = Math.max(2, actualPage - 1);
        const endPage = Math.min(totalPages - 1, actualPage + 1);

        // Primeira página
        pages.push(
            <PaginationItem key={1}>
                <PaginationLink
                    href="#"
                    isActive={actualPage === 1}
                    onClick={(e) => {
                        e.preventDefault();
                        handleChangePage(1);
                    }}
                >
                    1
                </PaginationLink>
            </PaginationItem>,
        );

        // Ellipsis inicial
        if (startPage > 2) {
            pages.push(
                <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                </PaginationItem>,
            );
        }

        // Páginas centrais
        for (let page = startPage; page <= endPage; page++) {
            pages.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        className={page > 999 ? "w-fit p-1" : ""}
                        href="#"
                        isActive={actualPage === page}
                        onClick={(e) => {
                            e.preventDefault();
                            handleChangePage(page);
                        }}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        // Ellipsis final
        if (endPage < totalPages - 1) {
            pages.push(
                <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                </PaginationItem>,
            );
        }

        // Última página
        if (totalPages > 1) {
            pages.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        className={totalPages > 999 ? "w-fit p-1" : ""}
                        href="#"
                        isActive={actualPage === totalPages}
                        onClick={(e) => {
                            e.preventDefault();
                            handleChangePage(totalPages);
                        }}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        return pages;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleChangePage(actualPage - 1);
                        }}
                    />
                </PaginationItem>

                {renderPages()}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleChangePage(actualPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
