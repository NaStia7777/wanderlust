import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const generatePagination = (page: number, pages: number): (number | string)[] => {
    if (pages <= 5) {
        // Якщо сторінок менше або рівно 5, повертаємо масив [1, 2, ..., pages]
        return Array.from({ length: pages }, (_, i) => i + 1);
    }

    const result: (number | string)[] = [];

    if (page <= 3) {
        // Якщо поточна сторінка в першій трійці
        result.push(1, 2, 3, 4, '...', pages);
    } else if (page >= pages - 2) {
        // Якщо поточна сторінка в останній трійці
        result.push(1, '...', pages - 3, pages - 2, pages - 1, pages);
    } else {
        // Для інших випадків
        result.push(1, '...', page - 1, page, page + 1, '...', pages);
    }

    return result;
};

interface PaginationProps {
    pages: number,
    page: number,
    setPage: (page: number) => void;
}

export function Pagination({ pages, page, setPage }: PaginationProps) {
    const pagesArray = useMemo(
        () => generatePagination(page, pages),
        [page, pages]
    );

    return (
        <>{pages > 1 &&
            <div className="flex justify-center items-center space-x-2">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {pagesArray.map((item, index) => {
                    if (typeof item === "string")
                        return (<span key={`ellipsis-${index}`} className="px-2">...</span>);
                    else
                        return (
                            <button
                                key={item}
                                disabled={page === item}
                                onClick={() => setPage(item)}
                                className={`px-4 py-2 rounded-md ${page === item
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-100'
                                    }`}
                            >
                                {item}
                            </button>
                        );
                }
                )}

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pages}
                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        }</>
    );
}