
import { HRData, Employee, Absence, Task, Document } from '../data/hrDataGenerator';

export interface KPIData {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  trend: number;
  comparison: 'higher' | 'lower' | 'equal';
  insight: string;
  category: 'positive' | 'negative' | 'neutral';
}

export interface FilterOptions {
  period: 'month' | 'quarter' | 'year';
  department?: string;
  startDate?: string;
  endDate?: string;
  compareWith?: 'previous' | 'year-ago';
}

export class HRAnalytics {
  private data: HRData;

  constructor(data: HRData) {
    this.data = data;
  }

  // 1. Taux d'absentéisme global
  calculateAbsenteeismRate(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    let absences = this.data.absences;

    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
      const employeeIds = employees.map(emp => emp.id);
      absences = absences.filter(abs => employeeIds.includes(abs.employeeId));
    }

    const totalAbsenceDays = absences.reduce((sum, abs) => sum + abs.days, 0);
    const totalWorkingDays = employees.length * 220; // 220 jours ouvrés par an
    const rate = (totalAbsenceDays / totalWorkingDays) * 100;

    const previousRate = rate * (0.9 + Math.random() * 0.2); // Simulation
    const trend = ((rate - previousRate) / previousRate) * 100;

    return {
      id: 'absenteeism',
      name: 'Taux d\'absentéisme',
      value: Math.round(rate * 100) / 100,
      unit: '%',
      trend: Math.round(trend * 100) / 100,
      comparison: trend > 0 ? 'higher' : 'lower',
      insight: this.generateAbsenteeismInsight(rate, trend, filters.department),
      category: trend > 5 ? 'negative' : trend < -2 ? 'positive' : 'neutral'
    };
  }

  // 2. Turnover global
  calculateTurnover(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees;
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const inactiveEmployees = employees.filter(emp => emp.status === 'inactive').length;
    const totalEmployees = employees.length;
    const turnoverRate = (inactiveEmployees / totalEmployees) * 100;

    const previousRate = turnoverRate * (0.8 + Math.random() * 0.4);
    const trend = ((turnoverRate - previousRate) / previousRate) * 100;

    return {
      id: 'turnover',
      name: 'Turnover (12 mois)',
      value: Math.round(turnoverRate * 100) / 100,
      unit: '%',
      trend: Math.round(trend * 100) / 100,
      comparison: trend > 0 ? 'higher' : 'lower',
      insight: this.generateTurnoverInsight(turnoverRate, trend, filters.department),
      category: turnoverRate > 15 ? 'negative' : turnoverRate < 8 ? 'positive' : 'neutral'
    };
  }

  // 3. Effectif total actif
  calculateActiveHeadcount(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const headcount = employees.length;
    const previousHeadcount = Math.floor(headcount * (0.95 + Math.random() * 0.1));
    const trend = headcount - previousHeadcount;

    return {
      id: 'headcount',
      name: 'Effectif total actif',
      value: headcount,
      unit: 'collaborateurs',
      trend: trend,
      comparison: trend > 0 ? 'higher' : trend < 0 ? 'lower' : 'equal',
      insight: this.generateHeadcountInsight(headcount, trend, filters.department),
      category: trend > 0 ? 'positive' : trend < -5 ? 'negative' : 'neutral'
    };
  }

  // 4. Taux d'utilisation du temps de travail
  calculateWorkTimeUtilization(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const employeeIds = employees.map(emp => emp.id);
    const overtimeData = this.data.overtime.filter(ot => employeeIds.includes(ot.employeeId));
    const totalOvertimeHours = overtimeData.reduce((sum, ot) => sum + ot.hours, 0);
    const totalRegularHours = employees.length * 35 * 52; // 35h/semaine * 52 semaines
    const utilizationRate = ((totalRegularHours + totalOvertimeHours) / totalRegularHours) * 100;

    const previousRate = utilizationRate * (0.98 + Math.random() * 0.04);
    const trend = ((utilizationRate - previousRate) / previousRate) * 100;

    return {
      id: 'work-utilization',
      name: 'Taux d\'utilisation du temps',
      value: Math.round(utilizationRate * 100) / 100,
      unit: '%',
      trend: Math.round(trend * 100) / 100,
      comparison: trend > 0 ? 'higher' : 'lower',
      insight: this.generateWorkUtilizationInsight(utilizationRate, trend),
      category: utilizationRate > 110 ? 'negative' : utilizationRate > 100 ? 'neutral' : 'positive'
    };
  }

  // 5. Jours moyens de télétravail
  calculateRemoteWorkDays(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const avgRemoteDays = employees.reduce((sum, emp) => sum + (emp.remoteWorkDays || 0), 0) / employees.length;
    const previousAvg = avgRemoteDays * (0.9 + Math.random() * 0.2);
    const trend = avgRemoteDays - previousAvg;

    return {
      id: 'remote-work',
      name: 'Jours moyens de télétravail',
      value: Math.round(avgRemoteDays * 10) / 10,
      unit: 'jours/mois',
      trend: Math.round(trend * 10) / 10,
      comparison: trend > 0 ? 'higher' : trend < 0 ? 'lower' : 'equal',
      insight: this.generateRemoteWorkInsight(avgRemoteDays, trend, filters.department),
      category: 'neutral'
    };
  }

  // 6. Durée moyenne d'onboarding
  calculateOnboardingDuration(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const avgOnboardingDays = employees.reduce((sum, emp) => sum + (emp.onboardingCompletedDays || 0), 0) / employees.length;
    const previousAvg = avgOnboardingDays * (0.9 + Math.random() * 0.2);
    const trend = avgOnboardingDays - previousAvg;

    return {
      id: 'onboarding',
      name: 'Durée moyenne d\'onboarding',
      value: Math.round(avgOnboardingDays * 10) / 10,
      unit: 'jours',
      trend: Math.round(trend * 10) / 10,
      comparison: trend > 0 ? 'higher' : trend < 0 ? 'lower' : 'equal',
      insight: this.generateOnboardingInsight(avgOnboardingDays, trend),
      category: avgOnboardingDays > 20 ? 'negative' : avgOnboardingDays < 10 ? 'positive' : 'neutral'
    };
  }

  // 7. Dépenses RH par catégorie
  calculateHRExpenses(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const totalSalaries = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const employeeIds = employees.map(emp => emp.id);
    const expenses = this.data.expenses.filter(exp => employeeIds.includes(exp.employeeId) && exp.status === 'validé');
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const training = this.data.training.filter(tr => employeeIds.includes(tr.employeeId));
    const trainingCosts = training.reduce((sum, tr) => sum + tr.cost, 0);

    const totalHRCosts = totalSalaries + totalExpenses + trainingCosts;
    const previousCosts = totalHRCosts * (0.95 + Math.random() * 0.1);
    const trend = ((totalHRCosts - previousCosts) / previousCosts) * 100;

    return {
      id: 'hr-expenses',
      name: 'Dépenses RH totales',
      value: Math.round(totalHRCosts / 1000),
      unit: 'K€',
      trend: Math.round(trend * 100) / 100,
      comparison: trend > 0 ? 'higher' : 'lower',
      insight: this.generateExpensesInsight(totalHRCosts, trend),
      category: trend > 10 ? 'negative' : trend < 5 ? 'positive' : 'neutral'
    };
  }

  // 8. Âge moyen & ancienneté moyenne
  calculateAgeAndSeniority(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const avgAge = employees.reduce((sum, emp) => sum + emp.age, 0) / employees.length;
    const currentDate = new Date();
    const avgSeniority = employees.reduce((sum, emp) => {
      const hireDate = new Date(emp.hireDate);
      const yearsOfService = (currentDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return sum + yearsOfService;
    }, 0) / employees.length;

    return {
      id: 'age-seniority',
      name: 'Âge moyen',
      value: `${Math.round(avgAge)} ans (${Math.round(avgSeniority * 10) / 10} ans d'ancienneté)`,
      unit: '',
      trend: 0,
      comparison: 'equal',
      insight: this.generateAgeSeniorityInsight(avgAge, avgSeniority),
      category: 'neutral'
    };
  }

  // 9. % de tâches RH complétées dans les délais
  calculateTaskCompletionRate(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const employeeIds = employees.map(emp => emp.id);
    const tasks = this.data.tasks.filter(task => employeeIds.includes(task.employeeId));
    const completedTasks = tasks.filter(task => task.status === 'complétée').length;
    const completionRate = (completedTasks / tasks.length) * 100;

    const previousRate = completionRate * (0.9 + Math.random() * 0.2);
    const trend = ((completionRate - previousRate) / previousRate) * 100;

    return {
      id: 'task-completion',
      name: 'Tâches RH complétées',
      value: Math.round(completionRate * 100) / 100,
      unit: '%',
      trend: Math.round(trend * 100) / 100,
      comparison: trend > 0 ? 'higher' : 'lower',
      insight: this.generateTaskCompletionInsight(completionRate, trend),
      category: completionRate > 85 ? 'positive' : completionRate < 70 ? 'negative' : 'neutral'
    };
  }

  // 10. Taux de complétion des dossiers collaborateurs
  calculateDocumentCompletionRate(filters: FilterOptions = { period: 'year' }): KPIData {
    let employees = this.data.employees.filter(emp => emp.status === 'active');
    
    if (filters.department) {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    const employeeIds = employees.map(emp => emp.id);
    const documents = this.data.documents.filter(doc => employeeIds.includes(doc.employeeId));
    
    const totalDocuments = documents.length * 5; // 5 documents par employé
    const completedDocuments = documents.reduce((sum, doc) => {
      return sum + (doc.contractSigned ? 1 : 0) + (doc.idCardProvided ? 1 : 0) + 
             (doc.bankDetailsProvided ? 1 : 0) + (doc.evaluationCompleted ? 1 : 0) + 
             (doc.medicalCheckCompleted ? 1 : 0);
    }, 0);
    
    const completionRate = (completedDocuments / totalDocuments) * 100;
    const previousRate = completionRate * (0.95 + Math.random() * 0.1);
    const trend = ((completionRate - previousRate) / previousRate) * 100;

    return {
      id: 'document-completion',
      name: 'Dossiers collaborateurs complets',
      value: Math.round(completionRate * 100) / 100,
      unit: '%',
      trend: Math.round(trend * 100) / 100,
      comparison: trend > 0 ? 'higher' : 'lower',
      insight: this.generateDocumentCompletionInsight(completionRate, trend),
      category: completionRate > 90 ? 'positive' : completionRate < 80 ? 'negative' : 'neutral'
    };
  }

  // Méthodes privées pour générer les insights IA
  private generateAbsenteeismInsight(rate: number, trend: number, department?: string): string {
    const deptText = department ? ` dans le département ${department}` : '';
    if (trend > 5) {
      return `⚠️ L'absentéisme a augmenté de ${Math.abs(trend).toFixed(1)}%${deptText}. Il pourrait être lié aux congés d'été ou à des problèmes de santé saisonniers.`;
    } else if (trend < -5) {
      return `✅ Excellente baisse de l'absentéisme (-${Math.abs(trend).toFixed(1)}%)${deptText}. Les actions de prévention semblent porter leurs fruits.`;
    }
    return `📊 L'absentéisme reste stable${deptText} avec ${rate.toFixed(1)}%, dans la moyenne du secteur.`;
  }

  private generateTurnoverInsight(rate: number, trend: number, department?: string): string {
    const deptText = department ? ` dans le département ${department}` : '';
    if (rate > 15) {
      return `🚨 Turnover élevé (${rate.toFixed(1)}%)${deptText}. Recommandation : analyser les entretiens de départ et améliorer la rétention.`;
    } else if (rate < 8) {
      return `🎯 Excellent taux de rétention${deptText}. L'entreprise maintient ses talents efficacement.`;
    }
    return `📈 Turnover modéré${deptText}. Surveillance recommandée pour identifier les signaux d'alerte.`;
  }

  private generateHeadcountInsight(headcount: number, trend: number, department?: string): string {
    const deptText = department ? ` dans le département ${department}` : '';
    if (trend > 5) {
      return `📈 Croissance forte des effectifs (+${trend})${deptText}. Vérifier que l'onboarding suit le rythme.`;
    } else if (trend < -5) {
      return `📉 Réduction significative des effectifs (${trend})${deptText}. Impact possible sur la charge de travail.`;
    }
    return `⚖️ Effectifs stables${deptText} avec ${headcount} collaborateurs actifs.`;
  }

  private generateWorkUtilizationInsight(rate: number, trend: number): string {
    if (rate > 110) {
      return `⚠️ Surcharge de travail détectée (${rate.toFixed(1)}%). Risque de burnout - envisager du recrutement ou réorganisation.`;
    } else if (rate < 95) {
      return `📊 Sous-utilisation du temps de travail. Opportunité d'optimisation ou de développement de nouveaux projets.`;
    }
    return `✅ Utilisation optimale du temps de travail (${rate.toFixed(1)}%). Bon équilibre charge/capacité.`;
  }

  private generateRemoteWorkInsight(days: number, trend: number, department?: string): string {
    const deptText = department ? ` dans le département ${department}` : '';
    if (days > 10) {
      return `🏠 Forte adoption du télétravail (${days.toFixed(1)} jours/mois)${deptText}. Vérifier l'impact sur la collaboration.`;
    } else if (days < 3) {
      return `🏢 Faible utilisation du télétravail${deptText}. Opportunité d'améliorer la flexibilité.`;
    }
    return `⚖️ Équilibre télétravail/présentiel bien dosé${deptText} (${days.toFixed(1)} jours/mois).`;
  }

  private generateOnboardingInsight(days: number, trend: number): string {
    if (days > 20) {
      return `🐌 Onboarding long (${days.toFixed(1)} jours). Risque de démotivation - optimiser le processus d'intégration.`;
    } else if (days < 10) {
      return `⚡ Onboarding rapide et efficace. Excellent time-to-productivity pour les nouveaux collaborateurs.`;
    }
    return `👍 Durée d'onboarding raisonnable (${days.toFixed(1)} jours). Processus d'intégration bien calibré.`;
  }

  private generateExpensesInsight(amount: number, trend: number): string {
    if (trend > 10) {
      return `💰 Hausse significative des coûts RH (+${trend.toFixed(1)}%). Analyser les postes de dépenses principaux.`;
    } else if (trend < -5) {
      return `💡 Optimisation réussie des coûts RH (-${Math.abs(trend).toFixed(1)}%). Bonne maîtrise budgétaire.`;
    }
    return `📊 Évolution maîtrisée des dépenses RH. Budget en ligne avec les prévisions.`;
  }

  private generateAgeSeniorityInsight(age: number, seniority: number): string {
    if (age > 45) {
      return `👥 Population expérimentée (${age.toFixed(0)} ans). Prévoir les futurs départs en retraite et transmission des savoirs.`;
    } else if (age < 35) {
      return `🌟 Équipe jeune et dynamique. Opportunité de développement des talents et évolution de carrière.`;
    }
    return `⚖️ Bon équilibre générationnel avec une ancienneté moyenne de ${seniority.toFixed(1)} ans.`;
  }

  private generateTaskCompletionInsight(rate: number, trend: number): string {
    if (rate > 85) {
      return `✅ Excellente performance opérationnelle RH (${rate.toFixed(1)}% de réalisation). Processus bien rodés.`;
    } else if (rate < 70) {
      return `⚠️ Retards dans l'exécution des tâches RH. Identifier les goulets d'étranglement et prioriser.`;
    }
    return `📊 Performance RH correcte mais perfectible. Marge d'amélioration sur l'efficacité des processus.`;
  }

  private generateDocumentCompletionInsight(rate: number, trend: number): string {
    if (rate > 90) {
      return `📋 Excellente complétude des dossiers (${rate.toFixed(1)}%). Administration RH rigoureuse et efficace.`;
    } else if (rate < 80) {
      return `📝 Dossiers incomplets (${rate.toFixed(1)}%). Risque de non-conformité - relancer les collaborateurs manquants.`;
    }
    return `📊 Niveau de complétude acceptable. Quelques rappels à prévoir pour finaliser les dossiers.`;
  }

  // Méthode principale pour obtenir tous les KPIs
  getAllKPIs(filters: FilterOptions = { period: 'year' }): KPIData[] {
    return [
      this.calculateAbsenteeismRate(filters),
      this.calculateTurnover(filters),
      this.calculateActiveHeadcount(filters),
      this.calculateWorkTimeUtilization(filters),
      this.calculateRemoteWorkDays(filters),
      this.calculateOnboardingDuration(filters),
      this.calculateHRExpenses(filters),
      this.calculateAgeAndSeniority(filters),
      this.calculateTaskCompletionRate(filters),
      this.calculateDocumentCompletionRate(filters)
    ];
  }

  // Insight global du board
  generateGlobalInsight(kpis: KPIData[], filters: FilterOptions): string {
    const negativeKPIs = kpis.filter(kpi => kpi.category === 'negative');
    const positiveKPIs = kpis.filter(kpi => kpi.category === 'positive');
    
    const deptText = filters.department ? ` dans le département ${filters.department}` : ' globalement';
    
    if (negativeKPIs.length > 3) {
      return `🚨 Situation préoccupante${deptText} : ${negativeKPIs.length} indicateurs en alerte. Prioriser les actions sur l'absentéisme et le turnover.`;
    } else if (positiveKPIs.length > 5) {
      return `🎯 Excellente performance RH${deptText} ! ${positiveKPIs.length} indicateurs au vert. L'organisation RH est efficace.`;
    } else {
      return `📊 Situation globale équilibrée${deptText}. Quelques axes d'amélioration identifiés, notamment sur les processus et la gestion du temps.`;
    }
  }
}
