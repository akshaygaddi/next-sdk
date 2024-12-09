import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { VoteStats } from '@/app/actions/polls';

interface PollVisualizationProps {
  data: VoteStats[];
  options: string[];
  className?: string;
}

const PollVisualization = ({ data, options, className = '' }: PollVisualizationProps) => {
  const chartData = data.map((stat, index) => ({
    name: options[index],
    votes: stat.votes,
    percentage: stat.percentage,
    participationRate: stat.participationRate,
  }));

  return (
    <Card className={`p-4 ${className}`}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis yAxisId="left" label={{ value: 'Votes', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Percentage', angle: 90, position: 'insideRight' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 rounded-lg border shadow-md">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        Votes: {payload[0].value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Of Total Votes: {payload[1].value.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Of Participants: {payload[2].value.toFixed(1)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="votes" fill="#f97316" name="Votes" />
            <Bar yAxisId="right" dataKey="percentage" fill="#84cc16" name="% of Total Votes" />
            <Bar yAxisId="right" dataKey="participationRate" fill="#06b6d4" name="% of Participants" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PollVisualization;