
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw, Filter } from 'lucide-react';
import { FilterOptions } from '../services/hrAnalytics';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  departments: string[];
  onRefresh: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  departments,
  onRefresh 
}) => {
  const handlePeriodChange = (period: 'month' | 'quarter' | 'year') => {
    onFiltersChange({ ...filters, period });
  };

  const handleDepartmentChange = (department: string) => {
    onFiltersChange({ 
      ...filters, 
      department: department === 'all' ? undefined : department 
    });
  };

  const handleComparisonChange = (compareWith: 'previous' | 'year-ago') => {
    onFiltersChange({ ...filters, compareWith });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filtres et Options</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Période */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Période</label>
            <Select value={filters.period} onValueChange={handlePeriodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mois en cours</SelectItem>
                <SelectItem value="quarter">Trimestre en cours</SelectItem>
                <SelectItem value="year">Année en cours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Département */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Département</label>
            <Select 
              value={filters.department || 'all'} 
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comparaison */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Comparer avec</label>
            <Select 
              value={filters.compareWith || 'previous'} 
              onValueChange={handleComparisonChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous">Période précédente</SelectItem>
                <SelectItem value="year-ago">Même période N-1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Actions</label>
            <Button 
              onClick={onRefresh}
              variant="outline" 
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Résumé des filtres actifs */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <Calendar className="h-4 w-4" />
            <span>
              Analyse {filters.period === 'month' ? 'mensuelle' : filters.period === 'quarter' ? 'trimestrielle' : 'annuelle'}
              {filters.department && ` • Département: ${filters.department}`}
              {filters.compareWith && ` • Comparaison: ${filters.compareWith === 'previous' ? 'période précédente' : 'année précédente'}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
