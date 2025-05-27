
import { HRData as GeneratedHRData, Employee as GeneratedEmployee } from '../data/hrDataGenerator';
import { HRData, Employee } from '../services/hrAnalytics';
import { faker } from '@faker-js/faker';

export function convertHRData(generatedData: GeneratedHRData): HRData {
  const employees: Employee[] = generatedData.employees.map((emp: GeneratedEmployee) => {
    const [firstName, lastName] = emp.name.split(' ');
    
    return {
      id: emp.id.toString(),
      firstName: firstName || 'John',
      lastName: lastName || 'Doe',
      email: `${firstName?.toLowerCase() || 'john'}.${lastName?.toLowerCase() || 'doe'}@company.com`,
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      hireDate: new Date(emp.hireDate),
      status: emp.status === 'active' ? 'active' : emp.status === 'inactive' ? 'inactive' : 'terminated',
      performanceScore: emp.evaluationScore,
      trainingHours: emp.remoteWorkDays || faker.number.int({ min: 10, max: 80 }),
      remoteWork: (emp.remoteWorkDays || 0) > 5,
      address: faker.location.streetAddress()
    };
  });

  const expenses = generatedData.expenses.map((expense, index) => ({
    id: `exp-${index}`,
    category: expense.category,
    amount: expense.amount,
    date: new Date(expense.date),
    description: `${expense.category} - ${expense.status}`
  }));

  return {
    employees,
    expenses
  };
}
