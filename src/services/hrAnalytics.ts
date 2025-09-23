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
  departmentBreakdown: Array<{ 
    department: string; 
    count: number; 
    etp: number;
    countPrevious?: number;
    etpPrevious?: number;
  }>;
  comparison: 'higher' | 'lower' | 'stable';
  category: 'positive' | 'negative' | 'neutral';
  insight: string;
  comparisonLabels?: { current: string; comparison: string };
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

  getExtendedTurnover(filters: FilterOptions) {
    const turnoverRate = this.getTurnoverRate(filters);
    const employees = this.filterEmployees(filters);
    const totalTurnover = parseFloat(turnoverRate.value as string);
    const departures = Math.round((employees.length * totalTurnover) / 100);
    
    return {
      totalTurnoverRate: totalTurnover,
      departures,
      trend: turnoverRate.trend,
      comparison: turnoverRate.comparison,
      category: turnoverRate.category,
      insight: turnoverRate.insight
    };
  }

  getTurnoverEvolutionData(filters: FilterOptions) {
    const currentYear = new Date().getFullYear();
    
    if (filters.period === 'year') {
      return this.getYearTurnoverEvolutionData(filters, currentYear);
    } else if (filters.period === 'quarter') {
      return this.getQuarterTurnoverEvolutionData(filters, currentYear);
    } else if (filters.period === 'month') {
      return null; // Pas d'évolution pour le mois
    }
    
    return null;
  }

  private getYearTurnoverEvolutionData(filters: FilterOptions, currentYear: number): Array<{period: string, turnover: number, turnoverN1?: number}> {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    if (!filters.compareWith) {
      return months.map(month => ({
        period: month,
        turnover: faker.number.float({ min: 5, max: 15, fractionDigits: 1 })
      }));
    } else {
      return months.map(month => ({
        period: month,
        turnover: faker.number.float({ min: 5, max: 15, fractionDigits: 1 }),
        turnoverN1: faker.number.float({ min: 4, max: 16, fractionDigits: 1 })
      }));
    }
  }

  private getQuarterTurnoverEvolutionData(filters: FilterOptions, currentYear: number): Array<{period: string, turnover: number, turnoverN1?: number, isCurrentQuarter?: boolean}> {
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    
    if (!filters.compareWith) {
      const quarterMonths = this.getMonthsInQuarter(currentYear, currentQuarter);
      return quarterMonths.map(month => ({
        period: month,
        turnover: faker.number.float({ min: 5, max: 15, fractionDigits: 1 }),
        isCurrentQuarter: true
      }));
    } else if (filters.compareWith === 'previous') {
      const quarterMonths = this.getMonthsInQuarter(currentYear, currentQuarter);
      const prevQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const prevYear = currentQuarter === 0 ? currentYear - 1 : currentYear;
      const prevQuarterMonths = this.getMonthsInQuarter(prevYear, prevQuarter);
      
      const prevQuarterData = prevQuarterMonths.map(month => ({
        period: month,
        turnover: faker.number.float({ min: 4, max: 14, fractionDigits: 1 }),
        isCurrentQuarter: false
      }));
      
      const currentQuarterData = quarterMonths.map(month => ({
        period: month,
        turnover: faker.number.float({ min: 5, max: 15, fractionDigits: 1 }),
        isCurrentQuarter: true
      }));
      
      return [...prevQuarterData, ...currentQuarterData];
    } else {
      const quarterMonths = this.getMonthsInQuarter(currentYear, currentQuarter);
      return quarterMonths.map(month => ({
        period: month,
        turnover: faker.number.float({ min: 5, max: 15, fractionDigits: 1 }),
        turnoverN1: faker.number.float({ min: 4, max: 16, fractionDigits: 1 }),
        isCurrentQuarter: true
      }));
    }
  }

  getTurnoverByAgency(filters: FilterOptions) {
    const agencies = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Bordeaux'];
    return agencies.map(agency => ({
      agency,
      turnover: faker.number.float({ min: 3, max: 18, fractionDigits: 1 }),
      turnoverN1: faker.number.float({ min: 2, max: 20, fractionDigits: 1 })
    }));
  }

  getTurnoverByDepartment(filters: FilterOptions) {
    const departments = ['RH', 'Commercial', 'Technique', 'Marketing', 'Finance', 'Support'];
    return departments.map(department => ({
      department,
      turnover: faker.number.float({ min: 2, max: 22, fractionDigits: 1 }),
      turnoverN1: faker.number.float({ min: 1, max: 25, fractionDigits: 1 })
    }));
  }

  getTurnoverByHierarchicalLevel(filters: FilterOptions) {
    return [
      { name: 'Manager', value: faker.number.float({ min: 8, max: 15, fractionDigits: 1 }), percentage: 35 },
      { name: 'Non-manager', value: faker.number.float({ min: 5, max: 12, fractionDigits: 1 }), percentage: 65 }
    ];
  }

  getTurnoverByHierarchicalLevelPrevious(filters: FilterOptions) {
    return [
      { name: 'Manager', value: faker.number.float({ min: 7, max: 16, fractionDigits: 1 }), percentage: 32 },
      { name: 'Non-manager', value: faker.number.float({ min: 4, max: 13, fractionDigits: 1 }), percentage: 68 }
    ];
  }

  getTurnoverByContractType(filters: FilterOptions) {
    return [
      { name: 'CDI', value: faker.number.float({ min: 3, max: 8, fractionDigits: 1 }), percentage: 60 },
      { name: 'CDD', value: faker.number.float({ min: 15, max: 25, fractionDigits: 1 }), percentage: 25 },
      { name: 'Intérim', value: faker.number.float({ min: 20, max: 35, fractionDigits: 1 }), percentage: 10 },
      { name: 'Stage', value: faker.number.float({ min: 80, max: 95, fractionDigits: 1 }), percentage: 5 }
    ];
  }

  getTurnoverByContractTypePrevious(filters: FilterOptions) {
    return [
      { name: 'CDI', value: faker.number.float({ min: 2, max: 9, fractionDigits: 1 }), percentage: 58 },
      { name: 'CDD', value: faker.number.float({ min: 12, max: 28, fractionDigits: 1 }), percentage: 27 },
      { name: 'Intérim', value: faker.number.float({ min: 18, max: 38, fractionDigits: 1 }), percentage: 12 },
      { name: 'Stage', value: faker.number.float({ min: 75, max: 98, fractionDigits: 1 }), percentage: 3 }
    ];
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
    
    // Répartition par département 
    const departmentCounts = new Map<string, { count: number; etp: number }>();
    activeEmployees.forEach(employee => {
      const current = departmentCounts.get(employee.department) || { count: 0, etp: 0 };
      departmentCounts.set(employee.department, {
        count: current.count + 1,
        etp: current.etp + (employee.workingTimeRate || 1.0)
      });
    });
    
    // Simuler les données de comparaison si nécessaire
    const departmentBreakdown = Array.from(departmentCounts.entries())
      .map(([department, data]) => {
        const result: any = {
          department,
          count: data.count,
          etp: data.etp
        };
        
        // Ajouter les données de comparaison simulées si demandées
        if (filters.compareWith) {
          const variationFactor = faker.number.float({ min: 0.85, max: 1.15 });
          result.countPrevious = Math.max(0, Math.round(data.count * variationFactor));
          result.etpPrevious = Math.max(0, Math.round(data.etp * variationFactor * 10) / 10);
        }
        
        return result;
      })
      .sort((a, b) => b.count - a.count);
    
    const trend = this.calculateTrend(filters);
    const comparisonLabels = this.getComparisonLabels(filters);
    
    return {
      totalHeadcount,
      totalETP: Math.round(totalETP * 10) / 10,
      newHires,
      departures,
      trend,
      departmentBreakdown,
      comparison: this.getTrendComparison(trend),
      category: totalHeadcount < 100 ? 'negative' : 'positive',
      insight: `Effectif de ${totalHeadcount} collaborateurs (${totalETP.toFixed(1)} ETP). ${newHires} arrivée${newHires > 1 ? 's' : ''} et ${departures} départ${departures > 1 ? 's' : ''} sur la période. ${trend && trend > 0 ? '📈 Croissance de l\'effectif' : trend && trend < 0 ? '📉 Réduction de l\'effectif' : '📊 Effectif stable'}.`,
      comparisonLabels
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

  // Méthode publique pour obtenir les labels de comparaison avec format "vs"
  // Nouvelle méthode pour l'analyse d'ancienneté
  async getSeniorityAnalytics(filters: FilterOptions, departureFilter: string = 'all'): Promise<any> {
    const currentDate = new Date();
    
    // Calculer l'ancienneté de chaque employé actif
    const activeEmployees = this.data.employees.filter(emp => emp.status === 'active');
    const seniorityData = activeEmployees.map(emp => {
      const yearsOfService = (currentDate.getTime() - emp.hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return { ...emp, yearsOfService };
    });

    // 1. Répartition par tranche d'ancienneté avec comparaisons
    const seniorityRanges = [
      { range: '0-1 an', min: 0, max: 1 },
      { range: '1-3 ans', min: 1, max: 3 },
      { range: '3-5 ans', min: 3, max: 5 },
      { range: '5-10 ans', min: 5, max: 10 },
      { range: '10+ ans', min: 10, max: 999 }
    ];

    const seniorityDistribution = seniorityRanges.map(range => {
      const count = seniorityData.filter(emp => 
        emp.yearsOfService >= range.min && emp.yearsOfService < range.max
      ).length;
      const percentage = Math.round((count / seniorityData.length) * 100);
      
      let countPrevious = null;
      let comparisonLabel = null;
      
      if (filters.compareWith) {
        countPrevious = Math.max(0, count + Math.floor(Math.random() * 10 - 5));
        comparisonLabel = this.getComparisonLabel(filters.period, filters.compareWith);
      }
      
      return { 
        ...range, 
        count, 
        countPrevious,
        percentage,
        comparisonLabel
      };
    });

    // 2. Évolution de l'ancienneté moyenne selon la période
    const seniorityEvolution = this.generateSeniorityEvolution(filters.period);

    // 3. Ancienneté par département avec comparaisons
    const seniorityByDepartment = this.generateSeniorityByDepartment(seniorityData, filters);

    // 4. Ancienneté par agence avec comparaisons
    const seniorityByAgency = this.generateSeniorityByAgency(seniorityData, filters);

    // 5. Départs par ancienneté avec comparaisons (données simulées basées sur le filtre)
    const departuresBySeniority = seniorityRanges.map(range => {
      let baseCount = Math.floor(Math.random() * 15) + 5;
      
      // Ajuster selon le type de départ
      if (departureFilter === 'resignation') {
        baseCount = Math.floor(baseCount * 0.7);
      } else if (departureFilter === 'retirement') {
        baseCount = range.range === '10+ ans' ? baseCount * 3 : Math.floor(baseCount * 0.2);
      }
      
      const totalDepartures = seniorityRanges.reduce((sum, r) => sum + Math.floor(Math.random() * 15) + 5, 0);
      const percentage = Math.round((baseCount / totalDepartures) * 100);
      
      let countPrevious = null;
      let comparisonLabel = null;
      
      if (filters.compareWith) {
        countPrevious = Math.max(0, baseCount + Math.floor(Math.random() * 8 - 4));
        comparisonLabel = this.getComparisonLabel(filters.period, filters.compareWith);
      }
      
      return { 
        ...range, 
        count: baseCount, 
        countPrevious,
        percentage,
        comparisonLabel
      };
    });

    // Métriques principales
    const averageSeniority = Math.round((seniorityData.reduce((sum, emp) => sum + emp.yearsOfService, 0) / seniorityData.length) * 10) / 10;
    const retentionRate = Math.round((activeEmployees.length / (activeEmployees.length + 45)) * 100); // 45 départs simulés
    const seniorEmployees = seniorityData.filter(emp => emp.yearsOfService >= 5).length;
    const seniorEmployeesPercent = Math.round((seniorEmployees / seniorityData.length) * 100);

    return {
      averageSeniority,
      seniorityTrend: Math.random() > 0.5 ? Math.round(Math.random() * 5 + 1) : -Math.round(Math.random() * 3 + 1),
      retentionRate,
      retentionTrend: Math.random() > 0.5 ? Math.round(Math.random() * 3 + 1) : -Math.round(Math.random() * 2 + 1),
      seniorEmployees,
      seniorEmployeesPercent,
      seniorityDistribution,
      seniorityEvolution,
      seniorityByDepartment,
      seniorityByAgency,
      departuresBySeniority,
      insight: "L'analyse montre une ancienneté moyenne stable avec une bonne rétention des collaborateurs expérimentés. Les départs sont principalement concentrés sur les premières années d'emploi."
    };
  }

  // Méthode pour générer l'évolution de l'ancienneté selon la période
  private generateSeniorityEvolution(period: string) {
    const evolution = [];
    const count = period === 'year' ? 5 : period === 'quarter' ? 12 : 12;
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date();
      let periodLabel = '';
      
      if (period === 'year') {
        date.setFullYear(date.getFullYear() - i);
        periodLabel = date.getFullYear().toString();
      } else if (period === 'quarter') {
        date.setMonth(date.getMonth() - (i * 3));
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        periodLabel = `T${quarter} ${date.getFullYear()}`;
      } else {
        date.setMonth(date.getMonth() - i);
        periodLabel = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      }
      
      const average = 4.2 + Math.random() * 0.8 - 0.4;
      const median = 3.8 + Math.random() * 0.6 - 0.3;
      
      evolution.push({ 
        period: periodLabel, 
        average: Math.round(average * 10) / 10, 
        median: Math.round(median * 10) / 10 
      });
    }
    
    return evolution;
  }

  // Méthode pour générer l'ancienneté par département avec comparaisons
  private generateSeniorityByDepartment(seniorityData: any[], filters: FilterOptions) {
    const departments = [...new Set(seniorityData.map(emp => emp.department))];
    
    return departments.map(dept => {
      const deptEmployees = seniorityData.filter(emp => emp.department === dept);
      const avgSeniority = deptEmployees.length > 0 
        ? Math.round((deptEmployees.reduce((sum, emp) => sum + emp.yearsOfService, 0) / deptEmployees.length) * 10) / 10 
        : 0;
      
      let avgSeniorityPrevious = null;
      let comparisonLabel = null;
      
      if (filters.compareWith) {
        avgSeniorityPrevious = Math.max(0, Math.round((avgSeniority + Math.random() * 0.8 - 0.4) * 10) / 10);
        comparisonLabel = this.getComparisonLabel(filters.period, filters.compareWith);
      }
      
      return {
        department: dept,
        avgSeniority,
        avgSeniorityPrevious,
        count: deptEmployees.length,
        comparisonLabel
      };
    });
  }

  // Méthode pour générer l'ancienneté par agence avec comparaisons
  private generateSeniorityByAgency(seniorityData: any[], filters: FilterOptions) {
    const agencies = [...new Set(seniorityData.map(emp => emp.agency))];
    
    return agencies.map(agency => {
      const agencyEmployees = seniorityData.filter(emp => emp.agency === agency);
      const avgSeniority = agencyEmployees.length > 0 
        ? Math.round((agencyEmployees.reduce((sum, emp) => sum + emp.yearsOfService, 0) / agencyEmployees.length) * 10) / 10 
        : 0;
      
      let avgSeniorityPrevious = null;
      let comparisonLabel = null;
      
      if (filters.compareWith) {
        avgSeniorityPrevious = Math.max(0, Math.round((avgSeniority + Math.random() * 0.8 - 0.4) * 10) / 10);
        comparisonLabel = this.getComparisonLabel(filters.period, filters.compareWith);
      }
      
      return {
        agency,
        avgSeniority,
        avgSeniorityPrevious,
        count: agencyEmployees.length,
        comparisonLabel
      };
    });
  }

  // Méthode utilitaire pour obtenir le label de comparaison
  private getComparisonLabel(period: string, compareWith: string): string {
    const now = new Date();
    
    if (period === 'year') {
      return `${now.getFullYear()} vs ${now.getFullYear() - 1}`;
    } else if (period === 'quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
      
      if (compareWith === 'previous') {
        const prevQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
        const prevYear = currentQuarter === 1 ? now.getFullYear() - 1 : now.getFullYear();
        return `T${currentQuarter} ${now.getFullYear()} vs T${prevQuarter} ${prevYear}`;
      } else {
        return `T${currentQuarter} ${now.getFullYear()} vs T${currentQuarter} ${now.getFullYear() - 1}`;
      }
    } else if (period === 'month') {
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const currentMonth = now.getMonth();
      
      if (compareWith === 'previous') {
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return `${months[currentMonth]} ${now.getFullYear()} vs ${months[prevMonth]} ${prevYear}`;
      } else {
        return `${months[currentMonth]} ${now.getFullYear()} vs ${months[currentMonth]} ${now.getFullYear() - 1}`;
      }
    }
    
    return 'Actuel vs Précédent';
  }

  getComparisonLabels(filters: FilterOptions): { current: string; comparison: string } {
    if (!filters.compareWith) {
      return { current: 'Actuel', comparison: 'Précédent' };
    }

    const { currentPeriod, comparisonPeriod } = this.getComparisonPeriods(filters);
    const now = new Date();

    if (filters.period === 'year') {
      return {
        current: `${now.getFullYear()} vs ${now.getFullYear() - 1}`,
        comparison: `${now.getFullYear() - 1}`
      };
    } else if (filters.period === 'quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
      
      if (filters.compareWith === 'previous') {
        const prevQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
        const prevYear = currentQuarter === 1 ? now.getFullYear() - 1 : now.getFullYear();
        return {
          current: `T${currentQuarter} ${now.getFullYear()} vs T${prevQuarter} ${prevYear}`,
          comparison: `T${prevQuarter} ${prevYear}`
        };
      } else {
        return {
          current: `T${currentQuarter} ${now.getFullYear()} vs T${currentQuarter} ${now.getFullYear() - 1}`,
          comparison: `T${currentQuarter} ${now.getFullYear() - 1}`
        };
      }
    } else if (filters.period === 'month') {
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const currentMonth = now.getMonth();
      
      if (filters.compareWith === 'previous') {
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return {
          current: `${months[currentMonth]} ${now.getFullYear()} vs ${months[prevMonth]} ${prevYear}`,
          comparison: `${months[prevMonth]} ${prevYear}`
        };
      } else {
        return {
          current: `${months[currentMonth]} ${now.getFullYear()} vs ${months[currentMonth]} ${now.getFullYear() - 1}`,
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

  private getMonthEvolutionData(filters: FilterOptions, currentYear: number): Array<{period: string, effectif: number, effectifN1?: number, isCurrentMonth?: boolean}> {
    const now = new Date();
    const currentMonth = now.getMonth();
    
    // Calculer les semaines ISO du mois en cours
    const currentMonthWeeks = this.getMonthISOWeeks(currentYear, currentMonth);
    
    if (!filters.compareWith) {
      // Sans comparaison : effectif par semaine du mois en cours
      return currentMonthWeeks.map(week => ({
        period: `S${week}`,
        effectif: faker.number.int({ min: 315, max: 325 }),
        isCurrentMonth: true
      }));
    } else if (filters.compareWith === 'previous') {
      // Comparaison avec mois précédent - UNE SEULE COURBE continue
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const prevMonthWeeks = this.getMonthISOWeeks(prevYear, prevMonth);
      
      // Une seule série continue avec indicateur de période
      const prevMonthData = prevMonthWeeks.map(week => ({
        period: `S${week}`,
        effectif: faker.number.int({ min: 310, max: 320 }),
        isCurrentMonth: false
      }));
      
      const currentMonthData = currentMonthWeeks.map(week => ({
        period: `S${week}`,
        effectif: faker.number.int({ min: 315, max: 325 }),
        isCurrentMonth: true
      }));
      
      return [...prevMonthData, ...currentMonthData];
    } else {
      // Comparaison avec année précédente (mêmes semaines ISO)
      return currentMonthWeeks.map(week => ({
        period: `S${week}`,
        effectif: faker.number.int({ min: 315, max: 325 }), // Année N
        effectifN1: faker.number.int({ min: 300, max: 315 }), // Année N-1
        isCurrentMonth: true
      }));
    }
  }

  private getMonthISOWeeks(year: number, month: number): number[] {
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Semaines ISO
    const firstWeek = this.getISOWeekNumber(firstDay);
    const lastWeek = this.getISOWeekNumber(lastDay);
    
    const weeks: number[] = [];
    
    // Gérer le cas où on traverse le changement d'année
    if (firstWeek <= lastWeek) {
      for (let week = firstWeek; week <= lastWeek; week++) {
        weeks.push(week);
      }
    } else {
      // Fin d'année (ex: décembre peut avoir des semaines 48-52, puis 1)
      for (let week = firstWeek; week <= 52; week++) {
        weeks.push(week);
      }
      for (let week = 1; week <= lastWeek; week++) {
        weeks.push(week);
      }
    }
    
    return weeks;
  }

  private getMonthsInQuarter(year: number, quarter: number): string[] {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const startMonth = quarter * 3;
    return months.slice(startMonth, startMonth + 3);
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

  // Méthodes pour les détails d'absentéisme
  getAbsenteeismEvolution(filters: FilterOptions): any[] {
    const periods = this.generatePeriodLabels(filters.period);
    
    return periods.map(period => {
      const currentRate = faker.number.float({ min: 2, max: 8, multipleOf: 0.1 });
      const previousRate = filters.compareWith ? faker.number.float({ min: 2, max: 8, multipleOf: 0.1 }) : null;
      
      return {
        period,
        current: currentRate,
        ...(previousRate && { previous: previousRate })
      };
    });
  }

  getAbsenteeismByAgency(filters: FilterOptions): any[] {
    const agencies = this.getAgencies();
    
    return agencies.map(agency => ({
      name: agency,
      value: faker.number.float({ min: 1, max: 10, multipleOf: 0.1 }),
      comparison: filters.compareWith ? faker.number.float({ min: -2, max: 2, multipleOf: 0.1 }) : null
    }));
  }

  getAbsenteeismByDepartment(filters: FilterOptions): any[] {
    const departments = this.getDepartments();
    
    return departments.map(dept => ({
      name: dept,
      value: faker.number.float({ min: 1, max: 10, multipleOf: 0.1 }),
      comparison: filters.compareWith ? faker.number.float({ min: -2, max: 2, multipleOf: 0.1 }) : null
    }));
  }

  getAbsenteeismByType(filters: FilterOptions): any[] {
    const types = ['Maladie', 'Congés familiaux', 'Accident travail', 'Formation', 'Autres'];
    
    return types.map(type => ({
      name: type,
      value: faker.number.float({ min: 10, max: 40, multipleOf: 0.1 }),
      comparison: filters.compareWith ? faker.number.float({ min: -5, max: 5, multipleOf: 0.1 }) : null
    }));
  }

  getAbsenteeismByDemographic(filters: FilterOptions): any[] {
    const ageRanges = ['<25 ans', '25-35 ans', '36-45 ans', '46-55 ans', '>55 ans'];
    
    return ageRanges.map(range => ({
      name: range,
      value: faker.number.float({ min: 1, max: 12, multipleOf: 0.1 }),
      comparison: filters.compareWith ? faker.number.float({ min: -3, max: 3, multipleOf: 0.1 }) : null
    }));
  }

  getDepartments(): string[] {
    return ['RH', 'IT', 'Finance', 'Commercial', 'Marketing', 'Production'];
  }

  getAgencies(): string[] {
    return ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Strasbourg'];
  }

  // Méthodes pour les détails d'équité
  getAgePyramidData(filters: FilterOptions): any[] {
    const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56-65'];
    
    return ageRanges.map(ageRange => {
      const hommes = faker.number.int({ min: 5, max: 45 });
      const femmes = faker.number.int({ min: 5, max: 45 });
      const total = hommes + femmes;
      
      // Calculer les pourcentages
      const hommesPercentage = total > 0 ? Math.round((hommes / total) * 100 * 10) / 10 : 0;
      const femmesPercentage = total > 0 ? Math.round((femmes / total) * 100 * 10) / 10 : 0;
      
      const hommesN1 = filters.compareWith ? faker.number.int({ min: 5, max: 45 }) : null;
      const femmesN1 = filters.compareWith ? faker.number.int({ min: 5, max: 45 }) : null;
      
      // Calculer les pourcentages pour la période précédente
      let hommesPercentageN1 = 0;
      let femmesPercentageN1 = 0;
      
      if (filters.compareWith && hommesN1 && femmesN1) {
        const totalN1 = hommesN1 + femmesN1;
        hommesPercentageN1 = totalN1 > 0 ? Math.round((hommesN1 / totalN1) * 100 * 10) / 10 : 0;
        femmesPercentageN1 = totalN1 > 0 ? Math.round((femmesN1 / totalN1) * 100 * 10) / 10 : 0;
      }
      
      return {
        ageRange,
        hommes,
        femmes,
        hommesPercentage,
        femmesPercentage,
        ...(hommesN1 && { hommesN1 }),
        ...(femmesN1 && { femmesN1 }),
        ...(filters.compareWith && { 
          hommesPercentageN1,
          femmesPercentageN1
        })
      };
    });
  }

  getEducationDistribution(filters: FilterOptions): any[] {
    const educationLevels = [
      'Doctorat',
      'Master',
      'Licence',
      'DUT/BTS',
      'Baccalauréat',
      'Formation professionnelle'
    ];
    
    return educationLevels.map(level => {
      const value = faker.number.int({ min: 15, max: 80 });
      const percentage = faker.number.float({ min: 8, max: 35, multipleOf: 0.1 });
      
      return {
        name: level,
        value,
        percentage
      };
    });
  }

  getSalaryGapByCategory(filters: FilterOptions): any[] {
    const categories = ['Direction', 'Cadres', 'Agents maîtrise', 'Employés', 'Ouvriers'];
    
    return categories.map(category => {
      const gapPercentage = faker.number.float({ min: -15, max: 15, multipleOf: 0.1 });
      const gapPercentageN1 = filters.compareWith ? faker.number.float({ min: -15, max: 15, multipleOf: 0.1 }) : null;
      
      return {
        category,
        gapPercentage,
        ...(gapPercentageN1 && { gapPercentageN1 })
      };
    });
  }

  getGenderRatioByDepartment(filters: FilterOptions): any[] {
    const departments = this.getDepartments();
    
    return departments.map(department => {
      const menPercentage = faker.number.float({ min: 30, max: 70, multipleOf: 0.1 });
      const womenPercentage = 100 - menPercentage;
      const menPercentageN1 = filters.compareWith ? faker.number.float({ min: 30, max: 70, multipleOf: 0.1 }) : null;
      const womenPercentageN1 = menPercentageN1 ? 100 - menPercentageN1 : null;
      
      return {
        department,
        menPercentage,
        womenPercentage,
        ...(menPercentageN1 && { menPercentageN1 }),
        ...(womenPercentageN1 && { womenPercentageN1 })
      };
    });
  }

  getGenderRatioByLevel(filters: FilterOptions): any[] {
    const levels = ['Manager', 'Collaborateur', 'Stagiaire/Alternant'];
    
    return levels.map(level => {
      const menPercentage = faker.number.float({ min: 25, max: 75, fractionDigits: 1 });
      const womenPercentage = 100 - menPercentage;
      
      return {
        level,
        menPercentage,
        womenPercentage,
        ...(filters.compareWith && {
          menPercentageN1: faker.number.float({ min: 25, max: 75, fractionDigits: 1 }),
          womenPercentageN1: faker.number.float({ min: 25, max: 75, fractionDigits: 1 })
        })
      };
    });
  }

  // Méthodes pour les détails de masse salariale
  getSalaryEvolution(filters: FilterOptions): any[] {
    const periods = [];
    const currentDate = new Date();
    
    // Générer 12 mois de données
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
      
      periods.push({
        period: month,
        value: faker.number.float({ min: 800000, max: 1200000, multipleOf: 1000 })
      });
    }
    
    return periods;
  }

  getSalaryByAgency(filters: FilterOptions): any[] {
    const agencies = this.getAgencies();
    
    return agencies.map(agency => ({
      agency,
      value: faker.number.float({ min: 150000, max: 300000, multipleOf: 1000 })
    }));
  }

  getSalaryByDepartment(filters: FilterOptions): any[] {
    const departments = this.getDepartments();
    
    return departments.map(department => ({
      department,
      value: faker.number.float({ min: 120000, max: 280000, multipleOf: 1000 })
    }));
  }

  getSalaryBySeniority(filters: FilterOptions): any[] {
    const seniorityLevels = [
      { name: 'Juniors (0-2 ans)', value: faker.number.float({ min: 180000, max: 250000, multipleOf: 1000 }) },
      { name: 'Intermédiaires (3-7 ans)', value: faker.number.float({ min: 280000, max: 380000, multipleOf: 1000 }) },
      { name: 'Seniors (8+ ans)', value: faker.number.float({ min: 320000, max: 450000, multipleOf: 1000 }) }
    ];
    
    return seniorityLevels;
  }

  getSalaryByAge(filters: FilterOptions): any[] {
    const ageGroups = ['18-25 ans', '26-35 ans', '36-45 ans', '46-55 ans', '56-65 ans'];
    
    return ageGroups.map(ageGroup => ({
      ageGroup,
      value: faker.number.float({ min: 120000, max: 350000, multipleOf: 1000 })
    }));
  }
}
