
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { KPIData, KPIChartData } from '../services/hrAnalytics';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

interface KPIChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPIData | null;
  chartData: KPIChartData | null;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const KPIChartModal: React.FC<KPIChartModalProps> = ({ isOpen, onClose, kpi, chartData }) => {
  if (!kpi || !chartData) return null;

  const chartConfig = {
    value: {
      label: kpi.unit,
      color: "#3b82f6",
    },
  };

  // Vérifier si on a des données démographiques pour le KPI effectif
  const hasAgeData = kpi.id === 'headcount' && chartData.ageDistribution;
  const hasGenderData = kpi.id === 'headcount' && chartData.genderDistribution;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Graphiques - {kpi.name}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="evolution" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="evolution" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Évolution</span>
            </TabsTrigger>
            <TabsTrigger value="department" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Par département</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center space-x-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Répartition</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evolution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <LineChart data={chartData.timeEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="department" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison par département</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <BarChart data={chartData.departmentBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{chartData.specificBreakdown.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <PieChart>
                    <Pie
                      data={chartData.specificBreakdown.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.specificBreakdown.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Graphiques spécifiques à l'effectif */}
            {hasAgeData && (
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par tranche d'âge</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <BarChart data={chartData.ageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {hasGenderData && (
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par genre</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <PieChart>
                      <Pie
                        data={chartData.genderDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ gender, percent }) => `${gender} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.genderDistribution?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#ef4444'} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default KPIChartModal;
