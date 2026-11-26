import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v2_1_11_3 = VersionInfo.of({
  version: '2.1.11:3',
  releaseNotes: {
    en_US:
      'Specter now asks for a password before anyone can use it. If yours was open without a sign-in, run the "Create Admin Password" action after updating to get your password; until then the web interface stays locked. A password you already set in Specter is unchanged. The new "Reset Admin Password" action replaces a forgotten one.',
    es_ES:
      'Specter ahora pide una contraseña antes de que nadie pueda usarlo. Si el tuyo estaba abierto sin inicio de sesión, ejecuta la acción "Crear contraseña de administrador" después de actualizar para obtener tu contraseña; hasta entonces la interfaz web permanece bloqueada. Una contraseña que ya hayas configurado en Specter no cambia. La nueva acción "Restablecer contraseña de administrador" reemplaza una olvidada.',
    de_DE:
      'Specter verlangt jetzt ein Passwort, bevor jemand es nutzen kann. War deins ohne Anmeldung offen, führe nach dem Update die Aktion "Admin-Passwort erstellen" aus, um dein Passwort zu erhalten; bis dahin bleibt die Weboberfläche gesperrt. Ein Passwort, das du in Specter bereits festgelegt hast, bleibt unverändert. Die neue Aktion "Admin-Passwort zurücksetzen" ersetzt ein vergessenes.',
    pl_PL:
      'Specter wymaga teraz hasła, zanim ktokolwiek będzie mógł z niego korzystać. Jeśli twój był otwarty bez logowania, po aktualizacji uruchom akcję "Utwórz hasło administratora", aby otrzymać hasło; do tego czasu interfejs webowy pozostaje zablokowany. Hasło ustawione już w Specter pozostaje bez zmian. Nowa akcja "Zresetuj hasło administratora" zastępuje zapomniane hasło.',
    fr_FR:
      "Specter demande désormais un mot de passe avant que quiconque puisse l'utiliser. Si le vôtre était ouvert sans connexion, exécutez l'action « Créer le mot de passe administrateur » après la mise à jour pour obtenir votre mot de passe ; d'ici là, l'interface web reste verrouillée. Un mot de passe déjà défini dans Specter reste inchangé. La nouvelle action « Réinitialiser le mot de passe administrateur » remplace un mot de passe oublié.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
