
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

  // Départements et postes réalistes - Version enrichie
  const departments = [
    'Direction Générale',
    'Ressources Humaines',
    'Développement & IT',
    'Marketing & Communication',
    'Ventes & Commercial',
    'Finance & Comptabilité',
    'Operations & Logistique',
    'Support Client',
    'Recherche & Développement',
    'Qualité & Conformité',
    'Juridique & Compliance',
    'Achats & Approvisionnements',
    'Production',
    'Maintenance',
    'Sécurité & Environnement',
    'Formation & Développement'
  ];

  // Agences réalistes - Version enrichie
  const agencies = [
    'Paris Siège',
    'Lyon Centre',
    'Marseille Sud',
    'Toulouse Midi-Pyrénées',
    'Nantes Atlantique',
    'Bordeaux Nouvelle-Aquitaine',
    'Lille Nord',
    'Nice Côte d\'Azur',
    'Strasbourg Grand-Est',
    'Rennes Bretagne',
    'Montpellier',
    'Clermont-Ferrand',
    'Dijon Bourgogne',
    'Rouen Normandie',
    'Grenoble Alpes',
    'Metz Lorraine',
    'Tours Centre-Val de Loire',
    'Caen',
    'Orléans',
    'Amiens Hauts-de-France'
  ];

  const positionsByDepartment: Record<string, string[]> = {
    'Direction Générale': ['PDG', 'Directeur Général', 'Directeur Adjoint', 'Secrétaire de Direction'],
    'Ressources Humaines': ['DRH', 'Directeur RH Adjoint', 'Responsable RH', 'Chargé RH', 'Assistant RH', 'Responsable Formation', 'Chargé Recrutement', 'Gestionnaire Paie', 'Responsable Relations Sociales'],
    'Développement & IT': ['CTO', 'Lead Developer', 'Architecte Logiciel', 'Développeur Senior', 'Développeur Frontend', 'Développeur Backend', 'Développeur Fullstack', 'DevOps Engineer', 'SysAdmin', 'QA Engineer', 'Testeur', 'UX/UI Designer', 'Product Owner', 'Scrum Master'],
    'Marketing & Communication': ['Directeur Marketing', 'Responsable Communication', 'Chef de Produit', 'Chargé Marketing Digital', 'Community Manager', 'Chargé Communication', 'Graphiste', 'Content Manager', 'SEO Specialist', 'Responsable Brand'],
    'Ventes & Commercial': ['Directeur Commercial', 'Directeur Régional', 'Responsable Ventes', 'Commercial Senior', 'Commercial', 'Account Manager', 'Business Developer', 'Chargé Clientèle', 'Commercial Terrain', 'Key Account Manager'],
    'Finance & Comptabilité': ['Directeur Financier', 'Contrôleur de Gestion', 'Responsable Comptabilité', 'Comptable Senior', 'Comptable', 'Assistant Comptable', 'Analyste Financier', 'Responsable Trésorerie', 'Auditeur Interne'],
    'Operations & Logistique': ['Directeur Operations', 'Responsable Logistique', 'Chef de Projet', 'Coordinateur Operations', 'Analyste Process', 'Supply Chain Manager', 'Gestionnaire Stock', 'Planificateur', 'Responsable Expédition'],
    'Support Client': ['Directeur Support', 'Responsable Support', 'Technicien Support Senior', 'Technicien Support', 'Customer Success Manager', 'Chargé Relation Client', 'Hotliner', 'Responsable Service Client'],
    'Recherche & Développement': ['Directeur R&D', 'Responsable Innovation', 'Ingénieur R&D', 'Chercheur', 'Technicien R&D', 'Chef de Projet R&D', 'Analyste Produit', 'Ingénieur Tests'],
    'Qualité & Conformité': ['Directeur Qualité', 'Responsable Qualité', 'Ingénieur Qualité', 'Technicien Qualité', 'Auditeur Qualité', 'Responsable Conformité', 'Chargé Normes'],
    'Juridique & Compliance': ['Directeur Juridique', 'Juriste Senior', 'Juriste', 'Compliance Officer', 'Assistant Juridique', 'Responsable Contrats'],
    'Achats & Approvisionnements': ['Directeur Achats', 'Responsable Achats', 'Acheteur Senior', 'Acheteur', 'Assistant Achats', 'Category Manager'],
    'Production': ['Directeur Production', 'Responsable Production', 'Chef d\'Équipe', 'Superviseur', 'Opérateur Production', 'Technicien Production', 'Contrôleur Production'],
    'Maintenance': ['Responsable Maintenance', 'Technicien Maintenance', 'Électricien', 'Mécanicien', 'Automaticien', 'Agent Maintenance'],
    'Sécurité & Environnement': ['Responsable HSE', 'Ingénieur Sécurité', 'Animateur Sécurité', 'Responsable Environnement', 'Agent Sécurité'],
    'Formation & Développement': ['Responsable Formation', 'Formateur', 'Ingénieur Pédagogique', 'Chargé Développement RH', 'Coach']
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

  // Fonction pour générer des salaires réalistes selon le poste et le département
  const generateSalaryForPosition = (department: string, position: string): number => {
    const baseSalaries: Record<string, number> = {
      // Direction
      'PDG': faker.number.int({ min: 150000, max: 300000 }),
      'Directeur Général': faker.number.int({ min: 120000, max: 200000 }),
      'CTO': faker.number.int({ min: 100000, max: 180000 }),
      'Directeur': faker.number.int({ min: 80000, max: 150000 }),
      
      // Management
      'Responsable': faker.number.int({ min: 55000, max: 90000 }),
      'Chef': faker.number.int({ min: 50000, max: 80000 }),
      'Lead': faker.number.int({ min: 60000, max: 95000 }),
      
      // Seniors
      'Senior': faker.number.int({ min: 45000, max: 70000 }),
      'Architecte': faker.number.int({ min: 70000, max: 110000 }),
      'Manager': faker.number.int({ min: 50000, max: 85000 }),
      
      // Juniors/Standard
      'Développeur': faker.number.int({ min: 35000, max: 60000 }),
      'Commercial': faker.number.int({ min: 30000, max: 55000 }),
      'Chargé': faker.number.int({ min: 32000, max: 50000 }),
      'Technicien': faker.number.int({ min: 28000, max: 45000 }),
      'Assistant': faker.number.int({ min: 25000, max: 40000 }),
      'Agent': faker.number.int({ min: 24000, max: 38000 }),
      'Opérateur': faker.number.int({ min: 26000, max: 42000 })
    };
    
    for (const [key, salary] of Object.entries(baseSalaries)) {
      if (position.includes(key)) {
        return salary;
      }
    }
    
    return faker.number.int({ min: 28000, max: 55000 }); // Salaire par défaut
  };

  // Génération des employés - Version enrichie (500 employés pour plus de données)
  for (let i = 0; i < 500; i++) {
    // Répartition plus réaliste des départements (certains plus gros que d'autres)
    const departmentWeights = [
      { department: 'Développement & IT', weight: 25 },
      { department: 'Ventes & Commercial', weight: 20 },
      { department: 'Operations & Logistique', weight: 15 },
      { department: 'Support Client', weight: 12 },
      { department: 'Production', weight: 10 },
      { department: 'Marketing & Communication', weight: 8 },
      { department: 'Finance & Comptabilité', weight: 4 },
      { department: 'Ressources Humaines', weight: 3 },
      { department: 'Recherche & Développement', weight: 1.5 },
      { department: 'Qualité & Conformité', weight: 0.8 },
      { department: 'Juridique & Compliance', weight: 0.4 },
      { department: 'Direction Générale', weight: 0.3 }
    ];
    
    const department = faker.helpers.weightedArrayElement(departmentWeights.map(d => ({ value: d.department, weight: d.weight })));
    const agency = faker.helpers.arrayElement(agencies);
    const position = faker.helpers.arrayElement(positionsByDepartment[department]);
    const firstName = faker.helpers.arrayElement(firstNames);
    const lastName = faker.helpers.arrayElement(lastNames);
    
    // Statut plus réaliste : 90% actifs, 5% inactive, 5% terminated
    const statusOptions: ('active' | 'inactive' | 'terminated')[] = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'inactive', 'terminated'];
    const status = faker.helpers.arrayElement(statusOptions);

    const employee: Employee = {
      id: `emp-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@entreprise.fr`,
      department,
      agency,
      position,
      salary: generateSalaryForPosition(department, position),
      hireDate: faker.date.between({ from: '2019-01-01', to: '2024-01-01' }),
      terminationDate: status === 'terminated' ? faker.date.between({ from: '2023-06-01', to: '2024-12-31' }) : undefined,
      status: status,
      performanceScore: faker.number.int({ min: 1, max: 5 }),
      trainingHours: faker.number.int({ min: 0, max: 80 }),
      remoteWork: faker.datatype.boolean({ probability: 0.6 }),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, France`,
      workingTimeRate: faker.helpers.weightedArrayElement([
        { value: 1.0, weight: 75 }, // 75% temps plein
        { value: 0.8, weight: 15 }, // 15% 80%
        { value: 0.6, weight: 7 },  // 7% 60%
        { value: 0.5, weight: 3 }   // 3% 50%
      ]),
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

  // Génération des dépenses RH - Version enrichie
  const expenseCategories = [
    'repas', 'transport', 'formation', 'materiel', 'hebergement', 
    'communication', 'evenements', 'licences', 'recrutement', 'medical'
  ];
  
  for (let i = 0; i < 1200; i++) {
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
      case 'hebergement':
        amount = faker.number.int({ min: 80, max: 250 });
        description = `Hébergement - ${faker.helpers.arrayElement(['Hôtel', 'Résidence', 'Airbnb'])}`;
        break;
      case 'communication':
        amount = faker.number.int({ min: 30, max: 300 });
        description = `Communication - ${faker.helpers.arrayElement(['Téléphone', 'Internet', 'Abonnement'])}`;
        break;
      case 'evenements':
        amount = faker.number.int({ min: 200, max: 5000 });
        description = `Événement - ${faker.helpers.arrayElement(['Team Building', 'Séminaire', 'Congrès', 'Salon professionnel'])}`;
        break;
      case 'licences':
        amount = faker.number.int({ min: 50, max: 800 });
        description = `Licence logicielle - ${faker.helpers.arrayElement(['Office', 'Adobe', 'Développement', 'Design'])}`;
        break;
      case 'recrutement':
        amount = faker.number.int({ min: 500, max: 8000 });
        description = `Recrutement - ${faker.helpers.arrayElement(['Cabinet', 'Job board', 'Cooptation', 'Chasseur de tête'])}`;
        break;
      case 'medical':
        amount = faker.number.int({ min: 100, max: 1200 });
        description = `Frais médicaux - ${faker.helpers.arrayElement(['Visite médicale', 'Ergonomie', 'Prévention'])}`;
        break;
      default:
        amount = faker.number.int({ min: 20, max: 200 });
        description = 'Dépense diverse';
    }

    const expense: Expense = {
      id: `exp-${i + 1}`,
      category,
      amount,
      date: faker.date.between({ from: '2023-01-01', to: '2024-12-31' }),
      description
    };
    
    expenses.push(expense);
  }

  return { employees, expenses };
};
