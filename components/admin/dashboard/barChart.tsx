"use client"

import { useContext } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import AppModeContext from '@/context/appMode';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

// Define TypeScript interfaces for data
interface Option {
    option: string;
    markedCount: number;
}

interface ChartData {
    question: string;
    options: Option[];
}

// Define a type for the formatted data that Recharts can use
interface FormattedData {
    optionLabel: string;
    optionText: string;
    users: number;
    fill: string;
}

// Chart configuration types
interface ChartConfigType {
    [key: string]: {
        label: string;
        color: string;
    };
}

// Chart configuration with dynamic colors
const chartConfig: ChartConfigType = {
    optionA: { label: "A", color: "hsl(0, 70%, 50%)" },
    optionB: { label: "B", color: "hsl(90, 70%, 50%)" },
    optionC: { label: "C", color: "hsl(180, 70%, 50%)" },
    optionD: { label: "D", color: "hsl(270, 70%, 50%)" },
};

// The Barchart component accepts chartData as a prop
interface BarchartProps {
    chartData: ChartData;
}

export function Barchart({ chartData }: BarchartProps) {
    const modeContext = useContext(AppModeContext);
    if (!modeContext) {
        throw new Error('AppModeContextProvider is missing');
    }
    const { lightmode } = modeContext;

    // Format the chart data for Recharts
    const formattedChartData: FormattedData[] = chartData?.options.map((item, index) => ({
        optionLabel: String.fromCharCode(65 + index), // A, B, C, D
        optionText: item.option,
        users: item.markedCount,
        fill: chartConfig[`option${String.fromCharCode(65 + index)}`]?.color, // Use colors from chartConfig
    }));

    return (
        <div className={`min-w-[325px] ${lightmode ? "bg-white text-black shadow-lg border-[1px]" : "bg-darkBg text-darkText border-[1px] border-darkBorder rounded-xl"}`}>
            <CardHeader>
                <CardTitle className="text-[19px]">{chartData?.question}</CardTitle>
                <CardDescription className="mt-2">
                    <ul className="list-disc pl-5">
                        {formattedChartData?.map((data, index) => (
                            <li key={index}>
                                <strong>{data.optionLabel}:</strong> {data.optionText}
                            </li>
                        ))}
                    </ul>
                </CardDescription>
            </CardHeader>
            <CardContent className={`${lightmode ? "bg-white text-black" : "bg-darkBg text-darkText"} -z-40`}>
                <ChartContainer config={chartConfig} >
                    <BarChart
                        data={formattedChartData}
                        layout="vertical"
                        margin={{ left: -20, }}
                        barCategoryGap="8px"
                        barGap={0}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="optionLabel" // A, B, C, D labels
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="users"
                            radius={5}
                            barSize={15}
                            // fill={({ dataIndex }) => formattedChartData[dataIndex].fill} // Dynamic fill color from chartConfig
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </div>
    );
}
