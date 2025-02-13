"use client";

import React, { useState } from "react";
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
import { AnimatePresence } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaHistory,
  FaUser,
  FaBook,
  FaShieldAlt,
} from "react-icons/fa";
import { MotionDiv } from "@/app/components/small/Motion";

export default function Dashboard() {
  const [showMore, setShowMore] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  // Handle redirect
  const handleRedirect = (path: string) => () => {
    redirect(path);
  };

  const mainOptions = [
    {
      title: "Ankieta",
      icon: FaClipboardList,
      link: "/survey",
    },
    {
      title: "Diagnostyka",
      icon: FaBolt,
      link: "/diagnostics",
    },
    {
      title: "Konsultacja",
      icon: FaUserMd,
      link: "/consultation",
    },
    {
      title: "Wizyta",
      icon: FaCalendarCheck,
      link: "/visit",
    },
    {
      title: "Historia",
      icon: FaHistory,
      link: "/history",
    },
    {
      title: "Profil",
      icon: FaUser,
      link: "/profile",
    },
    {
      title: "Edukacja",
      icon: FaBook,
      link: "/education",
    },
    {
      title: "Ubezpieczenia",
      icon: FaShieldAlt,
      link: "/insurance",
    },
  ];

  const recommendations = [
    {
      title: "Zalecenia dietetyczne",
      link: "/diet",
    },
    {
      title: "Proces gojenia",
      link: "/healing",
    },
    {
      title: "Zalecenia lekowe",
      link: "/medicine",
    },
    {
      title: "Ciekawostki stomatologiczne",
      link: "/funfacts",
    },
  ];

  const calendar = [
    {
      title: "Poniedziałek",
      content: "Mycie zębów 2x dziennie",
    },
    {
      title: "Wtorek",
      content: "Unikaj słodyczy",
    },
    {
      title: "Środa",
      content: "Płukanie jamy ustnej płynem",
    },
  ];

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
      <section className="w-full max-w-md mx-auto space-y-2">
        {/* Asystent */}
        <Card
          className="col-span-2 bg-gradient-to-br bg-background rounded-lg p-5 transform transition-transform duration-300 hover:scale-105 flex justify-between items-center"
          onClick={handleRedirect("/chat")}
        >
          <Image
            src="/assistant.png"
            width={82}
            height={82}
            alt="Assistant"
            className="rounded-full"
          />
          <h3 className="text-md font-semibold text-gray-700 text-end">
            Rozmowa z asystentem
          </h3>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {
            // Main first two options
            mainOptions.slice(0, 2).map((option, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br bg-background rounded-lg p-5 transform transition-transform duration-300 hover:scale-105 flex justify-between items-center"
                onClick={handleRedirect(option.link)}
              >
                {/* Icon */}
                <option.icon size={24} className="text-primary" />
                {/* Title */}
                <h3 className="text-sm font-medium text-gray-700 text-end">
                  {option.title}
                </h3>
              </Card>
            ))
          }
        </div>

        {/* Button to show/hide */}
        <div className="text-center mt-2">
          <Button
            variant="link"
            size="sm"
            className="text-primary"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Pokaż mniej" : "Zobacz wszystkie"}
          </Button>
        </div>

        {/* MotionDiv with AnimatePresence */}
        <AnimatePresence>
          {showMore && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 mt-2">
                {
                  // Main options
                  mainOptions.slice(2).map((option, index) => (
                    <Card
                      key={index}
                      className="bg-gradient-to-br bg-background rounded-lg p-5 transform transition-transform duration-300 hover:scale-105 flex justify-between items-center"
                      onClick={handleRedirect(option.link)}
                    >
                      {/* Icon */}
                      <option.icon size={24} className="text-primary" />
                      {/* Title */}
                      <h3 className="text-sm font-medium text-gray-700 text-end">
                        {option.title}
                      </h3>
                    </Card>
                  ))
                }
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </section>
      {/* Recommendations Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Codzienne zalecenia
          </h3>
          <Button
            variant="link"
            size="sm"
            className="text-primary"
            onClick={() => setShowRecommendations(!showRecommendations)}
          >
            {showRecommendations ? "Pokaż mniej" : "Zobacz wszystkie"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Zalecenia higienizacyjne */}
          <Card className="bg-gradient-to-br bg-background rounded-lg p-3 transform transition-transform duration-300 hover:scale-105 flex items-center justify-center">
            <CardHeader className="p-0">
              <CardTitle className="text-sm text-center text-gray-600">
                Zalecenia higienizacyjne
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="flex flex-col gap-3">
            {/* Zęby do leczenia */}
            <Card className="bg-gradient-to-br bg-background rounded-lg p-3 transform transition-transform duration-300 hover:scale-105 flex items-center justify-center">
              <CardHeader className="p-0">
                <CardTitle className="text-sm text-center text-gray-600">
                  Zęby do leczenia
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Analiza bólu */}
            <Card className="bg-gradient-to-br bg-background rounded-lg p-3 transform transition-transform duration-300 hover:scale-105 flex items-center justify-center">
              <CardHeader className="p-0">
                <CardTitle className="text-sm text-center text-gray-600">
                  Analiza bólu
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Nowe opcje */}
        <AnimatePresence>
          {showRecommendations && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 mt-2">
                {
                  // Recommendations
                  recommendations.map((option, index) => (
                    <Card
                      key={index}
                      className="bg-gradient-to-br bg-background rounded-lg p-3 transform transition-transform duration-300 hover:scale-105 flex items-center justify-center"
                      onClick={handleRedirect(option.link)}
                    >
                      <CardHeader className="p-0">
                        <CardTitle className="text-sm text-center text-gray-600">
                          {option.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))
                }
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </section>

      {/* Calendar Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Kalendarz leczenia
          </h3>
          <Button
            variant="link"
            size="sm"
            className="text-primary"
            onClick={handleRedirect("/calendar")}
          >
            Zobacz wszystkie
          </Button>
        </div>

        <div className="grid gap-2">
          {calendar.map((tile, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br bg-background rounded-lg p-3 transform transition-transform duration-300 hover:scale-105 text-center"
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
