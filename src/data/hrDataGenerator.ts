
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

const departments = ['IT', 'RH', 'Finance', 'Marketing', 'Commercial', 'Production', 'Logistique', 'Direction'];
const positions = {
  'IT': ['Développeur', 'Senior Developer', 'Tech Lead', 'DevOps', 'Data Analyst', 'Product Owner'],
  'RH': ['RH Généraliste', 'Chargé de recrutement', 'Responsable RH', 'Assistant RH'],
  'Finance': ['Comptable', 'Contrôleur de gestion', 'Directeur financier', 'Assistant comptable'],
  'Marketing': ['Chef de produit', 'Community Manager', 'Responsable Marketing', 'Chargé de communication'],
  'Commercial': ['Commercial', 'Responsable commercial', 'Business Developer', 'Account Manager'],
  'Production': ['Opérateur', 'Chef d\'équipe', 'Responsable production', 'Technicien'],
  'Logistique': ['Préparateur', 'Responsable logistique', 'Chauffeur-livreur', 'Magasinier'],
  'Direction': ['Directeur général', 'Directeur opérationnel', 'Assistant de direction']
};

const firstNames = {
  M: ['Pierre', 'Jean', 'Michel', 'Philippe', 'Alain', 'Nicolas', 'Christophe', 'Daniel', 'Julien', 'Thomas', 'Alexandre', 'David', 'Stéphane', 'Laurent', 'Sébastien'],
  F: ['Marie', 'Nathalie', 'Isabelle', 'Sylvie', 'Catherine', 'Françoise', 'Valérie', 'Christine', 'Sophie', 'Martine', 'Julie', 'Sandrine', 'Caroline', 'Patricia', 'Céline']
};

const lastNames = ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard'];

const managers = ['Bob Wilson', 'Sarah Connor', 'Mike Johnson', 'Lisa Anderson', 'Tom Brown', 'Emma Davis', 'John Smith', 'Anna Garcia'];

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
    const gender = Math.random() > 0.5 ? 'M' : 'F';
    const firstName = getRandomElement(firstNames[gender]);
    const lastName = getRandomElement(lastNames);
    const department = getRandomElement(departments);
    const position = getRandomElement(positions[department]);
    
    employees.push({
      id: i,
      name: `${firstName} ${lastName}`,
      age: Math.floor(Math.random() * 40) + 22,
      gender,
      department,
      position,
      salary: Math.floor(Math.random() * 80000) + 25000,
      hireDate: getRandomDate(new Date(2018, 0, 1), new Date(2024, 0, 1)),
      status: Math.random() > 0.05 ? 'active' : 'inactive',
      manager: getRandomElement(managers),
      evaluationScore: Math.round((Math.random() * 2 + 3) * 10) / 10,
      onboardingCompletedDays: Math.floor(Math.random() * 30) + 5,
      remoteWorkDays: Math.floor(Math.random() * 15)
    });
  }
  
  return employees;
}

function generateAbsences(employees: Employee[]): Absence[] {
  const absences: Absence[] = [];
  
  employees.forEach(employee => {
    const numAbsences = Math.floor(Math.random() * 6) + 1;
    
    for (let i = 0; i < numAbsences; i++) {
      absences.push({
        employeeId: employee.id,
        days: Math.floor(Math.random() * 20) + 1,
        type: getRandomElement(['vacation', 'sick', 'personal', 'training']),
        date: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31))
      });
    }
  });
  
  return absences;
}

function generateTraining(employees: Employee[]): Training[] {
  const courses = ['React Advanced', 'Leadership', 'Excel Expert', 'Communication', 'Sécurité', 'Qualité', 'Management', 'Anglais'];
  const training: Training[] = [];
  
  employees.forEach(employee => {
    if (Math.random() > 0.3) {
      training.push({
        employeeId: employee.id,
        course: getRandomElement(courses),
        hours: Math.floor(Math.random() * 40) + 8,
        cost: Math.floor(Math.random() * 2000) + 500,
        completed: Math.random() > 0.2
      });
    }
  });
  
  return training;
}

function generateOvertime(employees: Employee[]): Overtime[] {
  const overtime: Overtime[] = [];
  const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
  
  employees.forEach(employee => {
    months.forEach(month => {
      if (Math.random() > 0.6) {
        overtime.push({
          employeeId: employee.id,
          month,
          hours: Math.floor(Math.random() * 20) + 1
        });
      }
    });
  });
  
  return overtime;
}

function generateExpenses(employees: Employee[]): Expense[] {
  const expenses: Expense[] = [];
  
  employees.forEach(employee => {
    const numExpenses = Math.floor(Math.random() * 10) + 1;
    
    for (let i = 0; i < numExpenses; i++) {
      expenses.push({
        employeeId: employee.id,
        date: getRandomDate(new Date(2024, 0, 1), new Date(2024, 5, 30)),
        category: getRandomElement(['repas', 'transport', 'formation', 'materiel']),
        amount: Math.round((Math.random() * 200 + 10) * 100) / 100,
        status: getRandomElement(['validé', 'en_attente', 'refusé'])
      });
    }
  });
  
  return expenses;
}

function generateTasks(employees: Employee[]): Task[] {
  const tasks: Task[] = [];
  const taskTypes = {
    onboarding: ['Signer contrat', 'Fournir justificatifs', 'Formation sécurité', 'Visite médicale'],
    administrative: ['Mettre à jour dossier', 'Valider congés', 'Compléter évaluation'],
    evaluation: ['Entretien annuel', 'Définir objectifs', 'Bilan compétences']
  };
  
  employees.forEach(employee => {
    const numTasks = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < numTasks; i++) {
      const category = getRandomElement(['onboarding', 'administrative', 'evaluation'] as const);
      tasks.push({
        employeeId: employee.id,
        task: getRandomElement(taskTypes[category]),
        dueDate: getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
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
    contractSigned: Math.random() > 0.05,
    idCardProvided: Math.random() > 0.1,
    bankDetailsProvided: Math.random() > 0.08,
    evaluationCompleted: Math.random() > 0.15,
    medicalCheckCompleted: Math.random() > 0.12
  }));
}

export function generateHRData(): HRData {
  console.log('Génération des données RH...');
  
  const employees = generateEmployees();
  const absences = generateAbsences(employees);
  const training = generateTraining(employees);
  const overtime = generateOvertime(employees);
  const expenses = generateExpenses(employees);
  const tasks = generateTasks(employees);
  const documents = generateDocuments(employees);
  
  console.log(`Données générées: ${employees.length} employés, ${absences.length} absences, ${training.length} formations`);
  
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
