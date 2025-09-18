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
  period: 'week' | 'month' | 'quarter' | 'year' | 'custom';
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
    const months = this.generateMonthLabels(filters.period);
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
    const months = this.generateMonthLabels(filters.period);
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
    const months = this.generateMonthLabels(filters.period);
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
    const employees = this.filterEmployees(filters);
    const remoteEmployees = employees.filter(employee => employee.remoteWork).length;
    const remoteWorkAdoptionRate = (remoteEmployees / employees.length) * 100;

    const trend = this.calculateTrend(filters);

    return {
      id: 'remote-work',
      name: 'Télétravail',
      value: remoteWorkAdoptionRate.toFixed(1),
      unit: '%',
      trend,
      comparison: this.getTrendComparison(trend),
      category: remoteWorkAdoptionRate < 20 ? 'negative' : 'positive',
      insight: `Le taux d'adoption du télétravail est de ${remoteWorkAdoptionRate.toFixed(1)}%. ${remoteWorkAdoptionRate < 20 ? 'Il est inférieur à la moyenne.' : 'Il est dans la moyenne.'}`
    };
  }

  getRemoteWorkChartData(filters: FilterOptions): KPIChartData {
    const months = this.generateMonthLabels(filters.period);
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
    const months = this.generateMonthLabels(filters.period);
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
    const totalExpenses = this.data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const trend = this.calculateTrend(filters);
    
    return {
      id: 'hr-expenses',
      name: 'Dépenses RH totales',
      value: Math.round(totalExpenses),
      unit: '€',
      trend,
      comparison: this.getTrendComparison(trend),
      category: trend && trend > 15 ? 'negative' : trend && trend > 5 ? 'neutral' : 'positive',
      insight: `💰 Budget RH de ${Math.round(totalExpenses).toLocaleString()}€ cette période. ${
        trend && trend > 0 
          ? `📈 Augmentation de ${Math.round(trend)}% par rapport à la période de comparaison, principalement due aux frais de formation et équipements.`
          : trend && trend < 0
          ? `📉 Réduction de ${Math.abs(Math.round(trend))}% des dépenses par rapport à la période de comparaison.`
          : '📊 Dépenses stables par rapport à la période de comparaison.'
      }`
    };
  }

  getHRExpensesChartData(filters: FilterOptions): KPIChartData {
    const months = this.generateMonthLabels(filters.period);
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
    const months = this.generateMonthLabels(filters.period);
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
    const months = this.generateMonthLabels(filters.period);
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
    const months = this.generateMonthLabels(filters.period);
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
    const months = this.generateMonthLabels(filters.period);
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
    const months = this.generateMonthLabels(filters.period);
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
      value: completionRate.toFixed(1),
      unit: '%',
      trend,
      comparison: this.getTrendComparison(trend),
      category: completionRate < 80 ? 'negative' : 'positive',
      insight: `Le taux de complétion des dossiers est de ${completionRate.toFixed(1)}%. ${completionRate < 80 ? 'Il est inférieur à la moyenne.' : 'Il est dans la moyenne.'}`
    };
  }

  getDocumentCompletionChartData(filters: FilterOptions): KPIChartData {
    const months = this.generateMonthLabels(filters.period);
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
      if (emp.educationLevel) {
        const group = this.groupEducationLevels(emp.educationLevel);
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

  private calculateTrend(filters: FilterOptions): number | null {
    // Si aucune comparaison n'est sélectionnée, on ne retourne pas de tendance
    if (!filters.compareWith) {
      return null;
    }

    // Simulation de calcul de tendance selon le type de comparaison
    return faker.number.int({ min: -10, max: 10 });
  }

  private getTrendComparison(trend: number | null): 'higher' | 'lower' | 'stable' {
    if (trend === null) return 'stable';
    if (trend > 0) return 'higher';
    if (trend < 0) return 'lower';
    return 'stable';
  }

  private generateMonthLabels(period: string): string[] {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    switch (period) {
      case 'quarter': return months.slice(0, 3);
      case 'year': return months;
      case 'month': return ['S1', 'S2', 'S3', 'S4'];
      default: return months.slice(0, 6);
    }
  }

  private getPeriodStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        return weekStart;
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
      case 'week': return 7;
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
