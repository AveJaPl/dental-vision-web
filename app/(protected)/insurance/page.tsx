// app/packages/page.tsx

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MotionDiv, MotionUl, MotionLi } from "@/app/components/small/Motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const packages = [
  {
    name: "Podstawowy",
    price: "89",
    features: [
      "Przegląd co 6 miesięcy",
      "Konsultacje stomatologiczne",
      "RTG punktowe",
      "Znieczulenie komputerowe",
    ],
  },
  {
    name: "Familijny",
    price: "149",
    features: [
      "Wszystko w Pakiecie Podstawowym",
      "Opieka nad dziećmi do 16 roku życia",
      "2 razy w roku lakierowanie",
      "Rabat 20% na leczenie ortodontyczne",
    ],
  },
  {
    name: "Premium",
    price: "219",
    features: [
      "Wszystko w Pakiecie Familijnym",
      "Czyszczenie kamienia 2x w roku",
      "Pilne interwencje 24h",
      "Bezpłatne leczenie próchnicy",
    ],
  },
];

const features = [
  {
    name: "Liczba wizyt rocznie",
    basic: "2",
    family: "4",
    premium: "∞",
  },
  {
    name: "Ortodonta",
    basic: "-",
    family: "Rabat",
    premium: "✓",
  },
  {
    name: "Stomatolog dziecięcy",
    basic: "-",
    family: "✓",
    premium: "✓",
  },
  {
    name: "Znieczulenie komputerowe",
    basic: "✓",
    family: "✓",
    premium: "✓",
  },
  {
    name: "Lakierowanie",
    basic: "-",
    family: "2x",
    premium: "2x",
  },
  {
    name: "Czyszczenie kamienia",
    basic: "-",
    family: "-",
    premium: "2x",
  },
  {
    name: "Pilne interwencje",
    basic: "-",
    family: "-",
    premium: "24h",
  },
  {
    name: "Bezpłatne leczenie próchnicy",
    basic: "-",
    family: "-",
    premium: "✓",
  },
];

export default function DentalPackages() {
  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-2xl font-bold">Abonamenty stomatologiczne</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Wybierz pakiet dopasowany do swoich potrzeb i ciesz się zdrowym
          uśmiechem
        </p>
      </MotionDiv>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <MotionDiv
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col bg-transparent">
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{pkg.name}</h3>
                <div className="my-4">
                  <span className="text-4xl font-bold">${pkg.price}</span>
                  <span className="text-muted-foreground">/miesiąc</span>
                </div>

                <MotionUl
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                >
                  {pkg.features.map((feature, featureIndex) => (
                    <MotionLi
                      key={feature}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      transition={{ delay: featureIndex * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </MotionLi>
                  ))}
                </MotionUl>
              </div>
              <Button className="w-full mt-6">Wybierz pakiet</Button>
            </Card>
          </MotionDiv>
        ))}
      </div>

      <Separator />

      {/* Feature Comparison */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Porównaj pakiety</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usługa</TableHead>
                <TableHead className="text-center">Podstawowy</TableHead>
                <TableHead className="text-center">Familijny</TableHead>
                <TableHead className="text-center">Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.name}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell className="text-center">{feature.basic}</TableCell>
                  <TableCell className="text-center">
                    {feature.family}
                  </TableCell>
                  <TableCell className="text-center">
                    {feature.premium}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </MotionDiv>

      <Separator />

      {/* FAQ */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Częste pytania</h2>
        <Accordion type="multiple" className="w-full">
          {[
            {
              question: "Jak aktywować pakiet?",
              answer: "Po zakupie otrzymasz instrukcję aktywacji...",
            },
            {
              question: "Czy można zmienić pakiet?",
              answer:
                "Pakiet można zmienić z zachowaniem okresu rozliczeniowego...",
            },
            {
              question: "Czy pakiet obejmuje leczenie ortodontyczne?",
              answer: "Tak, pakiet Premium obejmuje leczenie ortodontyczne...",
            },
            {
              question: "Czy pakiet obejmuje leczenie próchnicy?",
              answer:
                "Tak, pakiet Premium obejmuje bezpłatne leczenie próchnicy...",
            },
            {
              question: "Kto może skorzystać z pakietu Familijnego?",
              answer:
                "Pakiet Familijny obejmuje opiekę nad dziećmi do 16 roku życia...",
            },
            {
              question: "Kiedy odbywa się przegląd?",
              answer: "Przegląd stomatologiczny odbywa się co 6 miesięcy...",
            },
          ].map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </MotionDiv>
    </div>
  );
}
