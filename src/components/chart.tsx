"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Updated data: Male & Female students appearing for tests
const chartData = [
  { month: "January", male: 120, female: 80 },
  { month: "February", male: 150, female: 100 },
  { month: "March", male: 180, female: 120 },
  { month: "April", male: 130, female: 90 },
  { month: "May", male: 170, female: 110 },
  { month: "June", male: 200, female: 140 },
  { month: "July", male: 220, female: 160 },
  { month: "August", male: 210, female: 170 },
  { month: "September", male: 190, female: 150 },
  { month: "October", male: 230, female: 180 },
  { month: "November", male: 250, female: 200 },
  { month: "December", male: 240, female: 190 },
]

// Updated chart config for Male & Female categories
const chartConfig = {
  male: {
    label: "Male",
    color: "#0088FE", // Blue color
  },
  female: {
    label: "Female",
    color: "#FF6384", // Pink color
  },
} satisfies ChartConfig

export function ChartComponent() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full lg:w-[800px]">
      <BarChart width={800} height={350} accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)} // Shortens months to 3 letters
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="male" fill="var(--color-male, #0088FE)" radius={4} />
        <Bar dataKey="female" fill="var(--color-female, #FF6384)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
