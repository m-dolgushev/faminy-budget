"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, useBudget } from "@/components/budget/budget-provider";
import type { Investment } from "@/lib/budget/types";

export default function InvestmentsPage() {
  const { investments, totalInvestmentsValue, updateInvestmentPrice } = useBudget();
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [newPrice, setNewPrice] = useState("");

  const portfolioHistory = useMemo(() => {
    const allDates = Array.from(new Set(investments.flatMap((investment) => investment.history.map((h) => h.date))))
      .sort();
    return allDates.map((date) => {
      const total = investments.reduce((sum, investment) => {
        const point = investment.history.find((history) => history.date === date);
        if (!point) return sum;
        return sum + point.price * investment.quantity;
      }, 0);
      return { date, value: total };
    });
  }, [investments]);

  const submitPriceUpdate = () => {
    if (!selectedInvestment || !newPrice) return;
    updateInvestmentPrice(selectedInvestment.id, Number(newPrice));
    setSelectedInvestment(null);
    setNewPrice("");
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Инвестиции</h1>

      <Card>
        <CardHeader>
          <CardTitle>Стоимость портфеля</CardTitle>
          <CardDescription>{formatCurrency(totalInvestmentsValue)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line dataKey="value" type="monotone" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активы</CardTitle>
          <CardDescription>Индексируйте текущую стоимость активов.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Тикер</TableHead>
                <TableHead>Название</TableHead>
                <TableHead className="text-right">Кол-во</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead className="text-right">Стоимость</TableHead>
                <TableHead className="text-right">Действия</TableHead>
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
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInvestment(investment);
                            setNewPrice(investment.price.toString());
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Индексировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Обновление стоимости актива</DialogTitle>
                          <DialogDescription>
                            Новое значение добавится в историю.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-2">
                          <Label>Новая цена</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newPrice}
                            onChange={(event) => setNewPrice(event.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={submitPriceUpdate}>Сохранить</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
