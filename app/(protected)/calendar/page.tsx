"use client";

import React, { useState } from "react";
import { MotionDiv } from "@/app/components/small/Motion";
import { AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function CalendarPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDetails = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const calendarEntries = [
    {
      date: "29 stycznia",
      title: "Higiena jamy ustnej",
      details: "Mycie zębów 2x dziennie, użycie nici dentystycznej",
      appointment: null,
    },
    {
      date: "30 stycznia",
      title: "Unikaj słodyczy",
      details: "Ogranicz cukier, pij więcej wody",
      appointment: "Wizyta u dentysty - 14:00",
    },
    {
      date: "31 stycznia",
      title: "Płukanie jamy ustnej",
      details: "Użyj płynu do płukania 2x dziennie",
      appointment: null,
    },
    {
      date: "1 lutego",
      title: "Kontrola ortodontyczna",
      details: "Sprawdzenie aparatu ortodontycznego",
      appointment: "Ortodonta - 10:30",
    },
    {
      date: "2 lutego",
      title: "Zdrowa dieta",
      details: "Więcej warzyw i wapnia dla mocnych zębów",
      appointment: null,
    },
  ];

  return (
    <div className="space-y-6 bg-white">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Kalendarz leczenia
      </h1>

      <div className="space-y-4">
        {calendarEntries.map((entry, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br bg-background rounded-lg p-4 cursor-pointer transition-transform"
            onClick={() => toggleDetails(index)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{entry.date}</p>
                <CardTitle className="text-lg text-gray-700">
                  {entry.title}
                </CardTitle>
              </div>
              {openIndex === index ? (
                <FaChevronUp className="text-primary" />
              ) : (
                <FaChevronDown className="text-primary" />
              )}
            </div>

            {/* Szczegóły dnia - animowane */}
            <AnimatePresence>
              {openIndex === index && (
                <MotionDiv
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden mt-3"
                >
                  <CardDescription className="text-gray-600">
                    {entry.details}
                  </CardDescription>
                  {entry.appointment && (
                    <p className="text-sm text-primary font-medium mt-2">
                      🏥 {entry.appointment}
                    </p>
                  )}
                </MotionDiv>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}
