
import { HRAnalytics, FilterOptions } from '../services/hrAnalytics';
import { generateHRData } from '../data/hrDataGenerator';

export const generateGenderDataJSON = () => {
  try {
    // Créer une instance des données HR
    const hrData = generateHRData();
    const analytics = new HRAnalytics(hrData);
    
    // Utiliser des filtres par défaut
    const filters: FilterOptions = { period: 'month' };
    
    // Obtenir les données de graphique pour l'effectif
    const chartData = analytics.getHeadcountChartData(filters);
    
    if (!chartData.genderDistribution) {
      console.warn('Aucune donnée de répartition par genre disponible');
      return null;
    }

    // Créer l'objet JSON avec les données de genre
    const genderData = {
      title: "Répartition par genre",
      generatedAt: new Date().toISOString(),
      data: chartData.genderDistribution.map(item => ({
        genre: item.gender,
        effectif: item.value,
        pourcentage: ((item.value / chartData.genderDistribution!.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)
      })),
      total: chartData.genderDistribution.reduce((sum, item) => sum + item.value, 0)
    };

    // Afficher le JSON dans la console
    console.log('Données de répartition par genre (JSON):');
    console.log(JSON.stringify(genderData, null, 2));
    
    return genderData;
    
  } catch (error) {
    console.error('Erreur lors de la génération des données de genre:', error);
    return null;
  }
};

// Appel automatique de la fonction au chargement du module
const jsonData = generateGenderDataJSON();

if (jsonData) {
  // Afficher également le JSON formaté
  console.log('=== DONNÉES JSON HOMME/FEMME ===');
  console.log(JSON.stringify(jsonData, null, 2));
}
