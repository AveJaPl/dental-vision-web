"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaClipboardList, FaBolt } from "react-icons/fa";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Dashboard() {

  // Handle redirect
  const handleRedirect = (path: string) => () => {
    redirect(path);
  };

  return (
    <div className="space-y-8 bg-white">
      {/* Greeting Section */}
      <section className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-gray-800">
          Zadbaj o swój{" "}
          <span className="text-primary text-xl font-semibold">zdrowy</span>{" "}
          uśmiech
        </h1>
      </section>

      {/* Main Options Section */}
      <section className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
        {/* Asystent */}
        <Card className="col-span-2 bg-gradient-to-br bg-background  rounded-lg p-5 transform transition-transform duration-300 hover:scale-105 flex justify-between items-center" onClick={handleRedirect("/chat")}>
          <Image
            src="/assistant.png"
            width={82}
            height={82}
            alt="Assistant"
            className="rounded-full "
          />
          <h3 className="text-md font-semibold text-gray-700 text-end">
            Rozmowa z asystentem
          </h3>
        </Card>

        {/* Ankieta */}
        <Card className="bg-gradient-to-br bg-background  rounded-lg p-5 transform transition-transform duration-300 hover:scale-105 flex justify-between items-center">
          <FaClipboardList size={24} className="text-primary" />
          <h3 className="text-sm font-medium text-gray-700 text-end">
            Ankieta
          </h3>
        </Card>

        {/* Diagnostyka zdjęcia */}
        <Card className="bg-gradient-to-br bg-background  rounded-lg p-5 transform transition-transform duration-300 hover:scale-105 flex justify-between items-center">
          <FaBolt size={24} className="text-primary" />
          <h3 className="text-sm font-medium text-gray-700 text-end">
            Diagnostyka zdjęcia
          </h3>
        </Card>
      </section>

      {/* Recommendations Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Twoje codzienne zalecenia
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Zalecenia higienizacyjne */}
          <Card className="bg-gradient-to-br bg-background  rounded-lg p-3 transform transition-transform duration-300 hover:scale-105 flex items-center justify-center">
            <CardHeader className="p-0">
              <CardTitle className="text-sm text-center text-gray-600">
                Zalecenia higienizacyjne
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="flex flex-col gap-3">
            {/* Zęby do leczenia */}
            <Card className="bg-gradient-to-br bg-background  rounded-lg p-3 transform transition-transform duration-300 hover:scale-105 flex items-center justify-center">
              <CardHeader className="p-0">
                <CardTitle className="text-sm text-center text-gray-600">
                  Zęby do leczenia
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Analiza bólu */}
            <Card className="bg-gradient-to-br bg-background  rounded-lg p-3 transform transition-transform duration-300 hover:scale-105 flex items-center justify-center">
              <CardHeader className="p-0">
                <CardTitle className="text-sm text-center text-gray-600">
                  Analiza bólu
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Kalendarz leczenia
          </h3>
          <Button variant="link" size="sm" className="text-primary">
            Zobacz wszystkie
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: "Kafelek 1",
              content: "Treść",
            },
            {
              title: "Kafelek 2",
              content: "Treść",
            },
            {
              title: "Kafelek 3",
              content: "Treść",
            },
          ].map((tile, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br bg-background  rounded-lg p-5 transform transition-transform duration-300 hover:scale-105 text-center"
            >
              <CardHeader className="p-0">
                <CardTitle className="text-gray-700">{tile.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {tile.content}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
