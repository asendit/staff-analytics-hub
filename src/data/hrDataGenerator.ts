
// Générateur de données RH réalistes pour 250 collaborateurs
export interface Employee {
  id: number;
  name: string;
  age: number;
  gender: 'M' | 'F';
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive';
  manager: string;
  evaluationScore: number;
  onboardingCompletedDays?: number;
  remoteWorkDays?: number;
}

export interface Absence {
  employeeId: number;
  days: number;
  type: 'vacation' | 'sick' | 'personal' | 'training';
  date: string;
}

export interface Training {
  employeeId: number;
  course: string;
  hours: number;
  cost: number;
  completed: boolean;
}

export interface Overtime {
  employeeId: number;
  month: string;
  hours: number;
}

export interface Expense {
  employeeId: number;
  date: string;
  category: 'repas' | 'transport' | 'formation' | 'materiel';
  amount: number;
  status: 'validé' | 'en_attente' | 'refusé';
}

export interface Task {
  employeeId: number;
  task: string;
  dueDate: string;
  status: 'complétée' | 'en_cours' | 'en_retard';
  category: 'onboarding' | 'administrative' | 'evaluation';
}

export interface Document {
  employeeId: number;
  contractSigned: boolean;
  idCardProvided: boolean;
  bankDetailsProvided: boolean;
  evaluationCompleted: boolean;
  medicalCheckCompleted: boolean;
}

export interface HRData {
  employees: Employee[];
  absences: Absence[];
  training: Training[];
  overtime: Overtime[];
  expenses: Expense[];
  tasks: Task[];
  documents: Document[];
}

const departments = ['Tech & Innovation', 'Relations Humaines', 'Comptabilité & Finance', 'Marketing Digital', 'Ventes & Business Dev', 'Opérations', 'Supply Chain', 'Direction Générale'];

const positions = {
  'Tech & Innovation': ['Développeur Full-Stack', 'Architecte Cloud', 'Data Scientist', 'UX/UI Designer', 'DevOps Engineer', 'CTO', 'Tech Lead'],
  'Relations Humaines': ['Business Partner RH', 'Talent Acquisition', 'Responsable Formation', 'HR Analytics', 'Gestionnaire Paie'],
  'Comptabilité & Finance': ['Analyste Financier', 'Contrôleur Budgétaire', 'CFO', 'Comptable Senior', 'Credit Manager'],
  'Marketing Digital': ['Growth Hacker', 'Social Media Manager', 'Brand Manager', 'SEO Specialist', 'Content Creator'],
  'Ventes & Business Dev': ['Account Executive', 'Sales Manager', 'Business Developer', 'Key Account Manager', 'Inside Sales'],
  'Opérations': ['Operations Manager', 'Process Analyst', 'Quality Manager', 'Project Coordinator', 'Operations Specialist'],
  'Supply Chain': ['Procurement Manager', 'Logistics Coordinator', 'Supply Planner', 'Warehouse Manager', 'Transport Coordinator'],
  'Direction Générale': ['CEO', 'COO', 'Directeur Stratégie', 'Executive Assistant', 'Chief Innovation Officer']
};

const firstNames = {
  M: ['Lucas', 'Hugo', 'Théo', 'Antoine', 'Maxime', 'Romain', 'Alexandre', 'Quentin', 'Adrien', 'Kevin', 'Florian', 'Nathan', 'Clément', 'Benjamin', 'Gabriel'],
  F: ['Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Lina', 'Léa', 'Manon', 'Zoé', 'Clara', 'Camille', 'Sarah', 'Inès', 'Juliette', 'Océane']
};

const lastNames = ['Lefevre', 'Mercier', 'Garnier', 'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas', 'Perrin', 'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin'];

