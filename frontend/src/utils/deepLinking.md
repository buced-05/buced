# Deep Linking Documentation

## Vue d'ensemble

Le système de deep linking permet de naviguer directement vers des pages spécifiques de l'application via des URLs, même depuis des liens externes ou des notifications.

## Utilisation

### Hook `useDeepLink`

```typescript
import { useDeepLink } from '../hooks/useDeepLink';

function MyComponent() {
  const { navigateToRoute, shareCurrentPage, copyCurrentPageLink, routes } = useDeepLink();
  
  // Naviguer vers un projet
  navigateToRoute(routes.PROJECT_DETAIL(123));
  
  // Partager la page actuelle
  await shareCurrentPage({ title: 'Mon titre', text: 'Description' });
  
  // Copier le lien de la page actuelle
  await copyCurrentPageLink();
}
```

### Routes prédéfinies

```typescript
import { DeepLinkRoutes } from '../utils/deepLinking';

// Projets
DeepLinkRoutes.PROJECT_DETAIL(123) // /projects/123
DeepLinkRoutes.PROJECT_CREATE() // /projects/new

// Profil
DeepLinkRoutes.PROFILE() // /profile
DeepLinkRoutes.PROFILE(456) // /profile/456

// Recherche avec paramètres
DeepLinkRoutes.SEARCH('innovation') // /search?q=innovation

// Feed avec filtre
DeepLinkRoutes.FEED('projects') // /feed?filter=projects
```

### Génération de liens personnalisés

```typescript
import { createDeepLink } from '../utils/deepLinking';

// Lien simple
const link = createDeepLink('/projects/123');

// Avec paramètres de requête
const link = createDeepLink('/projects/123', {
  query: { tab: 'comments', highlight: true }
});

// Avec hash
const link = createDeepLink('/projects/123', {
  query: { tab: 'comments' },
  hash: 'section-1'
});
```

### Partage de liens

```typescript
import { shareDeepLink } from '../utils/deepLinking';

await shareDeepLink('/projects/123', {
  title: 'Projet innovant',
  text: 'Découvrez ce projet',
  params: { id: 123 }
});
```

### Composant ShareButton

```typescript
import { ShareButton } from '../components/deeplink/ShareButton';

<ShareButton
  route="/projects/123"
  title="Projet innovant"
  text="Découvrez ce projet"
  variant="button" // ou "icon"
/>
```

## Gestion des redirections après authentification

Le système gère automatiquement les redirections après connexion :

```
/login?redirect=/projects/123
/login?deep_link=/projects/123?tab=comments
```

## Exemples d'URLs

- `/projects/123` - Détails d'un projet
- `/projects/123?tab=comments` - Détails avec onglet spécifique
- `/profile/456` - Profil d'un utilisateur
- `/search?q=innovation` - Recherche avec terme
- `/feed?filter=projects` - Feed filtré
- `/orientation/789/messaging` - Messaging d'une demande d'orientation

## Intégration avec les notifications

Les notifications peuvent utiliser des deep links pour rediriger vers des pages spécifiques :

```typescript
// Dans une notification
{
  title: "Nouveau vote",
  message: "Votre projet a reçu un vote",
  url: "/projects/123" // Deep link
}
```

