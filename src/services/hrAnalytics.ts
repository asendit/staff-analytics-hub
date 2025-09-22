import { faker } from '@faker-js/faker';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  agency: string;
  position: string;
  salary: number;
  hireDate: Date;
  terminationDate?: Date;
  status: 'active' | 'inactive' | 'terminated';
  performanceScore: number;
  trainingHours: number;
  remoteWork: boolean;
  address: string;
  workingTimeRate: number; // Taux d'activité pour calculer l'ETP (0.5 = 50%, 1.0 = 100%)
  gender?: 'homme' | 'femme';
  birthDate?: Date;
  nationality?: string;
  educationLevel?: 'Doctorat' | 'Université Master' | 'Université Bachelor' | 'Haute école spécialisée Master' | 'Haute école spécialisée Bachelor' | 'Formation professionnelle supérieure Master' | 'Formation professionnelle supérieure Bachelor' | 'Formation professionnelle supérieure' | 'Brevet d\'enseignement' | 'Maturité' | 'Apprentissage complet' | 'Formation exclusivement interne' | 'Scolarité obligatoire';
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: Date;
  description: string;
}

export interface HRData {
  employees: Employee[];
  expenses: Expense[];
}

export interface KPIData {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  trend: number | null;
  comparison: 'higher' | 'lower' | 'stable';
  category: 'positive' | 'negative' | 'neutral';
  insight: string;
}

export interface ExtendedHeadcountData {
  totalHeadcount: number;
  totalETP: number;
  newHires: number;
  departures: number;
  trend: number | null;
  departmentBreakdown: Array<{ department: string; count: number; etp: number }>;
  comparison: 'higher' | 'lower' | 'stable';
  category: 'positive' | 'negative' | 'neutral';
  insight: string;
}

export interface EDIData {
  averageAge: number;
  genderRatio: { men: number; women: number };
  salarygap: number;
  nationalitiesCount: number;
  educationBreakdown: Array<{ level: string; count: number; percentage: number }>;
  insight: string;
}

export interface SalaryData {
  totalSalaryMass: number;
  salaryMassPerETP: number;
  salaryMassToRevenueRatio: number;
  departmentSalaryBreakdown: Array<{ department: string; totalSalary: number; averageSalary: number; employeeCount: number }>;
  insight: string;
}

export interface KPIChartData {
  timeEvolution: Array<{ month: string; value: number }>;
  departmentBreakdown: Array<{ department: string; value: number }>;
  specificBreakdown: {
    title: string;
    data: Array<{ name: string; value: number }>;
  };
  ageDistribution?: Array<{ ageGroup: string; value: number }>;
  genderDistribution?: Array<{ gender: string; value: number }>;
}

export interface FilterOptions {
  period: 'month' | 'quarter' | 'year' | 'custom';
  department?: string;
  agency?: string;
  remoteWork?: boolean;
  startDate?: string;
  endDate?: string;
  compareWith?: 'previous' | 'year-ago';
}

export class HRAnalytics {
  constructor(public data: HRData) {}

  getAbsenteeismRate(filters: FilterOptions): KPIData {
    const totalDays = this.getTotalDays(filters.period);
    const employees = this.filterEmployees(filters);
    const absentDays = employees.reduce((sum, employee) => sum + faker.number.int({ min: 0, max: 2 }), 0);
    const absenteeismRate = (absentDays / (employees.length * totalDays)) * 100;

    const trend = this.calculateTrend(filters);

    return {
      id: 'absenteeism',
      name: 'Taux d\'absentéisme',
      value: absenteeismRate.toFixed(1),
      unit: '%',
      trend,
      comparison: this.getTrendComparison(trend),
      category: absenteeismRate > 5 ? 'negative' : 'positive',
      insight: `Le taux d'absentéisme est de ${absenteeismRate.toFixed(1)}%. ${absenteeismRate > 5 ? '⚠️ Il est supérieur à la moyenne et nécessite une attention particulière.' : '✅ Il est dans la moyenne acceptable.'}`
    };
  }

  getAbsenteeismChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 2, max: 8, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 1, max: 10, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Répartition par type d\'absence',
        data: [
          { name: 'Maladie', value: faker.number.int({ min: 40, max: 60 }) },
          { name: 'Congés payés', value: faker.number.int({ min: 20, max: 30 }) },
          { name: 'Formation', value: faker.number.int({ min: 5, max: 15 }) },
          { name: 'Personnel', value: faker.number.int({ min: 5, max: 15 }) },
          { name: 'Autre', value: faker.number.int({ min: 2, max: 8 }) }
        ]
      }
    };
  }

  getTurnoverRate(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const terminatedEmployees = employees.filter(employee => employee.status === 'terminated').length;
    const turnoverRate = (terminatedEmployees / employees.length) * 100;

    const trend = this.calculateTrend(filters);

    return {
      id: 'turnover',
      name: 'Turnover',
      value: turnoverRate.toFixed(1),
      unit: '%',
      trend,
      comparison: this.getTrendComparison(trend),
      category: turnoverRate > 10 ? 'negative' : 'positive',
      insight: `Le taux de turnover est de ${turnoverRate.toFixed(1)}%. ${turnoverRate > 10 ? '🚨 Il est élevé et pourrait indiquer des problèmes de rétention.' : '📈 Il reste dans une fourchette acceptable.'}`
    };
  }

  getTurnoverChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 5, max: 15, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 3, max: 18, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Turnover par type de contrat',
        data: [
          { name: 'CDI', value: faker.number.int({ min: 30, max: 50 }) },
          { name: 'CDD', value: faker.number.int({ min: 25, max: 35 }) },
          { name: 'Stage', value: faker.number.int({ min: 10, max: 20 }) },
          { name: 'Freelance', value: faker.number.int({ min: 5, max: 15 }) }
        ]
      }
    };
  }

  getExtendedHeadcount(filters: FilterOptions): ExtendedHeadcountData {
    const employees = this.filterEmployees(filters);
    const periodStart = this.getPeriodStartDate(filters.period);
    const periodEnd = new Date();
    
    // Calculer l'effectif total à la date de fin de période
    const activeEmployees = employees.filter(employee => {
      const hireDate = new Date(employee.hireDate);
      const terminationDate = employee.terminationDate ? new Date(employee.terminationDate) : null;
      
      return employee.status === 'active' && 
             hireDate <= periodEnd && 
             (!terminationDate || terminationDate > periodEnd);
    });
    
    const totalHeadcount = activeEmployees.length;
    
    // Calculer l'ETP (Equivalent Temps Plein)
    const totalETP = activeEmployees.reduce((sum, employee) => {
      return sum + (employee.workingTimeRate || 1.0);
    }, 0);
    
    // Calculer les nouvelles arrivées sur la période
    const newHires = employees.filter(employee => {
      const hireDate = new Date(employee.hireDate);
      return hireDate >= periodStart && hireDate <= periodEnd;
    }).length;
    
    // Calculer les départs sur la période
    const departures = employees.filter(employee => {
      const terminationDate = employee.terminationDate ? new Date(employee.terminationDate) : null;
      return terminationDate && terminationDate >= periodStart && terminationDate <= periodEnd;
    }).length;
    
    // Répartition par département (top 5)
    const departmentCounts = new Map<string, { count: number; etp: number }>();
    activeEmployees.forEach(employee => {
      const current = departmentCounts.get(employee.department) || { count: 0, etp: 0 };
      departmentCounts.set(employee.department, {
        count: current.count + 1,
        etp: current.etp + (employee.workingTimeRate || 1.0)
      });
    });
    
    const departmentBreakdown = Array.from(departmentCounts.entries())
      .map(([department, data]) => ({ department, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const trend = this.calculateTrend(filters);
    
    return {
      totalHeadcount,
      totalETP: Math.round(totalETP * 10) / 10,
      newHires,
      departures,
      trend,
      departmentBreakdown,
      comparison: this.getTrendComparison(trend),
      category: totalHeadcount < 100 ? 'negative' : 'positive',
      insight: `Effectif de ${totalHeadcount} collaborateurs (${totalETP.toFixed(1)} ETP). ${newHires} arrivée${newHires > 1 ? 's' : ''} et ${departures} départ${departures > 1 ? 's' : ''} sur la période. ${trend && trend > 0 ? '📈 Croissance de l\'effectif' : trend && trend < 0 ? '📉 Réduction de l\'effectif' : '📊 Effectif stable'}.`
    };
  }

  getHeadcount(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const activeEmployees = employees.filter(employee => employee.status === 'active').length;

    const trend = this.calculateTrend(filters);

    return {
      id: 'headcount',
      name: 'Effectif actif',
      value: activeEmployees,
      unit: 'collaborateurs',
      trend,
      comparison: this.getTrendComparison(trend),
      category: activeEmployees < 100 ? 'negative' : 'positive',
      insight: `L'effectif actif est de ${activeEmployees} collaborateurs. ${activeEmployees < 100 ? '⚠️ L\'effectif est réduit.' : '👥 L\'équipe maintient une taille stable.'}`
    };
  }

  getHeadcountChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    const employees = this.filterEmployees(filters);
    
    // Distribution par âge
    const ageGroups = {
      '20-30 ans': 0,
      '30-40 ans': 0,
      '40-50 ans': 0,
      '50+ ans': 0
    };

    // Distribution par genre
    const genderDistribution = {
      'homme': 0,
      'femme': 0
    };

    employees.forEach(employee => {
      // Calcul de l'âge
      const birthDate = employee.birthDate || new Date(faker.date.birthdate({ min: 25, max: 60, mode: 'age' }));
      const age = new Date().getFullYear() - birthDate.getFullYear();
      
      if (age < 30) ageGroups['20-30 ans']++;
      else if (age < 40) ageGroups['30-40 ans']++;
      else if (age < 50) ageGroups['40-50 ans']++;
      else ageGroups['50+ ans']++;

      // Distribution par genre
      const gender = employee.gender || (Math.random() > 0.5 ? 'homme' : 'femme');
      genderDistribution[gender]++;
    });
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.int({ min: 180, max: 250 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.int({ min: 15, max: 60 })
      })),
      specificBreakdown: {
        title: 'Répartition par statut',
        data: [
          { name: 'Actifs', value: faker.number.int({ min: 200, max: 230 }) },
          { name: 'En congé', value: faker.number.int({ min: 10, max: 20 }) },
          { name: 'Inactifs', value: faker.number.int({ min: 5, max: 15 }) }
        ]
      },
      ageDistribution: Object.entries(ageGroups).map(([ageGroup, value]) => ({
        ageGroup,
        value
      })),
      genderDistribution: Object.entries(genderDistribution).map(([gender, value]) => ({
        gender,
        value
      }))
    };
  }



  getRemoteWorkAdoption(filters: FilterOptions): KPIData {
    // Pourcentage fixe de télétravail sur la période
    const remoteWorkPercentage = 18.5; // Entre 15-20%

    const trend = this.calculateTrend(filters);

    return {
      id: 'remote-work',
      name: 'Télétravail',
      value: remoteWorkPercentage.toFixed(1),
      unit: '%',
      trend,
      comparison: this.getTrendComparison(trend),
      category: remoteWorkPercentage < 20 ? 'negative' : 'positive',
      insight: `Le pourcentage de télétravail sur la période est de ${remoteWorkPercentage.toFixed(1)}%. ${remoteWorkPercentage < 20 ? 'Il est inférieur à la moyenne.' : 'Il est dans la moyenne.'}`
    };
  }

  getRemoteWorkChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 30, max: 70, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 20, max: 80, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Modalités de travail',
        data: [
          { name: 'Télétravail complet', value: faker.number.int({ min: 20, max: 30 }) },
          { name: 'Hybride', value: faker.number.int({ min: 35, max: 45 }) },
          { name: 'Présentiel', value: faker.number.int({ min: 25, max: 35 }) }
        ]
      }
    };
  }

  getOnboardingDuration(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const periodStart = this.getPeriodStartDate(filters.period);
    const periodEnd = new Date();
    
    // Compter les employés embauchés durant la période sélectionnée
    const newHires = employees.filter(employee => {
      const hireDate = new Date(employee.hireDate);
      return hireDate >= periodStart && hireDate <= periodEnd;
    }).length;

    const trend = this.calculateTrend(filters);

    return {
      id: 'onboarding',
      name: 'Nouvelles arrivées',
      value: newHires,
      unit: 'personnes',
      trend,
      comparison: this.getTrendComparison(trend),
      category: newHires > 0 ? 'positive' : 'neutral',
      insight: `${newHires} nouvelle${newHires > 1 ? 's' : ''} arrivée${newHires > 1 ? 's' : ''} sur la période. ${newHires > 5 ? '📈 Croissance soutenue de l\'équipe.' : newHires > 0 ? '👥 Recrutement modéré.' : '⚡ Aucune nouvelle embauche sur cette période.'}`
    };
  }

  getOnboardingChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.int({ min: 15, max: 45 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.int({ min: 10, max: 50 })
      })),
      specificBreakdown: {
        title: 'Phases d\'onboarding',
        data: [
          { name: 'Documentation', value: faker.number.int({ min: 3, max: 7 }) },
          { name: 'Formation métier', value: faker.number.int({ min: 8, max: 15 }) },
          { name: 'Intégration équipe', value: faker.number.int({ min: 5, max: 10 }) },
          { name: 'Autonomie', value: faker.number.int({ min: 10, max: 20 }) }
        ]
      }
    };
  }

  getHRExpenses(filters: FilterOptions): KPIData {
    const totalExpenses = 45603; // Montant fixe en CHF
    
    const trend = this.calculateTrend(filters);
    
    return {
      id: 'hr-expenses',
      name: 'Notes de frais',
      value: totalExpenses,
      unit: 'CHF',
      trend,
      comparison: this.getTrendComparison(trend),
      category: trend && trend > 15 ? 'negative' : trend && trend > 5 ? 'neutral' : 'positive',
      insight: `💰 Montant total des notes de frais : ${totalExpenses.toLocaleString()}CHF sur la période. ${
        trend && trend > 0 
          ? `📈 Augmentation de ${Math.round(trend)}% par rapport à la période de comparaison, principalement due aux frais de transport et repas.`
          : trend && trend < 0
          ? `📉 Réduction de ${Math.abs(Math.round(trend))}% des notes de frais par rapport à la période de comparaison.`
          : '📊 Notes de frais stables par rapport à la période de comparaison.'
      }`
    };
  }

  getHRExpensesChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.int({ min: 15000, max: 35000 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.int({ min: 5000, max: 25000 })
      })),
      specificBreakdown: {
        title: 'Répartition par type de dépense',
        data: [
          { name: 'Recrutement', value: faker.number.int({ min: 15000, max: 25000 }) },
          { name: 'Formation', value: faker.number.int({ min: 10000, max: 20000 }) },
          { name: 'Équipements', value: faker.number.int({ min: 8000, max: 15000 }) },
          { name: 'Événements', value: faker.number.int({ min: 3000, max: 8000 }) },
          { name: 'Logiciels RH', value: faker.number.int({ min: 2000, max: 6000 }) }
        ]
      }
    };
  }

  // Ancienneté moyenne des collaborateurs
  getAverageSeniority(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const averageSeniority = employees.reduce((sum, employee) => {
      const hireDate = new Date(employee.hireDate);
      const now = new Date();
      const diff = now.getTime() - hireDate.getTime();
      return sum + (diff / (1000 * 3600 * 24 * 365.25));
    }, 0) / employees.length;

    const trend = this.calculateTrend(filters);

    return {
      id: 'average-seniority',
      name: 'Ancienneté moyenne',
      value: averageSeniority.toFixed(1),
      unit: 'ans',
      trend,
      comparison: this.getTrendComparison(trend),
      category: averageSeniority > 3 ? 'positive' : 'neutral',
      insight: `L'ancienneté moyenne est de ${averageSeniority.toFixed(1)} ans. ${averageSeniority > 3 ? '✅ Une bonne rétention des talents.' : 'ℹ️ Ancienneté modérée, équilibre entre expérience et renouvellement.'}`
    };
  }

  // Taux de collaborateurs ayant plus de 5 ans d'ancienneté  
  getSeniorityRetentionRate(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const now = new Date();
    const seniorEmployees = employees.filter(employee => {
      const hireDate = new Date(employee.hireDate);
      const diff = now.getTime() - hireDate.getTime();
      const years = diff / (1000 * 3600 * 24 * 365.25);
      return years >= 5;
    }).length;

    const retentionRate = (seniorEmployees / employees.length) * 100;
    const trend = this.calculateTrend(filters);

    return {
      id: 'seniority-retention',
      name: 'Collaborateurs +5 ans',
      value: retentionRate.toFixed(1),
      unit: '%',
      trend,
      comparison: this.getTrendComparison(trend),
      category: retentionRate > 30 ? 'positive' : 'neutral',
      insight: `${retentionRate.toFixed(1)}% des collaborateurs ont plus de 5 ans d'ancienneté (${seniorEmployees} personnes). ${retentionRate > 30 ? '🎯 Excellente rétention des talents expérimentés.' : '📊 Taux de rétention modéré, opportunité d\'améliorer la fidélisation.'}`
    };
  }

  // Données combinées pour la carte double
  getSeniorityAndRetention(filters: FilterOptions) {
    return {
      averageSeniority: this.getAverageSeniority(filters),
      retentionRate: this.getSeniorityRetentionRate(filters)
    };
  }

  // Garde l'ancienne méthode pour compatibilité mais mise à jour
  getAgeAndSeniority(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const averageAge = employees.reduce((sum, employee) => {
      const birthDate = new Date(faker.date.birthdate());
      const now = new Date();
      const diff = now.getTime() - birthDate.getTime();
      return sum + (diff / (1000 * 3600 * 24 * 365.25));
    }, 0) / employees.length;

    const averageSeniority = employees.reduce((sum, employee) => {
      const hireDate = new Date(employee.hireDate);
      const now = new Date();
      const diff = now.getTime() - hireDate.getTime();
      return sum + (diff / (1000 * 3600 * 24 * 365.25));
    }, 0) / employees.length;

    const trend = this.calculateTrend(filters);

    return {
      id: 'age-seniority',
      name: 'Âge et ancienneté',
      value: `${averageAge.toFixed(0)} ans / ${averageSeniority.toFixed(0)} ans`,
      unit: '',
      trend,
      comparison: this.getTrendComparison(trend),
      category: averageAge > 40 ? 'negative' : 'positive',
      insight: `L'âge moyen est de ${averageAge.toFixed(0)} ans et l'ancienneté moyenne est de ${averageSeniority.toFixed(0)} ans. ${averageAge > 40 ? 'L\'âge moyen est supérieur à la moyenne.' : 'L\'âge moyen est dans la moyenne.'}`
    };
  }

  getAverageSeniorityChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 2.5, max: 6.8, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 1.8, max: 8.2, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Répartition par ancienneté',
        data: [
          { name: '0-2 ans', value: faker.number.int({ min: 30, max: 45 }) },
          { name: '2-5 ans', value: faker.number.int({ min: 25, max: 35 }) },
          { name: '5-10 ans', value: faker.number.int({ min: 15, max: 25 }) },
          { name: '10+ ans', value: faker.number.int({ min: 8, max: 18 }) }
        ]
      }
    };
  }

  getSeniorityRetentionChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 25, max: 45, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 18, max: 55, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Rétention par ancienneté',
        data: [
          { name: '5-7 ans', value: faker.number.int({ min: 40, max: 55 }) },
          { name: '7-10 ans', value: faker.number.int({ min: 25, max: 35 }) },
          { name: '10-15 ans', value: faker.number.int({ min: 10, max: 20 }) },
          { name: '15+ ans', value: faker.number.int({ min: 5, max: 15 }) }
        ]
      }
    };
  }

  getSeniorityAndRetentionChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 3.2, max: 5.8, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 2.1, max: 7.5, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Ancienneté et rétention',
        data: [
          { name: 'Ancienneté moy.', value: faker.number.int({ min: 35, max: 45 }) },
          { name: 'Rétention +5ans', value: faker.number.int({ min: 25, max: 40 }) },
          { name: 'Nouveaux <1an', value: faker.number.int({ min: 15, max: 25 }) },
          { name: 'Seniors +10ans', value: faker.number.int({ min: 10, max: 20 }) }
        ]
      }
    };
  }

  getAgeAndSeniorityChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 32, max: 38, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 28, max: 45, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Répartition par tranche d\'âge',
        data: [
          { name: '20-30 ans', value: faker.number.int({ min: 25, max: 35 }) },
          { name: '30-40 ans', value: faker.number.int({ min: 30, max: 40 }) },
          { name: '40-50 ans', value: faker.number.int({ min: 20, max: 30 }) },
          { name: '50+ ans', value: faker.number.int({ min: 10, max: 20 }) }
        ]
      }
    };
  }

  getTaskCompletionRate(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const completedTasks = employees.reduce((sum, employee) => sum + faker.number.int({ min: 0, max: 10 }), 0);
    const totalTasks = employees.length * 10;
    const completionRate = (completedTasks / totalTasks) * 100;

    const trend = this.calculateTrend(filters);

    return {
      id: 'task-completion',
      name: 'Tâches RH',
      value: completionRate.toFixed(1),
      unit: '%',
      trend,
      comparison: this.getTrendComparison(trend),
      category: completionRate < 80 ? 'negative' : 'positive',
      insight: `Le taux de complétion des tâches est de ${completionRate.toFixed(1)}%. ${completionRate < 80 ? 'Il est inférieur à la moyenne.' : 'Il est dans la moyenne.'}`
    };
  }

  getTaskCompletionChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 75, max: 95, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 70, max: 98, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Types de tâches RH',
        data: [
          { name: 'Recrutement', value: faker.number.int({ min: 20, max: 30 }) },
          { name: 'Formation', value: faker.number.int({ min: 15, max: 25 }) },
          { name: 'Administration', value: faker.number.int({ min: 25, max: 35 }) },
          { name: 'Évaluations', value: faker.number.int({ min: 10, max: 20 }) },
          { name: 'Autre', value: faker.number.int({ min: 5, max: 15 }) }
        ]
      }
    };
  }

  getDocumentCompletionRate(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const completedDocuments = employees.reduce((sum, employee) => sum + faker.number.int({ min: 0, max: 5 }), 0);
    const totalDocuments = employees.length * 5;
    const completionRate = (completedDocuments / totalDocuments) * 100;

    const trend = this.calculateTrend(filters);

    return {
      id: 'document-completion',
      name: 'Dossiers collaborateurs',
      value: 'N/A',
      unit: '',
      trend: null,
      comparison: 'stable' as const,
      category: 'neutral' as const,
      insight: `Données indisponibles pour le moment.`
    };
  }

  getDocumentCompletionChartData(filters: FilterOptions): KPIChartData {
    const months = this.generatePeriodLabels(filters.period);
    const departments = [...new Set(this.data.employees.map(emp => emp.department))];
    
    return {
      timeEvolution: months.map(month => ({
        month,
        value: faker.number.float({ min: 80, max: 98, fractionDigits: 1 })
      })),
      departmentBreakdown: departments.map(dept => ({
        department: dept,
        value: faker.number.float({ min: 75, max: 100, fractionDigits: 1 })
      })),
      specificBreakdown: {
        title: 'Types de documents',
        data: [
          { name: 'Contrats', value: faker.number.int({ min: 90, max: 100 }) },
          { name: 'Évaluations', value: faker.number.int({ min: 70, max: 90 }) },
          { name: 'Formations', value: faker.number.int({ min: 60, max: 85 }) },
          { name: 'Administratif', value: faker.number.int({ min: 85, max: 95 }) }
        ]
      }
    };
  }

  getKPIChartData(kpiId: string, filters: FilterOptions): KPIChartData | null {
    switch (kpiId) {
      case 'absenteeism': return this.getAbsenteeismChartData(filters);
      case 'turnover': return this.getTurnoverChartData(filters);
      case 'headcount': return this.getHeadcountChartData(filters);
      
      case 'remote-work': return this.getRemoteWorkChartData(filters);
      case 'onboarding': return this.getOnboardingChartData(filters);
      case 'hr-expenses': return this.getHRExpensesChartData(filters);
      case 'age-seniority': return this.getAgeAndSeniorityChartData(filters);
      case 'average-seniority': return this.getAverageSeniorityChartData(filters);
      case 'seniority-retention': return this.getSeniorityRetentionChartData(filters);
      case 'seniority-and-retention': return this.getSeniorityAndRetentionChartData(filters);
      case 'task-completion': return this.getTaskCompletionChartData(filters);
      case 'document-completion': return this.getDocumentCompletionChartData(filters);
      default: return null;
    }
  }

  generateGlobalInsight(kpis: KPIData[], filters: FilterOptions): string {
    const positiveKPIs = kpis.filter(kpi => kpi.category === 'positive');
    const negativeKPIs = kpis.filter(kpi => kpi.category === 'negative');

    let insight = `📊 Analyse globale de la période (${filters.period}): `;

    if (positiveKPIs.length > negativeKPIs.length) {
      insight += '✅ La majorité des indicateurs sont positifs, ce qui indique une bonne performance globale.';
    } else if (negativeKPIs.length > positiveKPIs.length) {
      insight += '⚠️ La majorité des indicateurs sont négatifs, ce qui nécessite une attention particulière.';
    } else {
      insight += 'ℹ️ Il y a un équilibre entre les indicateurs positifs et négatifs.';
    }

    insight += ' 🎯 Les points clés à surveiller sont : ';

    if (negativeKPIs.length > 0) {
      insight += negativeKPIs.map(kpi => kpi.name).join(', ') + '.';
    } else {
      insight += 'aucun point critique détecté. 🎉';
    }

    return insight;
  }

  getAllKPIs(filters: FilterOptions): KPIData[] {
    return [
      this.getAbsenteeismRate(filters),
      this.getTurnoverRate(filters),
      this.getHeadcount(filters),
      
      this.getRemoteWorkAdoption(filters),
      this.getOnboardingDuration(filters),
      this.getHRExpenses(filters),
      this.getAgeAndSeniority(filters),
      this.getTaskCompletionRate(filters),
      this.getDocumentCompletionRate(filters)
    ];
  }

  private groupEducationLevels(educationLevel: string): string {
    const educationGroups: Record<string, string> = {
      'Doctorat': 'Formation tertiaire',
      'Université Master': 'Formation tertiaire',
      'Université Bachelor': 'Formation tertiaire',
      'Haute école spécialisée Master': 'Formation tertiaire',
      'Haute école spécialisée Bachelor': 'Formation tertiaire',
      'Formation professionnelle supérieure Master': 'Formation professionnelle',
      'Formation professionnelle supérieure Bachelor': 'Formation professionnelle',
      'Formation professionnelle supérieure': 'Formation professionnelle',
      'Brevet d\'enseignement': 'Formation professionnelle',
      'Apprentissage complet': 'Formation professionnelle',
      'Maturité': 'Formation générale',
      'Formation exclusivement interne': 'Formation de base',
      'Scolarité obligatoire': 'Formation de base'
    };
    
    return educationGroups[educationLevel] || 'Autre';
  }

  getEDIData(filters: FilterOptions): EDIData {
    const employees = this.filterEmployees(filters).filter(emp => emp.status === 'active');
    
    console.log('Total active employees:', employees.length);
    console.log('First 5 employees education levels:', employees.slice(0, 5).map(emp => ({ id: emp.id, educationLevel: emp.educationLevel })));
    
    // Âge moyen
    const validAges = employees.filter(emp => emp.birthDate).map(emp => {
      const today = new Date();
      const birthDate = new Date(emp.birthDate!);
      return today.getFullYear() - birthDate.getFullYear();
    });
    const averageAge = validAges.length > 0 ? validAges.reduce((sum, age) => sum + age, 0) / validAges.length : 0;

    // Ratio homme/femme
    const menCount = employees.filter(emp => emp.gender === 'homme').length;
    const womenCount = employees.filter(emp => emp.gender === 'femme').length;
    const totalWithGender = menCount + womenCount;
    const genderRatio = {
      men: totalWithGender > 0 ? (menCount / totalWithGender) * 100 : 50,
      women: totalWithGender > 0 ? (womenCount / totalWithGender) * 100 : 50
    };

    // Écart salarial homme/femme
    const menSalaries = employees.filter(emp => emp.gender === 'homme').map(emp => emp.salary);
    const womenSalaries = employees.filter(emp => emp.gender === 'femme').map(emp => emp.salary);
    const avgMenSalary = menSalaries.length > 0 ? menSalaries.reduce((sum, salary) => sum + salary, 0) / menSalaries.length : 0;
    const avgWomenSalary = womenSalaries.length > 0 ? womenSalaries.reduce((sum, salary) => sum + salary, 0) / womenSalaries.length : 0;
    const salarygap = avgMenSalary > 0 ? ((avgMenSalary - avgWomenSalary) / avgMenSalary) * 100 : 0;

    // Nombre de nationalités
    const nationalities = new Set(employees.filter(emp => emp.nationality).map(emp => emp.nationality!));
    const nationalitiesCount = nationalities.size;

    // Répartition par formation - groupée en 4 catégories principales
    const educationGroupCounts = {
      'Formation tertiaire': 0,
      'Formation professionnelle': 0,
      'Formation générale': 0,
      'Formation de base': 0
    };

    employees.forEach(emp => {
      console.log('Employee education level:', emp.educationLevel);
      if (emp.educationLevel) {
        const group = this.groupEducationLevels(emp.educationLevel);
        console.log(`Mapping ${emp.educationLevel} to ${group}`);
        if (educationGroupCounts.hasOwnProperty(group)) {
          educationGroupCounts[group]++;
        }
      }
    });

    console.log('Grouped education counts:', educationGroupCounts);

    const educationBreakdown = Object.entries(educationGroupCounts)
      .map(([level, count]) => ({
        level,
        count,
        percentage: employees.length > 0 ? (count / employees.length) * 100 : 0
      }))
      .filter(item => item.count > 0); // Filtrer les groupes vides

    console.log('Final education breakdown:', educationBreakdown);

    // Génération d'insight
    const diversity = nationalitiesCount;
    const genderBalance = Math.abs(50 - genderRatio.men);
    const salarygapAbs = Math.abs(salarygap);
    
    let insight = `L'entreprise compte ${diversity} nationalités différentes. `;
    insight += `La répartition hommes-femmes est de ${genderRatio.men.toFixed(1)}% / ${genderRatio.women.toFixed(1)}%. `;
    
    if (salarygapAbs < 5) {
      insight += `✅ L'écart salarial entre hommes et femmes est maîtrisé (${salarygapAbs.toFixed(1)}%).`;
    } else {
      insight += `⚠️ Un écart salarial de ${salarygapAbs.toFixed(1)}% nécessite une attention particulière.`;
    }

    return {
      averageAge: Math.round(averageAge),
      genderRatio,
      salarygap: Math.round(salarygap * 10) / 10,
      nationalitiesCount,
      educationBreakdown,
      insight
    };
  }

  getSalaryData(filters: FilterOptions): SalaryData {
    const employees = this.filterEmployees(filters).filter(emp => emp.status === 'active');
    
    // Masse salariale totale
    const totalSalaryMass = employees.reduce((sum, emp) => sum + emp.salary, 0);
    
    // Calcul ETP total (somme des workingTimeRate)
    const totalETP = employees.reduce((sum, emp) => sum + (emp.workingTimeRate || 1), 0);
    
    // Masse salariale par ETP
    const salaryMassPerETP = totalETP > 0 ? totalSalaryMass / totalETP : 0;
    
    // Chiffre d'affaires fictif basé sur la masse salariale (facteur ~3x pour simulation)
    const simulatedRevenue = totalSalaryMass * 3.2;
    const salaryMassToRevenueRatio = (totalSalaryMass / simulatedRevenue) * 100;
    
    // Répartition par département
    const departmentSalaries: { [key: string]: { total: number; count: number; employees: any[] } } = {};
    
    employees.forEach(emp => {
      if (!departmentSalaries[emp.department]) {
        departmentSalaries[emp.department] = { total: 0, count: 0, employees: [] };
      }
      departmentSalaries[emp.department].total += emp.salary;
      departmentSalaries[emp.department].count += 1;
      departmentSalaries[emp.department].employees.push(emp);
    });
    
    const departmentSalaryBreakdown = Object.entries(departmentSalaries).map(([department, data]) => ({
      department,
      totalSalary: data.total,
      averageSalary: Math.round(data.total / data.count),
      employeeCount: data.count
    })).sort((a, b) => b.totalSalary - a.totalSalary);
    
    // Génération d'insight
    const topDepartment = departmentSalaryBreakdown[0];
    const avgSalaryOverall = Math.round(totalSalaryMass / employees.length);
    
    let insight = `La masse salariale totale s'élève à ${(totalSalaryMass / 1000).toFixed(0)}k€. `;
    insight += `Le salaire moyen est de ${avgSalaryOverall.toLocaleString()}€. `;
    insight += `Le département "${topDepartment.department}" représente la plus grande part avec ${(topDepartment.totalSalary / 1000).toFixed(0)}k€. `;
    insight += `La masse salariale représente ${salaryMassToRevenueRatio.toFixed(1)}% du chiffre d'affaires estimé.`;
    
    return {
      totalSalaryMass,
      salaryMassPerETP: Math.round(salaryMassPerETP),
      salaryMassToRevenueRatio: Math.round(salaryMassToRevenueRatio * 10) / 10,
      departmentSalaryBreakdown,
      insight
    };
  }

  private calculateTrend(filters: FilterOptions): number | null {
    // Si aucune comparaison n'est sélectionnée, on ne retourne pas de tendance
    if (!filters.compareWith) {
      return null;
    }

    // Obtenir les périodes de comparaison
    const { currentPeriod, comparisonPeriod } = this.getComparisonPeriods(filters);
    
    // Calculer l'effectif pour chaque période (à la fin de la période)
    const currentHeadcount = this.getHeadcountAtDate(currentPeriod.end);
    const comparisonHeadcount = this.getHeadcountAtDate(comparisonPeriod.end);
    
    if (comparisonHeadcount === 0) return null;
    
    // Calculer le pourcentage de variation
    const trend = ((currentHeadcount - comparisonHeadcount) / comparisonHeadcount) * 100;
    return Math.round(trend * 10) / 10;
  }

  private getComparisonPeriods(filters: FilterOptions) {
    const now = new Date();
    let currentStart: Date, currentEnd: Date, comparisonStart: Date, comparisonEnd: Date;

    if (filters.period === 'year') {
      // Année courante vs année précédente
      currentEnd = new Date(now.getFullYear(), 11, 31); // 31 décembre année courante
      currentStart = new Date(now.getFullYear(), 0, 1); // 1er janvier année courante
      comparisonEnd = new Date(now.getFullYear() - 1, 11, 31); // 31 décembre année précédente
      comparisonStart = new Date(now.getFullYear() - 1, 0, 1); // 1er janvier année précédente
    } else if (filters.period === 'quarter') {
      // Calculer le trimestre actuel (on suppose T3 = juillet-septembre)
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const quarterStartMonth = currentQuarter * 3;
      
      currentStart = new Date(now.getFullYear(), quarterStartMonth, 1);
      currentEnd = new Date(now.getFullYear(), quarterStartMonth + 3, 0); // Dernier jour du trimestre
      
      if (filters.compareWith === 'previous') {
        // Trimestre précédent
        if (currentQuarter === 0) {
          // Q1 → Q4 année précédente
          comparisonStart = new Date(now.getFullYear() - 1, 9, 1); // Octobre
          comparisonEnd = new Date(now.getFullYear() - 1, 12, 0); // 31 décembre
        } else {
          // Trimestre précédent de la même année
          const prevQuarterStartMonth = (currentQuarter - 1) * 3;
          comparisonStart = new Date(now.getFullYear(), prevQuarterStartMonth, 1);
          comparisonEnd = new Date(now.getFullYear(), prevQuarterStartMonth + 3, 0);
        }
      } else {
        // Même trimestre année précédente
        comparisonStart = new Date(now.getFullYear() - 1, quarterStartMonth, 1);
        comparisonEnd = new Date(now.getFullYear() - 1, quarterStartMonth + 3, 0);
      }
    } else if (filters.period === 'month') {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Dernier jour du mois
      
      if (filters.compareWith === 'previous') {
        // Mois précédent
        if (now.getMonth() === 0) {
          // Janvier → Décembre année précédente
          comparisonStart = new Date(now.getFullYear() - 1, 11, 1);
          comparisonEnd = new Date(now.getFullYear() - 1, 12, 0); // 31 décembre
        } else {
          // Mois précédent de la même année
          comparisonStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          comparisonEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        }
      } else {
        // Même mois année précédente
        comparisonStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        comparisonEnd = new Date(now.getFullYear() - 1, now.getMonth() + 1, 0);
      }
    } else {
      // Défaut
      currentStart = now;
      currentEnd = now;
      comparisonStart = now;
      comparisonEnd = now;
    }

    return {
      currentPeriod: { start: currentStart, end: currentEnd },
      comparisonPeriod: { start: comparisonStart, end: comparisonEnd }
    };
  }

  // Méthode publique pour obtenir les labels de comparaison
  getComparisonLabels(filters: FilterOptions): { current: string; comparison: string } {
    if (!filters.compareWith) {
      return { current: 'Actuel', comparison: 'Précédent' };
    }

    const { currentPeriod, comparisonPeriod } = this.getComparisonPeriods(filters);
    const now = new Date();

    if (filters.period === 'year') {
      return {
        current: `${now.getFullYear()}`,
        comparison: `${now.getFullYear() - 1}`
      };
    } else if (filters.period === 'quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
      
      if (filters.compareWith === 'previous') {
        const prevQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
        const prevYear = currentQuarter === 1 ? now.getFullYear() - 1 : now.getFullYear();
        return {
          current: `T${currentQuarter} ${now.getFullYear()}`,
          comparison: `T${prevQuarter} ${prevYear}`
        };
      } else {
        return {
          current: `T${currentQuarter} ${now.getFullYear()}`,
          comparison: `T${currentQuarter} ${now.getFullYear() - 1}`
        };
      }
    } else if (filters.period === 'month') {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 
                     'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const currentMonth = now.getMonth();
      
      if (filters.compareWith === 'previous') {
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return {
          current: `${months[currentMonth]} ${now.getFullYear()}`,
          comparison: `${months[prevMonth]} ${prevYear}`
        };
      } else {
        return {
          current: `${months[currentMonth]} ${now.getFullYear()}`,
          comparison: `${months[currentMonth]} ${now.getFullYear() - 1}`
        };
      }
    }

    return { current: 'Actuel', comparison: 'Précédent' };
  }

  // Méthode pour générer les données d'évolution selon la période et la comparaison
  getEvolutionData(filters: FilterOptions): Array<{period: string, effectif: number, effectifN1?: number}> {
    const now = new Date();
    const currentYear = now.getFullYear();

    if (filters.period === 'year') {
      return this.getYearEvolutionData(filters, currentYear);
    } else if (filters.period === 'quarter') {
      return this.getQuarterEvolutionData(filters, currentYear);
    } else if (filters.period === 'month') {
      return this.getMonthEvolutionData(filters, currentYear);
    }

    return [];
  }

  private getYearEvolutionData(filters: FilterOptions, currentYear: number): Array<{period: string, effectif: number, effectifN1?: number}> {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    if (!filters.compareWith) {
      // Sans comparaison : une seule courbe par mois
      return months.map(month => ({
        period: month,
        effectif: faker.number.int({ min: 280, max: 330 })
      }));
    } else {
      // Avec comparaison : deux courbes (année courante vs année précédente)
      return months.map(month => ({
        period: month,
        effectif: faker.number.int({ min: 280, max: 330 }), // Année courante
        effectifN1: faker.number.int({ min: 270, max: 320 }) // Année précédente
      }));
    }
  }

  private getQuarterEvolutionData(filters: FilterOptions, currentYear: number): Array<{period: string, effectif: number, effectifN1?: number, isCurrentQuarter?: boolean}> {
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const quarterMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // Mois du trimestre en cours
    const currentQuarterMonthNames = quarterMonths.slice(currentQuarter * 3, (currentQuarter + 1) * 3);
    
    if (!filters.compareWith) {
      // Sans comparaison : une seule courbe pour les 3 mois du trimestre en cours
      return currentQuarterMonthNames.map(month => ({
        period: month,
        effectif: faker.number.int({ min: 310, max: 330 }),
        isCurrentQuarter: true
      }));
    } else if (filters.compareWith === 'previous') {
      // Comparaison avec trimestre précédent - UNE SEULE COURBE sur 6 mois
      const prevQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const prevQuarterMonthNames = quarterMonths.slice(prevQuarter * 3, (prevQuarter + 1) * 3);
      
      // Une seule série continue sur 6 mois avec indicateur de période
      const prevQuarterData = prevQuarterMonthNames.map(month => ({
        period: month,
        effectif: faker.number.int({ min: 300, max: 320 }),
        isCurrentQuarter: false
      }));
      
      const currentQuarterData = currentQuarterMonthNames.map(month => ({
        period: month,
        effectif: faker.number.int({ min: 310, max: 330 }),
        isCurrentQuarter: true
      }));
      
      return [...prevQuarterData, ...currentQuarterData];
    } else {
      // Comparaison avec année précédente (même trimestre)
      // Axe X = 3 mois du trimestre en cours
      return currentQuarterMonthNames.map(month => ({
        period: month,
        effectif: faker.number.int({ min: 310, max: 330 }), // Trimestre en cours 2025
        effectifN1: faker.number.int({ min: 290, max: 310 }), // Même trimestre 2024
        isCurrentQuarter: true
      }));
    }
  }

  private getMonthEvolutionData(filters: FilterOptions, currentYear: number): Array<{period: string, effectif: number, effectifN1?: number}> {
    const now = new Date();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    if (!filters.compareWith) {
      // Sans comparaison : une seule courbe par jour du mois
      return Array.from({ length: daysInMonth }, (_, i) => ({
        period: `${i + 1}`,
        effectif: faker.number.int({ min: 315, max: 325 })
      }));
    } else if (filters.compareWith === 'previous') {
      // Comparaison avec mois précédent
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
      const maxDays = Math.max(daysInMonth, daysInPrevMonth);
      
      return Array.from({ length: maxDays }, (_, i) => ({
        period: `${i + 1}`,
        effectif: i < daysInMonth ? faker.number.int({ min: 315, max: 325 }) : 0,
        effectifN1: i < daysInPrevMonth ? faker.number.int({ min: 310, max: 320 }) : 0
      }));
    } else {
      // Comparaison avec même mois année précédente
      return Array.from({ length: daysInMonth }, (_, i) => ({
        period: `${i + 1}`,
        effectif: faker.number.int({ min: 315, max: 325 }), // Mois courant
        effectifN1: faker.number.int({ min: 300, max: 315 }) // Même mois année précédente
      }));
    }
  }


  private getISOWeekNumber(date: Date): number {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year
    tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
    // January 4 is always in week 1
    const yearStart = new Date(tempDate.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count weeks from there
    return Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  private getHeadcountAtDate(date: Date): number {
    return this.data.employees.filter(employee => {
      const hireDate = new Date(employee.hireDate);
      const terminationDate = employee.terminationDate ? new Date(employee.terminationDate) : null;
      
      return employee.status === 'active' && 
             hireDate <= date && 
             (!terminationDate || terminationDate > date);
    }).length;
  }

  private getTrendComparison(trend: number | null): 'higher' | 'lower' | 'stable' {
    if (trend === null) return 'stable';
    if (trend > 0) return 'higher';
    if (trend < 0) return 'lower';
    return 'stable';
  }

  private generatePeriodLabels(period: string): string[] {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const weeks = ['S48', 'S49', 'S50', 'S51', 'S52', 'S1', 'S2', 'S3'];
    
    switch (period) {
      case 'quarter': return weeks; // évolution hebdomadaire pour le trimestre
      case 'year': return months; // évolution mensuelle pour l'année
      case 'month': return weeks.slice(-4); // S52, S1, S2, S3 pour le mois
      default: return months.slice(0, 6);
    }
  }

  private getPeriodStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'month':
        const monthStart = new Date(now);
        monthStart.setMonth(now.getMonth() - 1);
        return monthStart;
      case 'quarter':
        const quarterStart = new Date(now);
        quarterStart.setMonth(now.getMonth() - 3);
        return quarterStart;
      case 'year':
        const yearStart = new Date(now);
        yearStart.setFullYear(now.getFullYear() - 1);
        return yearStart;
      default:
        const defaultStart = new Date(now);
        defaultStart.setMonth(now.getMonth() - 1);
        return defaultStart;
    }
  }

  private getTotalDays(period: string): number {
    switch (period) {
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      default: return 30;
    }
  }

  private filterEmployees(filters: FilterOptions): Employee[] {
    let employees = this.data.employees;

    if (filters.department) {
      employees = employees.filter(employee => employee.department === filters.department);
    }

    if (filters.agency) {
      employees = employees.filter(employee => employee.agency === filters.agency);
    }

    if (filters.remoteWork !== undefined) {
      employees = employees.filter(employee => employee.remoteWork === filters.remoteWork);
    }

    return employees;
  }
}
