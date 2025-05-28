
import { generateKPIChartData } from '../services/hrAnalytics';

export const downloadGenderDataAsJSON = async () => {
  try {
    // Générer les données de graphique pour l'effectif
    const chartData = await generateKPIChartData({ id: 'headcount' } as any);
    
    if (!chartData.genderDistribution) {
      console.warn('Aucune donnée de répartition par genre disponible');
      return;
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

    // Créer et télécharger le fichier JSON
    const jsonString = JSON.stringify(genderData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `repartition-genre-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('Fichier JSON téléchargé avec succès:', genderData);
    
  } catch (error) {
    console.error('Erreur lors du téléchargement des données de genre:', error);
  }
};

// Appel automatique de la fonction au chargement du module
downloadGenderDataAsJSON();