const managers = ['Sophie Delacroix', 'Marc Beaumont', 'Julie Fontaine', 'Thomas Dubois', 'Nathalie Rousseau', 'Pierre Lecomte', 'Isabelle Moreau', 'François Girard'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateEmployees(): Employee[] {
  const employees: Employee[] = [];
  
  for (let i = 1; i <= 250; i++) {
    const gender = Math.random() > 0.45 ? 'M' : 'F';
    const firstName = getRandomElement(firstNames[gender]);
    const lastName = getRandomElement(lastNames);
    const department = getRandomElement(departments);
    const position = getRandomElement(positions[department as keyof typeof positions]);
    
    // Salaires plus réalistes selon les postes
    let baseSalary = 35000;
    if (position.includes('Senior') || position.includes('Manager')) baseSalary = 55000;
    if (position.includes('Lead') || position.includes('Director')) baseSalary = 70000;
    if (position.includes('CEO') || position.includes('CTO') || position.includes('CFO')) baseSalary = 120000;
    
    employees.push({
      id: i,
      name: `${firstName} ${lastName}`,
      age: Math.floor(Math.random() * 35) + 25,
      gender,
      department,
      position,
      salary: baseSalary + Math.floor(Math.random() * 30000),
      hireDate: getRandomDate(new Date(2019, 0, 1), new Date(2024, 2, 1)),
      status: Math.random() > 0.08 ? 'active' : 'inactive',
      manager: getRandomElement(managers),
      evaluationScore: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
      onboardingCompletedDays: Math.floor(Math.random() * 45) + 7,
      remoteWorkDays: Math.floor(Math.random() * 20)
    });
  }
  
  return employees;
}

function generateAbsences(employees: Employee[]): Absence[] {
  const absences: Absence[] = [];
  
  employees.forEach(employee => {
    const numAbsences = Math.floor(Math.random() * 8) + 2;
    
    for (let i = 0; i < numAbsences; i++) {
      absences.push({
        employeeId: employee.id,
        days: Math.floor(Math.random() * 15) + 1,
        type: getRandomElement(['vacation', 'sick', 'personal', 'training']),
        date: getRandomDate(new Date(2023, 6, 1), new Date(2024, 11, 31))
      });
    }
  });
  
  return absences;
}

function generateTraining(employees: Employee[]): Training[] {
  const courses = ['Machine Learning Fundamentals', 'Agile Leadership', 'Advanced Excel & BI', 'Soft Skills & Communication', 'Cybersécurité', 'Lean Six Sigma', 'Digital Transformation', 'Business English', 'Design Thinking'];
  const training: Training[] = [];
  
  employees.forEach(employee => {
    if (Math.random() > 0.25) {
      training.push({
        employeeId: employee.id,
        course: getRandomElement(courses),
        hours: Math.floor(Math.random() * 50) + 12,
        cost: Math.floor(Math.random() * 3000) + 800,
        completed: Math.random() > 0.15
      });
    }
  });
  
  return training;
}

function generateOvertime(employees: Employee[]): Overtime[] {
  const overtime: Overtime[] = [];
  const months = ['2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08'];
  
  employees.forEach(employee => {
    months.forEach(month => {
      if (Math.random() > 0.55) {
        overtime.push({
          employeeId: employee.id,
          month,
          hours: Math.floor(Math.random() * 25) + 2
        });
      }
    });
  });
  
  return overtime;
}

function generateExpenses(employees: Employee[]): Expense[] {
  const expenses: Expense[] = [];
  
  employees.forEach(employee => {
    const numExpenses = Math.floor(Math.random() * 12) + 3;
    
    for (let i = 0; i < numExpenses; i++) {
      const category = getRandomElement(['repas', 'transport', 'formation', 'materiel']);
      let amount = 15;
      
      // Montants plus réalistes selon la catégorie
      switch(category) {
        case 'repas': amount = Math.round((Math.random() * 35 + 12) * 100) / 100; break;
        case 'transport': amount = Math.round((Math.random() * 150 + 25) * 100) / 100; break;
        case 'formation': amount = Math.round((Math.random() * 800 + 200) * 100) / 100; break;
        case 'materiel': amount = Math.round((Math.random() * 400 + 50) * 100) / 100; break;
      }
      
      expenses.push({
        employeeId: employee.id,
        date: getRandomDate(new Date(2024, 2, 1), new Date(2024, 7, 30)),
        category,
        amount,
        status: getRandomElement(['validé', 'en_attente', 'refusé'])
      });
    }
  });
  
  return expenses;
}

function generateTasks(employees: Employee[]): Task[] {
  const tasks: Task[] = [];
  const taskTypes = {
    onboarding: ['Signature contrat CDI', 'Remise badge et équipements', 'Formation sécurité obligatoire', 'Visite médicale d\'embauche', 'Présentation équipe'],
    administrative: ['Mise à jour profil SIRH', 'Validation planning congés', 'Entretien professionnel', 'Bilan formation annuel'],
    evaluation: ['Entretien annuel d\'évaluation', 'Définition objectifs N+1', 'Assessment 360°', 'Plan développement compétences']
  };
  
  employees.forEach(employee => {
    const numTasks = Math.floor(Math.random() * 6) + 3;
    
    for (let i = 0; i < numTasks; i++) {
      const category = getRandomElement(['onboarding', 'administrative', 'evaluation'] as const);
      tasks.push({
        employeeId: employee.id,
        task: getRandomElement(taskTypes[category]),
        dueDate: getRandomDate(new Date(2024, 3, 1), new Date(2024, 11, 31)),
        status: getRandomElement(['complétée', 'en_cours', 'en_retard']),
        category
      });
    }
  });
  
  return tasks;
}

function generateDocuments(employees: Employee[]): Document[] {
  return employees.map(employee => ({
    employeeId: employee.id,
    contractSigned: Math.random() > 0.03,
    idCardProvided: Math.random() > 0.07,
    bankDetailsProvided: Math.random() > 0.05,
    evaluationCompleted: Math.random() > 0.12,
    medicalCheckCompleted: Math.random() > 0.09
  }));
}

export function generateHRData(): HRData {
  console.log('Génération de nouvelles données RH...');
  
  const employees = generateEmployees();
  const absences = generateAbsences(employees);
  const training = generateTraining(employees);
  const overtime = generateOvertime(employees);
  const expenses = generateExpenses(employees);
  const tasks = generateTasks(employees);
  const documents = generateDocuments(employees);
  
  console.log(`Nouvelles données générées: ${employees.length} employés, ${absences.length} absences, ${training.length} formations`);
  
  return {
    employees,
    absences,
    training,
    overtime,
    expenses,
    tasks,
    documents
  };
}
