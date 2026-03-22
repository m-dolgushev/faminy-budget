import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { familyMembers, userProfile } from "@/lib/budget/data";

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>Данные владельца бюджета</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Имя: {userProfile.name}</p>
            <p>Email: {userProfile.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Тема</CardTitle>
            <CardDescription>Переключение внешнего вида</CardDescription>
          </CardHeader>
          <CardContent>
            <ModeToggle />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Участники</CardTitle>
          <CardDescription>Пользователи с доступом к бюджету</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {familyMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded border p-2">
              <span>{member.name}</span>
              <Badge variant="outline">{member.role}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
