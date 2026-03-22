import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, getAccountName, transactions } from "@/lib/budget/data";

export default function TransactionsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Операции</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Счет</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{getAccountName(transaction.accountId)}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="text-right">
                  {transaction.type === "expense" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
