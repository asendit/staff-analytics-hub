import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, Building2, Info, BarChart3 } from 'lucide-react';
import { SalaryData } from '../services/hrAnalytics';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface SalaryCardProps {
  data: SalaryData;
  onInfoClick: () => void;
  onChartClick: () => void;
  showInsight?: boolean;
}

const SalaryCard: React.FC<SalaryCardProps> = ({ 
  data, 
  onInfoClick, 
  onChartClick, 
  showInsight = true 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/kpi-details/salary');
  };

  // Couleurs pour le graphique
  const COLORS = ['#10B981', '#059669', '#047857', '#065F46', '#064E3B'];

  // Préparer les données pour le graphique en barres
  const chartData = data.departmentSalaryBreakdown.slice(0, 5).map(dept => ({
    department: dept.department.length > 10 ? dept.department.substring(0, 10) + '...' : dept.department,
    totalSalary: Math.round(dept.totalSalary / 1000), // En milliers d'euros
    averageSalary: Math.round(dept.averageSalary / 1000), // En milliers d'euros
    employeeCount: dept.employeeCount
  }));

  return (
    <Card 
      className="teams-card border border-teams-green/30 col-span-full lg:col-span-4 xl:col-span-4 cursor-pointer hover:border-teams-green/50 transition-colors" 
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-5">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-1 h-6 bg-teams-green rounded-full" />
          Masse salariale
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onChartClick}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-teams-green hover:bg-teams-green/10"
            title="Voir les graphiques détaillés"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onInfoClick}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-teams-green hover:bg-teams-green/10"
            title="Voir les détails"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Indicateurs de masse salariale */}
          <div className="space-y-4">
            {/* Masse salariale totale et par ETP */}
            <div className="grid grid-cols-1 gap-4">
              <div className="teams-card p-4 border border-teams-green/20">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign className="h-4 w-4 text-teams-green" />
                  <span className="text-sm font-semibold text-foreground">Masse salariale totale</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-2xl font-semibold text-foreground">
                    {(data.totalSalaryMass / 1000).toFixed(0)}k€
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">annuelle brute</div>
              </div>

              <div className="teams-card p-4 border border-teams-green/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-teams-green" />
                  <span className="text-sm font-semibold text-foreground">Masse salariale par ETP</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-2xl font-semibold text-foreground">
                    {(data.salaryMassPerETP / 1000).toFixed(0)}k€
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">par équivalent temps plein</div>
              </div>
            </div>
          </div>

          {/* Graphique par département */}
          <div className="teams-card p-4 border border-teams-green/20">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-4 w-4 text-teams-green" />
              <span className="text-sm font-semibold text-foreground">Masse salariale par département</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="department" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    label={{ value: 'k€', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'totalSalary') return [`${value}k€`, 'Masse salariale'];
                      return [`${value}k€`, 'Salaire moyen'];
                    }}
                    labelFormatter={(label) => `Département: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="totalSalary" 
                    fill="#10B981" 
                    name="Masse salariale"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insight IA */}
        {showInsight && data.insight && (
          <div className="mt-4 p-4 bg-teams-green/5 rounded-lg border border-teams-green/20">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-teams-green/10 rounded-full">
                <BarChart3 className="h-3 w-3 text-teams-green" />
              </div>
              <p className="text-sm text-foreground leading-relaxed font-medium">
                {data.insight}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryCard;