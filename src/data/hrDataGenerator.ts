
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

export interface GeneratedHRData {
  employees: Employee[];
  expenses: Expense[];
}

export const generateHRData = (): GeneratedHRData => {
  const employees: Employee[] = [];
  const expenses: Expense[] = [];

  // Départements et postes réalistes
  const departments = [
    'Ressources Humaines',
    'Développement',
    'Marketing',
    'Ventes',
    'Finance',
    'Operations',
    'Support Client',
    'Direction'
  ];

  // Agences réalistes
  const agencies = [
    'Paris Siège',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Nantes',
    'Bordeaux',
    'Lille',
    'Nice',
    'Strasbourg',
    'Rennes'
  ];

  const positionsByDepartment: Record<string, string[]> = {
    'Ressources Humaines': ['DRH', 'Chargé RH', 'Assistant RH', 'Responsable Formation'],
    'Développement': ['Lead Developer', 'Développeur Frontend', 'Développeur Backend', 'DevOps', 'QA Engineer'],
    'Marketing': ['Directeur Marketing', 'Chef de Produit', 'Chargé Marketing', 'Community Manager'],
    'Ventes': ['Directeur Commercial', 'Responsable Ventes', 'Commercial', 'Account Manager'],
    'Finance': ['Directeur Financier', 'Contrôleur de Gestion', 'Comptable', 'Analyste Financier'],
    'Operations': ['Directeur Operations', 'Chef de Projet', 'Coordinateur', 'Analyste Process'],
    'Support Client': ['Responsable Support', 'Technicien Support', 'Customer Success'],
    'Direction': ['PDG', 'Directeur Général', 'Directeur Adjoint']
  };

  // Noms français réalistes
  const firstNames = [
    'Marie', 'Pierre', 'Sophie', 'Jean', 'Camille', 'Thomas', 'Emma', 'Nicolas',
    'Julie', 'Antoine', 'Clara', 'Maxime', 'Léa', 'Paul', 'Sarah', 'Lucas',
    'Chloé', 'Alexandre', 'Manon', 'Julien', 'Laura', 'Romain', 'Océane', 'Mathieu',
    'Amélie', 'Kevin', 'Anaïs', 'Florian', 'Pauline', 'Adrien', 'Marine', 'Quentin'
  ];

  const lastNames = [
    'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand',
    'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David',
    'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Mercier',
    'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez', 'Legrand', 'Garnier', 'Faure'
  ];

  const nationalities = [
    'France', 'Espagne', 'Italie', 'Allemagne', 'Belgique', 'Suisse', 'Portugal', 
    'Royaume-Uni', 'Maroc', 'Algérie', 'Tunisie', 'Sénégal', 'Mali', 'Côte d\'Ivoire',
    'Canada', 'États-Unis', 'Brésil', 'Argentine', 'Chine', 'Japon', 'Inde', 'Russie'
  ];

  type EducationLevel = { weight: number; value: 'Doctorat' | 'Université Master' | 'Université Bachelor' | 'Haute école spécialisée Master' | 'Haute école spécialisée Bachelor' | 'Formation professionnelle supérieure Master' | 'Formation professionnelle supérieure Bachelor' | 'Formation professionnelle supérieure' | 'Brevet d\'enseignement' | 'Maturité' | 'Apprentissage complet' | 'Formation exclusivement interne' | 'Scolarité obligatoire' };

  const educationLevels: EducationLevel[] = [
    { weight: 3, value: 'Doctorat' },
    { weight: 12, value: 'Université Master' },
    { weight: 18, value: 'Université Bachelor' },
    { weight: 8, value: 'Haute école spécialisée Master' },
    { weight: 15, value: 'Haute école spécialisée Bachelor' },
    { weight: 10, value: 'Formation professionnelle supérieure Master' },
    { weight: 8, value: 'Formation professionnelle supérieure Bachelor' },
    { weight: 6, value: 'Formation professionnelle supérieure' },
    { weight: 4, value: 'Brevet d\'enseignement' },
    { weight: 5, value: 'Maturité' },
    { weight: 8, value: 'Apprentissage complet' },
    { weight: 2, value: 'Formation exclusivement interne' },
    { weight: 1, value: 'Scolarité obligatoire' }
  ];

  // Génération des employés
  for (let i = 0; i < 250; i++) {
    const department = faker.helpers.arrayElement(departments);
    const agency = faker.helpers.arrayElement(agencies);
    const position = faker.helpers.arrayElement(positionsByDepartment[department]);
    const firstName = faker.helpers.arrayElement(firstNames);
    const lastName = faker.helpers.arrayElement(lastNames);
    
    const status = faker.helpers.arrayElement(['active', 'inactive', 'terminated']);

    const employee: Employee = {
      id: `emp-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@entreprise.fr`,
      department,
      agency,
      position,
      salary: faker.number.int({ min: 30000, max: 120000 }),
      hireDate: faker.date.between({ from: '2020-01-01', to: '2024-01-01' }),
      terminationDate: status === 'terminated' ? faker.date.between({ from: '2024-01-01', to: '2024-12-31' }) : undefined,
      status: status,
      performanceScore: faker.number.int({ min: 1, max: 5 }),
      trainingHours: faker.number.int({ min: 0, max: 80 }),
      remoteWork: faker.datatype.boolean({ probability: 0.6 }),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, France`,
      workingTimeRate: faker.helpers.arrayElement([1.0, 0.8, 0.6, 0.5]),
      gender: faker.helpers.arrayElement(['homme', 'femme']),
      birthDate: faker.date.birthdate({ min: 22, max: 65, mode: 'age' }),
      nationality: faker.helpers.arrayElement(['France', ...nationalities.slice(1)]),
      educationLevel: faker.helpers.arrayElement([
        'Doctorat', 'Université Master', 'Université Bachelor', 
        'Haute école spécialisée Master', 'Haute école spécialisée Bachelor',
        'Formation professionnelle supérieure Master', 'Formation professionnelle supérieure Bachelor',
        'Formation professionnelle supérieure', 'Brevet d\'enseignement', 'Maturité',
        'Apprentissage complet', 'Formation exclusivement interne', 'Scolarité obligatoire'
      ])
    };
    
    employees.push(employee);
  }

  // Génération des dépenses RH
  const expenseCategories = ['repas', 'transport', 'formation', 'materiel'];
  
  for (let i = 0; i < 500; i++) {
    const category = faker.helpers.arrayElement(expenseCategories);
    let amount: number;
    let description: string;

    switch (category) {
      case 'repas':
        amount = faker.number.int({ min: 8, max: 35 });
        description = `Repas d'équipe - ${faker.helpers.arrayElement(['Restaurant', 'Traiteur', 'Cantine'])}`;
        break;
      case 'transport':
        amount = faker.number.int({ min: 15, max: 200 });
        description = `Frais de transport - ${faker.helpers.arrayElement(['Train', 'Avion', 'Taxi', 'Essence'])}`;
        break;
      case 'formation':
        amount = faker.number.int({ min: 200, max: 3000 });
        description = `Formation professionnelle - ${faker.helpers.arrayElement(['Certification', 'Séminaire', 'E-learning', 'Conférence'])}`;
        break;
      case 'materiel':
        amount = faker.number.int({ min: 50, max: 1500 });
        description = `Matériel bureau - ${faker.helpers.arrayElement(['Ordinateur', 'Mobilier', 'Fournitures', 'Logiciels'])}`;
        break;
      default:
        amount = 0;
        description = 'Dépense divers';
    }

    const expense: Expense = {
      id: `exp-${i + 1}`,
      category,
      amount,
      date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }),
      description
    };
    
    expenses.push(expense);
  }

  return { employees, expenses };
};
