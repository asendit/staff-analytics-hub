
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { KPIData } from '../services/hrAnalytics';

interface KPIDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPIData | null;
}

const KPIDetailModal: React.FC<KPIDetailModalProps> = ({ isOpen, onClose, kpi }) => {
  if (!kpi) return null;

  // Génération de données pour les graphiques
  const generateTimeSeriesData = () => {
    const baseValue = typeof kpi.value === 'number' ? kpi.value : 50;
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][i],
      value: baseValue + (Math.random() - 0.5) * baseValue * 0.4,
      trend: baseValue * (1 + (Math.random() - 0.5) * 0.3)
    }));
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
    
    // Données génériques pour les autres KPIs
    return [
      { name: 'Catégorie A', value: 40, color: '#8884d8' },
      { name: 'Catégorie B', value: 30, color: '#82ca9d' },
      { name: 'Catégorie C', value: 20, color: '#ffc658' },
      { name: 'Catégorie D', value: 10, color: '#ff7300' }
    ];
  };

  const timeSeriesData = generateTimeSeriesData();
  const categoryData = generateCategoryData();

  const renderExpensesDetail = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Répartition des dépenses RH par catégorie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Graphique en secteurs */}
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
          
          {/* Liste détaillée */}
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
      {/* Évolution temporelle */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Évolution sur 12 mois</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparaison avec la tendance */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Comparaison avec la tendance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSeriesData}>
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
          {/* Insight détaillé */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{kpi.insight}</p>
          </div>

          {/* Contenu spécifique selon le KPI */}
          {kpi.id === 'hr-expenses' ? renderExpensesDetail() : renderGeneralDetail()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KPIDetailModal;
