import { faker } from '@faker-js/faker';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  performanceScore: number;
  trainingHours: number;
  remoteWork: boolean;
  address: string;
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
  trend: number;
  comparison: 'higher' | 'lower' | 'stable';
  category: 'positive' | 'negative' | 'neutral';
  insight: string;
}

export interface FilterOptions {
  period: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  department?: string;
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

    return {
      id: 'absenteeism',
      name: 'Taux d\'absentéisme',
      value: absenteeismRate.toFixed(1),
      unit: '%',
      trend: faker.number.int({ min: -5, max: 5 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: absenteeismRate > 5 ? 'negative' : 'positive',
      insight: `Le taux d'absentéisme est de ${absenteeismRate.toFixed(1)}%. ${absenteeismRate > 5 ? '⚠️ Il est supérieur à la moyenne et nécessite une attention particulière.' : '✅ Il est dans la moyenne acceptable.'}`
    };
  }

  getTurnoverRate(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const terminatedEmployees = employees.filter(employee => employee.status === 'terminated').length;
    const turnoverRate = (terminatedEmployees / employees.length) * 100;

    return {
      id: 'turnover',
      name: 'Turnover',
      value: turnoverRate.toFixed(1),
      unit: '%',
      trend: faker.number.int({ min: -5, max: 5 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: turnoverRate > 10 ? 'negative' : 'positive',
      insight: `Le taux de turnover est de ${turnoverRate.toFixed(1)}%. ${turnoverRate > 10 ? '🚨 Il est élevé et pourrait indiquer des problèmes de rétention.' : '📈 Il reste dans une fourchette acceptable.'}`
    };
  }

  getHeadcount(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const activeEmployees = employees.filter(employee => employee.status === 'active').length;

    return {
      id: 'headcount',
      name: 'Effectif actif',
      value: activeEmployees,
      unit: 'collaborateurs',
      trend: faker.number.int({ min: -10, max: 10 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: activeEmployees < 100 ? 'negative' : 'positive',
      insight: `L'effectif actif est de ${activeEmployees} collaborateurs. ${activeEmployees < 100 ? '⚠️ L\'effectif est réduit.' : '👥 L\'équipe maintient une taille stable.'}`
    };
  }

  getWorkforceUtilization(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const totalHours = employees.reduce((sum, employee) => sum + employee.trainingHours, 0);
    const utilizationRate = (totalHours / (employees.length * 40)) * 100;

    return {
      id: 'work-utilization',
      name: 'Utilisation du temps',
      value: utilizationRate.toFixed(1),
      unit: '%',
      trend: faker.number.int({ min: -5, max: 5 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: utilizationRate < 80 ? 'negative' : 'positive',
      insight: `Le taux d'utilisation du temps est de ${utilizationRate.toFixed(1)}%. ${utilizationRate < 80 ? 'Il est inférieur à la moyenne.' : 'Il est dans la moyenne.'}`
    };
  }

  getRemoteWorkAdoption(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const remoteEmployees = employees.filter(employee => employee.remoteWork).length;
    const remoteWorkAdoptionRate = (remoteEmployees / employees.length) * 100;

    return {
      id: 'remote-work',
      name: 'Télétravail',
      value: remoteWorkAdoptionRate.toFixed(1),
      unit: '%',
      trend: faker.number.int({ min: -5, max: 5 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: remoteWorkAdoptionRate < 20 ? 'negative' : 'positive',
      insight: `Le taux d'adoption du télétravail est de ${remoteWorkAdoptionRate.toFixed(1)}%. ${remoteWorkAdoptionRate < 20 ? 'Il est inférieur à la moyenne.' : 'Il est dans la moyenne.'}`
    };
  }

  getOnboardingDuration(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const onboardingDuration = employees.reduce((sum, employee) => {
      const hireDate = new Date(employee.hireDate);
      const now = new Date();
      const diff = now.getTime() - hireDate.getTime();
      return sum + (diff / (1000 * 3600 * 24));
    }, 0) / employees.length;

    return {
      id: 'onboarding',
      name: 'Durée d\'onboarding',
      value: onboardingDuration.toFixed(0),
      unit: 'jours',
      trend: faker.number.int({ min: -5, max: 5 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: onboardingDuration > 30 ? 'negative' : 'positive',
      insight: `La durée moyenne d'onboarding est de ${onboardingDuration.toFixed(0)} jours. ${onboardingDuration > 30 ? 'Elle est supérieure à la moyenne.' : 'Elle est dans la moyenne.'}`
    };
  }

  getHRExpenses(filters: FilterOptions): KPIData {
    const totalExpenses = this.data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const previousTotal = totalExpenses * 0.95;
    const trend = ((totalExpenses - previousTotal) / previousTotal) * 100;
    
    return {
      id: 'hr-expenses',
      name: 'Dépenses RH totales',
      value: Math.round(totalExpenses),
      unit: '€',
      trend: Math.round(trend),
      comparison: trend > 0 ? 'higher' : trend < 0 ? 'lower' : 'stable',
      category: trend > 15 ? 'negative' : trend > 5 ? 'neutral' : 'positive',
      insight: `💰 Budget RH de ${Math.round(totalExpenses).toLocaleString()}€ cette période. ${
        trend > 0 
          ? `📈 Augmentation de ${Math.round(trend)}% par rapport à la période précédente, principalement due aux frais de formation et équipements.`
          : trend < 0
          ? `📉 Réduction de ${Math.abs(Math.round(trend))}% des dépenses par rapport à la période précédente.`
          : '📊 Dépenses stables par rapport à la période précédente.'
      }`
    };
  }

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

    return {
      id: 'age-seniority',
      name: 'Âge et ancienneté',
      value: `${averageAge.toFixed(0)} ans / ${averageSeniority.toFixed(0)} ans`,
      unit: '',
      trend: faker.number.int({ min: -5, max: 5 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: averageAge > 40 ? 'negative' : 'positive',
      insight: `L'âge moyen est de ${averageAge.toFixed(0)} ans et l'ancienneté moyenne est de ${averageSeniority.toFixed(0)} ans. ${averageAge > 40 ? 'L\'âge moyen est supérieur à la moyenne.' : 'L\'âge moyen est dans la moyenne.'}`
    };
  }

  getTaskCompletionRate(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const completedTasks = employees.reduce((sum, employee) => sum + faker.number.int({ min: 0, max: 10 }), 0);
    const totalTasks = employees.length * 10;
    const completionRate = (completedTasks / totalTasks) * 100;

    return {
      id: 'task-completion',
      name: 'Tâches RH',
      value: completionRate.toFixed(1),
      unit: '%',
      trend: faker.number.int({ min: -5, max: 5 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: completionRate < 80 ? 'negative' : 'positive',
      insight: `Le taux de complétion des tâches est de ${completionRate.toFixed(1)}%. ${completionRate < 80 ? 'Il est inférieur à la moyenne.' : 'Il est dans la moyenne.'}`
    };
  }

  getDocumentCompletionRate(filters: FilterOptions): KPIData {
    const employees = this.filterEmployees(filters);
    const completedDocuments = employees.reduce((sum, employee) => sum + faker.number.int({ min: 0, max: 5 }), 0);
    const totalDocuments = employees.length * 5;
    const completionRate = (completedDocuments / totalDocuments) * 100;

    return {
      id: 'document-completion',
      name: 'Dossiers collaborateurs',
      value: completionRate.toFixed(1),
      unit: '%',
      trend: faker.number.int({ min: -5, max: 5 }),
      comparison: faker.helpers.shuffle(['higher', 'lower', 'stable'])[0] as any,
      category: completionRate < 80 ? 'negative' : 'positive',
      insight: `Le taux de complétion des dossiers est de ${completionRate.toFixed(1)}%. ${completionRate < 80 ? 'Il est inférieur à la moyenne.' : 'Il est dans la moyenne.'}`
    };
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
      this.getWorkforceUtilization(filters),
      this.getRemoteWorkAdoption(filters),
      this.getOnboardingDuration(filters),
      this.getHRExpenses(filters),
      this.getAgeAndSeniority(filters),
      this.getTaskCompletionRate(filters),
      this.getDocumentCompletionRate(filters)
    ];
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

    if (filters.remoteWork !== undefined) {
      employees = employees.filter(employee => employee.remoteWork === filters.remoteWork);
    }

    return employees;
  }
}
