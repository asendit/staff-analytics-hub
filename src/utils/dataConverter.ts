
import { GeneratedHRData, Employee as GeneratedEmployee } from '../data/hrDataGenerator';
import { HRData, Employee } from '../services/hrAnalytics';

export function convertHRData(generatedData: GeneratedHRData): HRData {
  const employees: Employee[] = generatedData.employees.map((emp: GeneratedEmployee) => {
    return {
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      hireDate: new Date(emp.hireDate),
      status: emp.status,
      performanceScore: emp.performanceScore,
      trainingHours: emp.trainingHours,
      remoteWork: emp.remoteWork,
      address: emp.address
    };
  });

  const expenses = generatedData.expenses.map((expense) => ({
    id: expense.id,
    category: expense.category,
    amount: expense.amount,
    date: new Date(expense.date),
    description: expense.description
  }));

  return {
    employees,
    expenses
  };
}
