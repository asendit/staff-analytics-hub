import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, TrendingDown, Minus, Info, PieChart, Globe, GraduationCap, DollarSign } from 'lucide-react';
import { EDIData } from '../services/hrAnalytics';
import { PieChart as RechartPieChart, Cell, ResponsiveContainer, Tooltip, Legend, Pie } from 'recharts';

interface EDICardProps {
  data: EDIData;
  onInfoClick: () => void;
  onChartClick: () => void;
  showInsight?: boolean;
}

const EDICard: React.FC<EDICardProps> = ({ 
  data, 
  onInfoClick, 
  onChartClick, 
  showInsight = true 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/kpi-details/edi');
  };

  // Couleurs pour le graphique pie chart
  const COLORS = ['#5B5FC7', '#6264A7', '#7B68EE', '#9370DB', '#8A2BE2'];

  // Préparer les données pour le pie chart
  const pieData = data.educationBreakdown.map(edu => ({
    name: edu.level,
    value: edu.count,
    percentage: edu.percentage
  }));

  console.log('EDI Card - Education breakdown data:', data.educationBreakdown);
  console.log('EDI Card - Pie data:', pieData);

  return (
    <Card 
      className="teams-card border border-teams-purple/30 col-span-full lg:col-span-4 xl:col-span-4 cursor-pointer hover:border-teams-purple/50 transition-colors" 
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-5">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-1 h-6 bg-teams-purple rounded-full" />
          Équité, diversité et inclusion
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onChartClick}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            title="Voir les graphiques détaillés"
          >
            <PieChart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onInfoClick}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            title="Voir les détails"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Indicateurs EDI */}
          <div className="space-y-4">
            {/* Âge moyen et nationalités */}
            <div className="grid grid-cols-2 gap-4">
              <div className="teams-card p-4 border border-teams-purple/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-teams-purple" />
                  <span className="text-sm font-semibold text-foreground">Âge moyen</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-2xl font-semibold text-foreground">
                    {data.averageAge}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">années</div>
              </div>

              <div className="teams-card p-4 border border-teams-purple/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="h-4 w-4 text-teams-purple" />
                  <span className="text-sm font-semibold text-foreground">Nationalités</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-2xl font-semibold text-foreground">
                    {data.nationalitiesCount}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">pays représentés</div>
              </div>
            </div>

            {/* Ratios hommes/femmes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="teams-card p-4 border border-teams-purple/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-teams-purple" />
                  <span className="text-sm font-semibold text-foreground">Ratio hommes</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-xl font-semibold text-foreground">
                    {data.genderRatio.men.toFixed(1)}%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">de l'effectif</div>
              </div>

              <div className="teams-card p-4 border border-teams-purple/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-teams-purple" />
                  <span className="text-sm font-semibold text-foreground">Ratio femmes</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-xl font-semibold text-foreground">
                    {data.genderRatio.women.toFixed(1)}%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-medium">de l'effectif</div>
              </div>
            </div>

            {/* Écart salarial */}
            <div className="teams-card p-4 border border-teams-purple/20">
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="h-4 w-4 text-teams-purple" />
                <span className="text-sm font-semibold text-foreground">Écart salarial H/F</span>
              </div>
              <div className="flex items-baseline space-x-3">
                <div className={`text-xl font-semibold ${Math.abs(data.salarygap) < 5 ? 'text-success' : 'text-danger'}`}>
                  {data.salarygap > 0 ? '+' : ''}{data.salarygap}%
                </div>
                {Math.abs(data.salarygap) < 5 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger" />
                )}
              </div>
              <div className="text-sm text-muted-foreground font-medium">écart global</div>
            </div>
          </div>

          {/* Graphique formation */}
          <div className="teams-card p-4 border border-teams-purple/20">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-4 w-4 text-teams-purple" />
              <span className="text-sm font-semibold text-foreground">Répartition par formation</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} personnes`, 'Effectif']}
                    labelFormatter={(label) => `Niveau: ${label}`}
                  />
                  <Legend />
                </RechartPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insight IA */}
        {showInsight && data.insight && (
          <div className="mt-4 p-4 bg-teams-purple/5 rounded-lg border border-teams-purple/20">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-teams-purple/10 rounded-full">
                <Users className="h-3 w-3 text-teams-purple" />
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

export default EDICard;