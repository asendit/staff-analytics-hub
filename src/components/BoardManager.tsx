
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Copy, FileText, FileSpreadsheet, FileBarChart, Edit, Trash2, Save, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface Board {
  id: string;
  name: string;
  description: string;
  kpis: string[];
  kpiOrder: string[]; // Ordre des KPIs pour le drag & drop
  createdAt: string;
  isDefault: boolean;
}

interface BoardManagerProps {
  boards: Board[];
  currentBoard: Board;
  onBoardChange: (board: Board) => void;
  onBoardCreate: (board: Omit<Board, 'id' | 'createdAt'>) => void;
  onBoardUpdate: (board: Board) => void;
  onBoardDelete: (boardId: string) => void;
  availableKPIs: { id: string; name: string }[];
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

const BoardManager: React.FC<BoardManagerProps> = ({
  boards,
  currentBoard,
  onBoardChange,
  onBoardCreate,
  onBoardUpdate,
  onBoardDelete,
  availableKPIs,
  onExportCSV,
  onExportExcel,
  onExportPDF
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([]);

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du tableau de bord est requis",
        variant: "destructive"
      });
      return;
    }

    const newBoard = {
      name: newBoardName,
      description: newBoardDescription,
      kpis: selectedKPIs,
      kpiOrder: selectedKPIs, // L'ordre initial est le même que la liste des KPIs
      isDefault: false
    };

    onBoardCreate(newBoard);
    
    // Reset form
    setNewBoardName('');
    setNewBoardDescription('');
    setSelectedKPIs([]);
    setIsCreateDialogOpen(false);

    toast({
      title: "Succès",
      description: "Tableau de bord créé avec succès"
    });
  };

  const handleEditBoard = () => {
    const updatedBoard = {
      ...currentBoard,
      name: newBoardName,
      description: newBoardDescription,
      kpis: selectedKPIs
    };

    onBoardUpdate(updatedBoard);
    setIsEditDialogOpen(false);

    toast({
      title: "Succès",
      description: "Tableau de bord mis à jour"
    });
  };

  const handleDuplicateBoard = (board: Board) => {
    const duplicatedBoard = {
      name: `${board.name} (Copie)`,
      description: board.description,
      kpis: [...board.kpis],
      kpiOrder: [...(board.kpiOrder || board.kpis)], // Copier l'ordre ou utiliser l'ordre des KPIs
      isDefault: false
    };

    onBoardCreate(duplicatedBoard);

    toast({
      title: "Succès",
      description: "Tableau de bord dupliqué avec succès"
    });
  };


  const handleDeleteBoard = (boardId: string) => {
    if (boards.find(b => b.id === boardId)?.isDefault) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le tableau de bord par défaut",
        variant: "destructive"
      });
      return;
    }

    onBoardDelete(boardId);

    toast({
      title: "Succès",
      description: "Tableau de bord supprimé"
    });
  };

  const openEditDialog = (board: Board) => {
    setNewBoardName(board.name);
    setNewBoardDescription(board.description);
    setSelectedKPIs(board.kpis);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Gestion des Tableaux de Bord</span>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary hover:bg-primary-600 relative" 
                disabled
                title="Fonctionnalité disponible prochainement"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Board
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                  Soon
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer un nouveau tableau de bord</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Ex: Tableau RH Mensuel"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    placeholder="Description du tableau de bord"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">KPIs à inclure</label>
                  <Select onValueChange={(value) => {
                    if (!selectedKPIs.includes(value)) {
                      setSelectedKPIs([...selectedKPIs, value]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner des KPIs" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableKPIs.map(kpi => (
                        <SelectItem 
                          key={kpi.id} 
                          value={kpi.id}
                          disabled={selectedKPIs.includes(kpi.id)}
                        >
                          {kpi.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedKPIs.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedKPIs.map(kpiId => {
                        const kpi = availableKPIs.find(k => k.id === kpiId);
                        return (
                          <div key={kpiId} className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded text-sm">
                            <span>{kpi?.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedKPIs(selectedKPIs.filter(id => id !== kpiId))}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCreateBoard} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Créer
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sélection du board actuel */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tableau de bord actuel</label>
            <Select 
              value={currentBoard.id} 
              onValueChange={(boardId) => {
                const board = boards.find(b => b.id === boardId);
                if (board) onBoardChange(board);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {boards.map(board => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name} {board.isDefault && '(Défaut)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions sur le board actuel */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Actions</label>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => openEditDialog(currentBoard)}
                disabled={currentBoard.isDefault}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDuplicateBoard(currentBoard)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onExportCSV}
                title="Exporter en CSV"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onExportExcel}
                title="Exporter en Excel"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onExportPDF}
                title="Exporter en PDF"
              >
                <FileBarChart className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDeleteBoard(currentBoard.id)}
                disabled={currentBoard.isDefault}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Informations du board */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Informations</label>
            <div className="text-sm text-gray-600">
              <p>{currentBoard.description || 'Aucune description'}</p>
              <p className="text-xs mt-1">{currentBoard.kpis.length} KPIs • Créé le {new Date(currentBoard.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Dialog d'édition */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le tableau de bord</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom</label>
                <Input
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleEditBoard} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BoardManager;
