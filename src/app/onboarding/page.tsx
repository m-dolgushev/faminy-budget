"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBudgetAction, joinBudgetAction } from "@/app/onboarding/actions";

const initialState = {};

export default function OnboardingPage() {
  const [createState, createFormAction, createPending] = useActionState(
    createBudgetAction,
    initialState
  );
  const [joinState, joinFormAction, joinPending] = useActionState(joinBudgetAction, initialState);

  return (
    <main className="container grid min-h-[calc(100vh-4rem)] gap-6 py-8 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Шаг 1: Авторизуйтесь</CardTitle>
          <CardDescription>
            Для создания бюджета или вступления по коду нужен вход в аккаунт.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary">
            <Link href="/auth">Открыть вход по email</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Создать бюджет</CardTitle>
          <CardDescription>Вы станете владельцем и сможете приглашать участников.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createFormAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название бюджета</Label>
              <Input id="name" name="name" placeholder="Семейный бюджет" required />
            </div>
            {createState.error ? (
              <p className="text-sm text-destructive">{createState.error}</p>
            ) : null}
            <Button type="submit" disabled={createPending} className="w-full">
              {createPending ? "Создаём..." : "Создать"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Присоединиться по коду</CardTitle>
          <CardDescription>Введите код, который вам отправил владелец бюджета.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={joinFormAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код приглашения</Label>
              <Input id="code" name="code" placeholder="ABC123" required />
            </div>
            {joinState.error ? <p className="text-sm text-destructive">{joinState.error}</p> : null}
            <Button type="submit" disabled={joinPending} variant="outline" className="w-full">
              {joinPending ? "Проверяем..." : "Присоединиться"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
