import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, getTotalInvestmentsValue, investments } from "@/lib/budget/data";

export default function InvestmentsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Инвестиции</h1>
      <p className="text-sm text-muted-foreground">
        Общая стоимость портфеля: {formatCurrency(getTotalInvestmentsValue())}
      </p>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Тикер</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="text-right">Кол-во</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-right">Стоимость</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell>{investment.ticker}</TableCell>
                <TableCell>{investment.name}</TableCell>
                <TableCell className="text-right">{investment.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(investment.price)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(investment.quantity * investment.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
