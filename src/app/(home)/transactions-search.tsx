import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'

interface SearchProps {
  transactionName: string
  createdAtGte: string
  createdAtLte: string
}

interface TransactionSearchProps {
  search: SearchProps
  setSearch: Dispatch<SetStateAction<SearchProps>>
  setCurrentPage: Dispatch<SetStateAction<number>>
}

export function TransactionsSearch({
  search,
  setSearch,
  setCurrentPage,
}: TransactionSearchProps) {
  return (
    <div className="w-full flex items-center gap-4">
      <div className="flex flex-col gap-3">
        <Label>Data inicio</Label>
        <Input
          type="date"
          value={search.createdAtGte}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch((prev) => ({
              ...prev,
              createdAtGte: e.target.value,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Data fim</Label>
        <Input
          type="date"
          value={search.createdAtLte}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch((prev) => ({
              ...prev,
              createdAtLte: e.target.value,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Nome da transação</Label>
        <Input
          value={search.transactionName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch((prev) => ({
              ...prev,
              transactionName: e.target.value,
            }))
          }
        />
      </div>

      <Button
        className="mt-5"
        variant="outline"
        type="button"
        onClick={() => {
          setSearch({
            transactionName: '',
            createdAtGte: '',
            createdAtLte: '',
          })
          setCurrentPage(1)
        }}
      >
        Limpar filtros
      </Button>
    </div>
  )
}
