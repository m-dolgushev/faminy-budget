"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBudget } from "@/components/budget/budget-provider";

export default function SettingsPage() {
  const {
    userProfile,
    updateProfile,
    familyMembers,
    addFamilyMember,
    removeFamilyMember,
  } = useBudget();
  const [draftProfile, setDraftProfile] = useState(userProfile);
  const [newMemberName, setNewMemberName] = useState("");

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>Настройка имени и email владельца бюджета.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>Имя</Label>
              <Input
                value={draftProfile.name}
                onChange={(event) =>
                  setDraftProfile((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={draftProfile.email}
                onChange={(event) =>
                  setDraftProfile((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>
            <Button onClick={() => updateProfile(draftProfile)}>Сохранить профиль</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Тема</CardTitle>
            <CardDescription>Светлая, тёмная или системная тема.</CardDescription>
          </CardHeader>
          <CardContent>
            <ModeToggle />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Участники бюджета</CardTitle>
          <CardDescription>Управление людьми, участвующими в бюджете.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Имя участника"
              value={newMemberName}
              onChange={(event) => setNewMemberName(event.target.value)}
            />
            <Button
              onClick={() => {
                addFamilyMember(newMemberName);
                setNewMemberName("");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>

          {familyMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded border p-2">
              <div className="flex items-center gap-2">
                <span>{member.name}</span>
                <Badge variant="outline">{member.role}</Badge>
              </div>
              {member.role !== "owner" ? (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFamilyMember(member.id)}
                  aria-label="Удалить участника"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
