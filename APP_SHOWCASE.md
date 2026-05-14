# 🚀 Geros – Gestion de Boutique Intelligente & Moderne

Bienvenue sur le portail d'information de **Geros**, l'application de gestion de vente et d'inventaire conçue pour offrir une expérience fluide, même sans connexion internet.

---

## 📱 Aperçu de l'Application
Geros transforme la gestion de votre commerce grâce à une interface intuitive et des outils puissants de suivi financier. Conçue pour les commerçants modernes, elle allie esthétique premium et performance technique.

### ✨ Fonctionnalités Clés

#### 📊 Dashboard Financier Dynamique
- **Suivi en Temps Réel** : Visualisez vos ventes du jour et du mois en un coup d'œil.
- **Optimisation de l'Espace** : Affichage adaptatif des montants élevés pour une lisibilité parfaite.
- **Indicateurs de Performance** : Suivi des bénéfices calculés automatiquement selon vos prix d'achat.

#### 🛒 Module de Vente (Point de Vente)
- **Mode Offline-First** : Continuez à vendre même en cas de coupure réseau. Les données se synchronisent dès que la connexion revient.
- **Gestion du Panier** : Interface tactile rapide avec miniatures produits.
- **Images Mise en Cache** : Les photos de vos produits sont stockées localement pour un affichage instantané.

#### 📦 Inventaire & Stock
- **Gestion Simplifiée** : Ajoutez, modifiez et suivez vos produits facilement.
- **Scanner de Codes-barres** : Intégration native pour une gestion de stock ultra-rapide.
- **Alertes Stock Bas** : Ne tombez jamais en rupture grâce aux indicateurs visuels.

#### 📑 Rapports & Historique
- **Détails Précis** : Accédez à l'historique complet de vos transactions.
- **Génération de Reçus** : Visualisez et partagez les détails des ventes passées.
- **Analyses Mensuelles** : Comparez vos performances mois par mois.

---

## 🛠️ Stack Technique
L'application repose sur des technologies de pointe pour garantir stabilité et rapidité :

- **Framework** : [Flutter](https://flutter.dev) (Performance native iOS/Android).
- **Backend** : [Supabase](https://supabase.com) (PostgreSQL, Authentification, Realtime).
- **State Management** : [Riverpod](https://riverpod.dev) (Logique métier robuste et testable).
- **Navigation** : [GoRouter](https://pub.dev/packages/go_router) avec système de **Swipe Navigation** entre les écrans principaux.
- **Stockage Local** : SharedPreferences & Cache d'images avancé.

---

## 🎨 Expérience Utilisateur (UX/UI)
Geros n'est pas seulement un outil, c'est une expérience :
- **Design Premium** : Utilisation de la Glassmorphism, de palettes de couleurs harmonieuses (HSL) et d'une typographie moderne (Google Fonts).
- **Fluidité Maximale** : Navigation par gestes (swipe) synchronisée avec la barre de navigation.
- **Micro-animations** : Transitions fluides via `flutter_animate` pour une interface "vivante".
- **Optimisation du Rendu** : Utilisation de `RepaintBoundary` et `KeepAlive` pour un défilement à 60fps constant.

---

## 🧪 Guide pour les Testeurs

### 1. Installation
L'application nécessite les services Google Play sur Android. Assurez-vous d'avoir la dernière version du fichier APK fournie par l'équipe de développement.

### 2. Flux de Test Recommandé
1. **Onboarding** : Complétez le questionnaire de configuration de boutique.
2. **Inventaire** : Ajoutez quelques produits avec des images et des prix d'achat/vente.
3. **Vente** : Réalisez une vente en ligne, puis coupez le Wi-Fi/Données et réalisez une vente hors ligne.
4. **Dashboard** : Vérifiez que les totaux se mettent à jour correctement après la synchronisation.
5. **Swipe** : Testez la fluidité du glissement entre les écrans principaux.

### 3. Feedback
Pour tout bug ou suggestion d'amélioration UI, merci de noter l'écran concerné et les étapes pour reproduire le problème.

---
*Geros – Propulsé par la technologie Antigravity.*
