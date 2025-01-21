"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FaUser, FaLock, FaBell, FaSignOutAlt } from "react-icons/fa";

export default function Profile() {
  // State to toggle edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State to manage user data
  const [userData, setUserData] = useState({
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Save changes and exit edit mode
  const saveChanges = () => {
    // Here you could send the updated userData to your backend
    console.log("Zapisano zmiany:", userData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full text-center space-y-8 bg-background">
      {/* Profile Info Section */}
      <Card className="w-full max-w-md text-left bg-background">
        <CardHeader>
          <CardTitle className="text-lg">Informacje o koncie</CardTitle>
          <CardDescription className="text-sm text-foreground">
            {isEditing
              ? "Możesz edytować swoje dane."
              : "Twoje dane osobowe i kontaktowe."}
          </CardDescription>
        </CardHeader>
        <div className="p-4 space-y-4">
          <div>
            <Label htmlFor="name" className="text-foreground">
              Imię i nazwisko
            </Label>
            <Input
              id="name"
              value={userData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 border-b-foreground shadow-none ${
                isEditing ? "" : "cursor-not-allowed bg-gray-50"
              }`}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-foreground">
              E-mail
            </Label>
            <Input
              id="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 border-b-foreground shadow-none ${
                isEditing ? "" : "cursor-not-allowed bg-gray-50"
              }`}
            />
          </div>
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <Button
                    variant="ghost"
                  onClick={toggleEditMode}
                >
                  Anuluj
                </Button>
                <Button onClick={saveChanges}>Zapisz zmiany</Button>
              </>
            ) : (
              <Button onClick={toggleEditMode}>Edytuj profil</Button>
            )}
          </div>
        </div>
      </Card>

      {/* Settings Section */}
      <Card className="w-full max-w-md text-left bg-background">
        <CardHeader>
          <CardTitle className="text-lg">Ustawienia</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Zarządzaj ustawieniami swojego konta.
          </CardDescription>
        </CardHeader>
        <div className="p-4 space-y-4">
          {/* Change Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaLock size={20} className="text-primary" />
              <p className="text-sm text-gray-700">Zmień hasło</p>
            </div>
            <Button variant="link" size="sm">
              Edytuj
            </Button>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaBell size={20} className="text-primary" />
              <p className="text-sm text-gray-700">Powiadomienia</p>
            </div>
            <Button variant="link" size="sm">
              Edytuj
            </Button>
          </div>

          <Separator />

          {/* Personalization */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaUser size={20} className="text-primary" />
              <p className="text-sm text-gray-700">Personalizacja</p>
            </div>
            <Button variant="link" size="sm">
              Edytuj
            </Button>
          </div>
        </div>
      </Card>

      {/* Logout Section */}
      <div className="w-full max-w-md">
        <Button
          variant="destructive"
          size="lg"
          className="w-full flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt size={20} />
          <span>Wyloguj się</span>
        </Button>
      </div>
    </div>
  );
}
