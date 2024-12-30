import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

interface PaginationProps {
  totalCount: number
  handlePageChange: (page: number) => void
  currentPage: number
  totalPages: number
}

export function Pagination({
  totalCount,
  totalPages,
  currentPage,
  handlePageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <span className="text-sm text-muted-foreground">
          {totalCount} itens cadastrados.
        </span>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ArrowLeft />
          Anterior
        </Button>
        <span className="px-4 py-2 text-sm text-muted-zinc-700 dark:text-zinc-400">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="ghost"
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próxima
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}
