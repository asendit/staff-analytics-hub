
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { KPIData, FilterOptions } from '../services/hrAnalytics';

interface KPIDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPIData | null;
  filters: FilterOptions;
}

const KPIDetailModal: React.FC<KPIDetailModalProps> = ({ isOpen, onClose, kpi, filters }) => {
  if (!kpi) return null;

  // Génération de données mensuelles selon la période
  const generateMonthlyData = () => {
    const baseValue = typeof kpi.value === 'number' ? kpi.value : 50;
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // Si la période couvre plusieurs mois, on génère des données mensuelles
    const isMultiMonth = ['quarter', 'year', 'custom'].includes(filters.period);
    
    if (isMultiMonth) {
      return months.map((month, i) => ({
        month,
        value: Math.max(0, baseValue + (Math.random() - 0.5) * baseValue * 0.6),
        trend: baseValue * (1 + (Math.random() - 0.5) * 0.3),
        target: baseValue * 1.1
      }));
    } else {
      // Pour les périodes courtes, on génère des données journalières/hebdomadaires
      const periods = filters.period === 'week' ? 
        ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] :
        Array.from({ length: 30 }, (_, i) => `${i + 1}`);
        
      return periods.map((period, i) => ({
        month: period,
        value: Math.max(0, baseValue + (Math.random() - 0.5) * baseValue * 0.4),
        trend: baseValue * (1 + (Math.random() - 0.5) * 0.2),
        target: baseValue * 1.05
      }));
    }
  };

  const generateCategoryData = () => {
    if (kpi.id === 'hr-expenses') {
      return [
        { name: 'Repas', value: 45000, color: '#8884d8' },
        { name: 'Transport', value: 32000, color: '#82ca9d' },
        { name: 'Formation', value: 28000, color: '#ffc658' },
        { name: 'Matériel', value: 15000, color: '#ff7300' }
      ];
    }
    
    return [
      { name: 'Catégorie A', value: 40, color: '#8884d8' },
      { name: 'Catégorie B', value: 30, color: '#82ca9d' },
      { name: 'Catégorie C', value: 20, color: '#ffc658' },
      { name: 'Catégorie D', value: 10, color: '#ff7300' }
    ];
  };

  const monthlyData = generateMonthlyData();
  const categoryData = generateCategoryData();
  const isMultiMonth = ['quarter', 'year', 'custom'].includes(filters.period);

  const renderExpensesDetail = () => (
    <div className="space-y-6">
      {/* Évolution mensuelle si période multi-mois */}
      {isMultiMonth && (
        <div>
          <h3 className="text-lg font-semibold mb-4">📊 Évolution mensuelle des dépenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Math.round(Number(value)).toLocaleString()}€`, 'Montant']} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Dépenses réelles"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Objectif"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">💰 Répartition des dépenses RH par catégorie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}€`, 'Montant']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-lg font-bold">{category.value.toLocaleString()}€</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralDetail = () => (
    <div className="space-y-6">
      {/* Évolution mensuelle si période multi-mois */}
      {isMultiMonth && (
        <div>
          <h3 className="text-lg font-semibold mb-4">📈 Évolution mensuelle - {kpi.name}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name={kpi.name}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Objectif"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Évolution sur la période sélectionnée */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          📊 Évolution sur {filters.period === 'week' ? 'la semaine' : 
                          filters.period === 'month' ? 'le mois' :
                          filters.period === 'quarter' ? 'le trimestre' : 'la période'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" name="Réel" />
              <Bar dataKey="trend" fill="#82ca9d" name="Tendance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{kpi.name}</span>
            <span className="text-2xl font-bold text-primary">
              {kpi.value}{kpi.unit}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          {/* Insight détaillé avec emoji */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              {kpi.category === 'positive' ? '✅' : kpi.category === 'negative' ? '⚠️' : 'ℹ️'} {kpi.insight}
            </p>
          </div>

          {/* Contenu spécifique selon le KPI */}
          {kpi.id === 'hr-expenses' ? renderExpensesDetail() : renderGeneralDetail()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KPIDetailModal;
