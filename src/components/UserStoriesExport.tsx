
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

const UserStoriesExport = () => {
  const generateUserStoriesDocument = () => {
    const userStories = `
TABLEAU DE BORD RH - LISTE DES USER STORIES
==========================================

1. GESTION DES INDICATEURS CLÉS (KPI)
=====================================

US001 - Visualisation des KPI principaux
En tant qu'utilisateur RH, je veux voir les principaux indicateurs RH (effectifs, turnover, absentéisme, satisfaction) sur le tableau de bord principal pour avoir une vue d'ensemble rapide de la situation RH.

US002 - Filtrage des données
En tant qu'utilisateur, je veux pouvoir filtrer les données par département, période et type d'emploi pour analyser des segments spécifiques de l'organisation.

US003 - Comparaison de périodes
En tant qu'analyste RH, je veux pouvoir comparer les indicateurs entre différentes périodes pour identifier les tendances et évolutions.

US004 - Graphiques détaillés des KPI
En tant qu'utilisateur, je veux pouvoir cliquer sur un KPI pour voir un graphique détaillé avec l'évolution temporelle de cet indicateur.

US005 - Export des données KPI
En tant qu'utilisateur, je veux pouvoir exporter les données des KPI en format Excel pour des analyses complémentaires.

2. ANALYSE IA ET INSIGHTS
========================

US006 - Génération d'insights automatiques
En tant que manager RH, je veux que le système génère automatiquement des insights et recommandations basés sur les données pour m'aider dans ma prise de décision.

US007 - Vue d'ensemble simplifiée
En tant qu'utilisateur, je veux voir le nombre d'indicateurs positifs, négatifs et neutres pour avoir un aperçu rapide de la santé RH.

US008 - Synthèse IA personnalisée
En tant qu'utilisateur, je veux recevoir une synthèse intelligente des principales tendances et points d'attention identifiés dans mes données RH.

US009 - Analyse détaillée par catégorie
En tant qu'analyste, je veux accéder à des analyses détaillées pour l'effectif, la performance, l'engagement et la rétention des employés.

US010 - Export de l'analyse IA
En tant qu'utilisateur, je veux pouvoir exporter l'analyse IA complète en format PDF pour la partager avec la direction.

3. GESTION DES DONNÉES DÉMOGRAPHIQUES
====================================

US011 - Analyse par genre
En tant qu'utilisateur RH, je veux voir la répartition par genre dans l'organisation pour suivre la diversité et l'équité.

US012 - Export des données de genre
En tant qu'utilisateur, je veux pouvoir télécharger un rapport détaillé sur la répartition par genre en format Excel.

US013 - Visualisation interactive
En tant qu'utilisateur, je veux des graphiques interactifs pour explorer les données démographiques de manière intuitive.

4. INTERFACE UTILISATEUR ET NAVIGATION
=====================================

US014 - Tableau de bord responsive
En tant qu'utilisateur mobile, je veux que le tableau de bord s'adapte à la taille de mon écran pour consulter les données depuis n'importe quel appareil.

US015 - Navigation intuitive
En tant qu'utilisateur, je veux une interface claire et intuitive pour naviguer facilement entre les différentes sections du tableau de bord.

US016 - Thème sombre/clair
En tant qu'utilisateur, je veux pouvoir basculer entre un thème sombre et clair selon mes préférences visuelles.

US017 - Actualisation des données
En tant qu'utilisateur, je veux pouvoir actualiser les données en temps réel pour avoir les informations les plus récentes.

5. RAPPORTS ET EXPORTS
=====================

US018 - Export Excel personnalisé
En tant qu'utilisateur, je veux pouvoir exporter des rapports Excel avec des données filtrées selon mes critères spécifiques.

US019 - Rapport PDF complet
En tant que manager, je veux générer un rapport PDF complet incluant tous les indicateurs et analyses pour les présentations en comité de direction.

US020 - Planification d'exports automatiques
En tant qu'administrateur, je veux pouvoir programmer des exports automatiques de rapports à intervalles réguliers.

6. PERFORMANCE ET FIABILITÉ
===========================

US021 - Chargement rapide des données
En tant qu'utilisateur, je veux que les données se chargent rapidement (moins de 3 secondes) pour une expérience fluide.

US022 - Gestion d'erreurs
En tant qu'utilisateur, je veux recevoir des messages d'erreur clairs et des suggestions de résolution en cas de problème.

US023 - Sauvegarde automatique des filtres
En tant qu'utilisateur, je veux que mes préférences de filtrage soient sauvegardées automatiquement pour ma prochaine session.

7. SÉCURITÉ ET ACCÈS
===================

US024 - Contrôle d'accès par rôle
En tant qu'administrateur, je veux pouvoir définir différents niveaux d'accès selon les rôles des utilisateurs.

US025 - Audit des actions
En tant qu'administrateur, je veux un journal d'audit des actions effectuées sur le système pour la traçabilité.

US026 - Protection des données sensibles
En tant qu'utilisateur, je veux être assuré que les données RH sensibles sont protégées et conformes au RGPD.

8. PERSONNALISATION
==================

US027 - Tableau de bord personnalisable
En tant qu'utilisateur avancé, je veux pouvoir personnaliser l'agencement des KPI sur mon tableau de bord selon mes priorités.

US028 - Alertes personnalisées
En tant que manager RH, je veux pouvoir configurer des alertes automatiques lorsque certains seuils critiques sont atteints.

US029 - Favoris et raccourcis
En tant qu'utilisateur fréquent, je veux pouvoir créer des raccourcis vers mes analyses les plus consultées.

9. COLLABORATION
===============

US030 - Partage de rapports
En tant qu'utilisateur, je veux pouvoir partager facilement des rapports et analyses avec mes collègues via email ou lien.

US031 - Commentaires et annotations
En tant qu'analyste, je veux pouvoir ajouter des commentaires et annotations sur les graphiques pour enrichir l'analyse.

US032 - Historique des modifications
En tant qu'utilisateur, je veux voir l'historique des modifications apportées aux filtres et configurations.

10. FORMATION ET AIDE
====================

US033 - Guide d'utilisation intégré
En tant que nouvel utilisateur, je veux accéder à un guide d'utilisation interactif pour apprendre à utiliser le tableau de bord.

US034 - Tooltips informatifs
En tant qu'utilisateur, je veux des infobulles explicatives sur les indicateurs complexes pour mieux comprendre leur signification.

US035 - Support en ligne
En tant qu'utilisateur, je veux pouvoir accéder facilement au support technique en cas de besoin d'assistance.

CRITÈRES D'ACCEPTATION GÉNÉRAUX
===============================

- Tous les graphiques doivent être interactifs et responsives
- Les temps de réponse ne doivent pas excéder 3 secondes
- L'interface doit être accessible (WCAG 2.1 AA)
- Les données doivent être synchronisées en temps réel
- Tous les exports doivent conserver la mise en forme et les filtres appliqués
- Le système doit fonctionner sur les navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Les données sensibles doivent être chiffrées en transit et au repos

DÉFINITION OF DONE
==================

Pour qu'une user story soit considérée comme terminée :
✓ Le code est développé et testé
✓ L'interface utilisateur est responsive
✓ Les tests unitaires passent
✓ La fonctionnalité est documentée
✓ La revue de code est effectuée
✓ La fonctionnalité est validée par le Product Owner
✓ Les critères d'acceptation sont tous respectés

Document généré le : ${new Date().toLocaleDateString('fr-FR')}
Version : 1.0
`;

    // Créer et télécharger le fichier
    const blob = new Blob([userStories], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'User_Stories_Tableau_RH.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={generateUserStoriesDocument}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <FileText className="h-4 w-4" />
      <Download className="h-4 w-4" />
      <span>User Stories</span>
    </Button>
  );
};

export default UserStoriesExport;
