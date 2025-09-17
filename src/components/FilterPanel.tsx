
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, RefreshCw, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { FilterOptions } from '../services/hrAnalytics';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  departments: string[];
  agencies: string[];
  onRefresh: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  departments,
  agencies,
  onRefresh 
}) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handlePeriodChange = (period: 'week' | 'month' | 'quarter' | 'year' | 'custom') => {
    if (period === 'custom') {
      onFiltersChange({ 
        ...filters, 
        period,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined
      });
    } else {
      onFiltersChange({ ...filters, period, startDate: undefined, endDate: undefined });
    }
  };

  const handleDepartmentChange = (department: string) => {
    onFiltersChange({ 
      ...filters, 
      department: department === 'all' ? undefined : department 
    });
  };

  const handleAgencyChange = (agency: string) => {
    onFiltersChange({ 
      ...filters, 
      agency: agency === 'all' ? undefined : agency 
    });
  };

  const handleCompareWithChange = (compareWith: string) => {
    onFiltersChange({ 
      ...filters, 
      compareWith: compareWith === 'none' ? undefined : compareWith as 'previous' | 'year-ago' 
    });
  };

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date);
      if (date) {
        onFiltersChange({ 
          ...filters, 
          startDate: format(date, 'yyyy-MM-dd'),
          period: 'custom'
        });
      }
    } else {
      setEndDate(date);
      if (date) {
        onFiltersChange({ 
          ...filters, 
          endDate: format(date, 'yyyy-MM-dd'),
          period: 'custom'
        });
      }
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Période */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Période</label>
            <div className="flex gap-2">
              <Select value={filters.period} onValueChange={handlePeriodChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semaine en cours</SelectItem>
                  <SelectItem value="month">Mois en cours</SelectItem>
                  <SelectItem value="quarter">Trimestre en cours</SelectItem>
                  <SelectItem value="year">Année en cours</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filters.period === 'custom' && (
              <div className="flex gap-2 mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: fr }) : "Date début"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => handleDateChange('start', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: fr }) : "Date fin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => handleDateChange('end', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Agence */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Agence</label>
            <Select 
              value={filters.agency || 'all'} 
              onValueChange={handleAgencyChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les agences</SelectItem>
                {agencies.map(agency => (
                  <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                ))}
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

          {/* Période de comparaison */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Comparaison</label>
            <Select 
              value={filters.compareWith || 'none'} 
              onValueChange={handleCompareWithChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                <SelectItem value="previous">vs période précédente</SelectItem>
                <SelectItem value="year-ago">vs année précédente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 opacity-0">Actions</label>
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
        <div className="mt-4 p-2 bg-gray-50 rounded border text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>
              {filters.period === 'custom' ? 
                `${startDate ? format(startDate, "dd/MM/yyyy") : '...'} - ${endDate ? format(endDate, "dd/MM/yyyy") : '...'}` :
                filters.period === 'week' ? 'Semaine en cours' :
                filters.period === 'month' ? 'Mois en cours' : 
                filters.period === 'quarter' ? 'Trimestre en cours' : 'Année en cours'
              }
              {filters.agency && ` • ${filters.agency}`}
              {filters.department && ` • ${filters.department}`}
              {filters.compareWith && ` • ${filters.compareWith === 'previous' ? 'vs période précédente' : 'vs année précédente'}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
