
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileJson } from 'lucide-react';
import { HRData } from '../services/hrAnalytics';
import { toast } from '@/hooks/use-toast';

interface DataExporterProps {
  hrData: HRData;
}

const DataExporter: React.FC<DataExporterProps> = ({ hrData }) => {
  const generateCompleteDataset = () => {
    const completeData = {
      metadata: {
        title: "Données RH Complètes",
        description: "Jeu de données complet avec 250 collaborateurs et leurs informations détaillées",
        generation_date: new Date().toISOString(),
        total_employees: hrData.employees.length,
        total_expenses: hrData.expenses.length,
        data_source: "hr_analytics_generator",
        version: "1.0"
      },
      structure: {
        departments: [
          "Ressources Humaines",
          "Développement", 
          "Marketing",
          "Ventes",
          "Finance",
          "Operations",
          "Support Client",
          "Direction"
        ],
        positions_by_department: {
          "Ressources Humaines": ["DRH", "Chargé RH", "Assistant RH", "Responsable Formation"],
          "Développement": ["Lead Developer", "Développeur Frontend", "Développeur Backend", "DevOps", "QA Engineer"],
          "Marketing": ["Directeur Marketing", "Chef de Produit", "Chargé Marketing", "Community Manager"],
          "Ventes": ["Directeur Commercial", "Responsable Ventes", "Commercial", "Account Manager"],
          "Finance": ["Directeur Financier", "Contrôleur de Gestion", "Comptable", "Analyste Financier"],
          "Operations": ["Directeur Operations", "Chef de Projet", "Coordinateur", "Analyste Process"],
          "Support Client": ["Responsable Support", "Technicien Support", "Customer Success"],
          "Direction": ["PDG", "Directeur Général", "Directeur Adjoint"]
        },
        status_options: ["active", "inactive", "terminated"],
        salary_range: { min: 30000, max: 120000 },
        performance_score_range: { min: 1, max: 5 },
        training_hours_range: { min: 0, max: 80 }
      },
      employees: hrData.employees.map(emp => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        fullName: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        department: emp.department,
        position: emp.position,
        salary: emp.salary,
        hireDate: emp.hireDate.toISOString(),
        hireDateFormatted: emp.hireDate.toLocaleDateString('fr-FR'),
        status: emp.status,
        performanceScore: emp.performanceScore,
        trainingHours: emp.trainingHours,
        remoteWork: emp.remoteWork,
        address: emp.address,
        // Données calculées supplémentaires
        seniority: {
          days: Math.floor((new Date().getTime() - emp.hireDate.getTime()) / (1000 * 3600 * 24)),
          years: Math.floor((new Date().getTime() - emp.hireDate.getTime()) / (1000 * 3600 * 24 * 365))
        },
        salaryCategory: emp.salary < 40000 ? 'junior' : emp.salary < 70000 ? 'intermediate' : 'senior',
        performanceCategory: emp.performanceScore >= 4 ? 'excellent' : emp.performanceScore >= 3 ? 'good' : 'needs_improvement'
      })),
      expenses: hrData.expenses.map(exp => ({
        id: exp.id,
        category: exp.category,
        amount: exp.amount,
        date: exp.date.toISOString(),
        dateFormatted: exp.date.toLocaleDateString('fr-FR'),
        description: exp.description,
        month: exp.date.getMonth() + 1,
        year: exp.date.getFullYear(),
        quarter: Math.ceil((exp.date.getMonth() + 1) / 3)
      })),
      analytics: {
        departmentStats: generateDepartmentStats(hrData.employees),
        salaryStats: generateSalaryStats(hrData.employees),
        performanceStats: generatePerformanceStats(hrData.employees),
        remoteWorkStats: generateRemoteWorkStats(hrData.employees),
        expenseStats: generateExpenseStats(hrData.expenses)
      }
    };

    return completeData;
  };

  const generateDepartmentStats = (employees: any[]) => {
    const stats: any = {};
    employees.forEach(emp => {
      if (!stats[emp.department]) {
        stats[emp.department] = {
          count: 0,
          totalSalary: 0,
          avgPerformance: 0,
          remoteWorkCount: 0
        };
      }
      stats[emp.department].count++;
      stats[emp.department].totalSalary += emp.salary;
      stats[emp.department].avgPerformance += emp.performanceScore;
      if (emp.remoteWork) stats[emp.department].remoteWorkCount++;
    });

    Object.keys(stats).forEach(dept => {
      stats[dept].avgSalary = Math.round(stats[dept].totalSalary / stats[dept].count);
      stats[dept].avgPerformance = Math.round((stats[dept].avgPerformance / stats[dept].count) * 100) / 100;
      stats[dept].remoteWorkPercentage = Math.round((stats[dept].remoteWorkCount / stats[dept].count) * 100);
    });

    return stats;
  };

  const generateSalaryStats = (employees: any[]) => {
    const salaries = employees.map(emp => emp.salary).sort((a, b) => a - b);
    return {
      min: Math.min(...salaries),
      max: Math.max(...salaries),
      average: Math.round(salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length),
      median: salaries[Math.floor(salaries.length / 2)],
      q1: salaries[Math.floor(salaries.length * 0.25)],
      q3: salaries[Math.floor(salaries.length * 0.75)]
    };
  };

  const generatePerformanceStats = (employees: any[]) => {
    const scores = employees.map(emp => emp.performanceScore);
    const distribution: any = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = scores.filter(score => score === i).length;
    }
    return {
      average: Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100,
      distribution
    };
  };

  const generateRemoteWorkStats = (employees: any[]) => {
    const remoteCount = employees.filter(emp => emp.remoteWork).length;
    return {
      remoteWorkers: remoteCount,
      officeWorkers: employees.length - remoteCount,
      remotePercentage: Math.round((remoteCount / employees.length) * 100)
    };
  };

  const generateExpenseStats = (expenses: any[]) => {
    const stats: any = {};
    expenses.forEach(exp => {
      if (!stats[exp.category]) {
        stats[exp.category] = { count: 0, total: 0 };
      }
      stats[exp.category].count++;
      stats[exp.category].total += exp.amount;
    });

    Object.keys(stats).forEach(cat => {
      stats[cat].average = Math.round(stats[cat].total / stats[cat].count);
    });

    return {
      byCategory: stats,
      totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      totalCount: expenses.length
    };
  };

  const downloadData = () => {
    try {
      const completeData = generateCompleteDataset();
      const dataStr = JSON.stringify(completeData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `donnees-rh-completes-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: `Fichier avec ${hrData.employees.length} collaborateurs téléchargé`
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de générer le fichier",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FileJson className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Export des données</h3>
            <p className="text-sm text-gray-500">
              Téléchargez l'ensemble des données RH en format JSON
            </p>
          </div>
        </div>
        <Button onClick={downloadData} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Télécharger JSON</span>
        </Button>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-lg text-blue-600">{hrData.employees.length}</div>
          <div className="text-gray-500">Collaborateurs</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg text-green-600">{hrData.expenses.length}</div>
          <div className="text-gray-500">Dépenses</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg text-purple-600">8</div>
          <div className="text-gray-500">Départements</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg text-orange-600">JSON</div>
          <div className="text-gray-500">Format</div>
        </div>
      </div>
    </div>
  );
};

export default DataExporter;
