
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Copy, Share, Edit, Trash2, Save, BarChart3, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface Board {
  id: string;
  name: string;
  description: string;
  kpis: string[];
  createdAt: string;
  isDefault: boolean;
}

interface BoardManagerProps {
  showInsights: boolean;
  onToggleInsights: (show: boolean) => void;
}

const BoardManager: React.FC<BoardManagerProps> = ({
  showInsights,
  onToggleInsights
}) => {
  // For now, we'll use mock data until full board management is implemented
  const mockBoards: Board[] = [
    {
      id: 'default',
      name: 'Tableau de bord par défaut',
      description: 'Vue d\'ensemble des indicateurs RH principaux',
      kpis: ['headcount', 'absenteeism', 'turnover', 'overtime-hours'],
      createdAt: new Date().toISOString(),
      isDefault: true
    }
  ];

  const mockCurrentBoard = mockBoards[0];
  const mockAvailableKPIs = [
    { id: 'headcount', name: 'Effectifs' },
    { id: 'absenteeism', name: 'Absentéisme' },
    { id: 'turnover', name: 'Turnover' },
    { id: 'overtime-hours', name: 'Heures supplémentaires' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Gestion des Tableaux de Bord</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onToggleInsights(!showInsights)}
              variant={showInsights ? "default" : "outline"}
              size="sm"
            >
              {showInsights ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              {showInsights ? 'Masquer insights' : 'Afficher insights'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sélection du board actuel */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tableau de bord actuel</label>
            <Select value={mockCurrentBoard.id} disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={mockCurrentBoard.id}>
                  {mockCurrentBoard.name} (Défaut)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions sur le board actuel */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Actions</label>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" disabled>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" disabled>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" disabled>
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Informations du board */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Informations</label>
            <div className="text-sm text-gray-600">
              <p>{mockCurrentBoard.description}</p>
              <p className="text-xs mt-1">{mockCurrentBoard.kpis.length} KPIs • Créé le {new Date(mockCurrentBoard.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoardManager;
