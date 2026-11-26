import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.3.0:0',
  releaseNotes: {
    en_US:
      'Update Specter Desktop to v2.3.0. Includes authentication fixes, improved hardware wallet support, BIP329 label import and export, and updated dependencies. Create a full backup before upgrading. [Full release notes](https://github.com/cryptoadvance/specter-desktop/releases/tag/v2.3.0).',
    es_ES:
      'Actualización de Specter Desktop a v2.3.0. Incluye correcciones de autenticación, mejoras en la compatibilidad con monederos físicos, importación y exportación de etiquetas BIP329 y dependencias actualizadas. Crea una copia de seguridad completa antes de actualizar. [Notas de la versión completas](https://github.com/cryptoadvance/specter-desktop/releases/tag/v2.3.0).',
    de_DE:
      'Update von Specter Desktop auf v2.3.0. Enthält Fehlerbehebungen bei der Authentifizierung, verbesserte Hardware-Wallet-Unterstützung, Import und Export von BIP329-Labels sowie aktualisierte Abhängigkeiten. Erstelle vor dem Update eine vollständige Sicherung. [Vollständige Versionshinweise](https://github.com/cryptoadvance/specter-desktop/releases/tag/v2.3.0).',
    pl_PL:
      'Aktualizacja Specter Desktop do v2.3.0. Zawiera poprawki uwierzytelniania, ulepszoną obsługę portfeli sprzętowych, import i eksport etykiet BIP329 oraz zaktualizowane zależności. Przed aktualizacją wykonaj pełną kopię zapasową. [Pełne informacje o wydaniu](https://github.com/cryptoadvance/specter-desktop/releases/tag/v2.3.0).',
    fr_FR:
      'Mise à jour de Specter Desktop vers la version 2.3.0. Inclut des corrections d’authentification, une meilleure prise en charge des portefeuilles matériels, l’importation et l’exportation des étiquettes BIP329 et des dépendances mises à jour. Effectuez une sauvegarde complète avant la mise à jour. [Notes de version complètes](https://github.com/cryptoadvance/specter-desktop/releases/tag/v2.3.0).',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
