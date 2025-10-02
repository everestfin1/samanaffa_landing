# Intouch Payment Integration — État actuel (02/10/2025)

## Résumé rapide

- Les paiements via Intouch peuvent être initiés avec succès depuis le portail Sama Naffa.
- Après la validation sur la plateforme Intouch, l’utilisateur voit brièvement `/touchpayv2/payment-result/success` puis est immédiatement redirigé vers `/touchpayv2/merchanterror`.
- Aucun webhook n’est reçu sur `/api/payments/intouch/callback`, ce qui laisse les intents internes dans l’état `PENDING`.
- La logique applicative côté Everest (création d’intent, stockage de `providerTransactionId`, traitement du callback, mise à jour du solde, envoi d’e-mails) est opérationnelle et testée avec des payloads simulés.

Conclusion provisoire : le blocage se situe côté Intouch (redirection et/ou webhook non délivré).

## Détails techniques

### Frontend / UX
- `IntouchPayment.tsx` crée un intent et ouvre la fenêtre Intouch.
- En cas de succès, Intouch devrait rediriger l’utilisateur vers l’URL de succès configurée (app Everest) **et** appeler notre webhook.
- Comportement constaté : redirection vers `/payment-result/success`, puis bascule immédiate vers `/merchanterror`. L’utilisateur doit revenir manuellement au portail → l’intent reste `PENDING`.

### Backend
- `POST /api/transactions/intent` crée l’intent, stocke `providerTransactionId` si fourni.
- `POST /api/payments/intouch/callback`:
  - Vérifie la signature HMAC (paramètre `INTOUCH_ALLOW_UNSIGNED_CALLBACKS` possible pour debug).
  - Gère JSON et `application/x-www-form-urlencoded`.
  - Met à jour le statut (`COMPLETED`, `FAILED`, etc.), ajuste le solde, enregistre le payload.
- Tests manuels avec des payloads simulés : la mise à jour `COMPLETED` fonctionne.

### Hypothèse principale
- Le webhook Intouch n’est jamais envoyé parce que la configuration « Success URL / Merchant return URL » et/ou « Notification URL » n’est pas correcte côté Intouch, ou bien la demande échoue (timeout/SSL/CORS) avant d’être délivrée. Le passage par `/merchanterror` est un indice qu’Intouch n’arrive pas à finaliser la redirection.

## Questions pour l’équipe technique Intouch (en français)

1. **Redirection / URL de succès**
   - Pouvez-vous confirmer l’URL de redirection configurée pour notre marchand (ID `***REMOVED***`) en cas de paiement réussi ?
   - Voyez-vous une erreur côté Intouch lorsqu’elle redirige vers notre domaine `https://everestfin.com/portal/sama-naffa` ?  
     (Nous sommes redirigés vers `…/merchanterror` immédiatement après `…/payment-result/success`.)

2. **Webhook / notification serveur**
   - Notre URL de notification est `https://everestfin.com/api/payments/intouch/callback`. Recevez-vous une erreur lorsque vous tentez de l’appeler ?  
     Logs d’erreur, codes HTTP rejetés ou problèmes TLS ?
   - Pouvez-vous confirmer que les notifications sont bien activées sur notre compte Intouch et qu’elles ne sont pas désactivées suite à des erreurs ?

3. **Référence transaction / providerTransactionId**
   - Le champ `referenceNumber` que nous envoyons suit ce format : `SAMA_NAFFA-DEPOSIT-<timestamp>-<random>`. Ce format est-il compatible avec vos exigences ? Faut-il un format exact prédéfini ?
   - Quelles valeurs attendez-vous dans le champ identifiant la transaction Intouch (`transactionId` côté webhook) ? Devons-nous vous fournir un identifiant spécifique à la création ?

4. **Environnement & clés**
   - Pouvez-vous confirmer que les identifiants (Merchant ID / API Key) que nous utilisons correspondent bien à l’environnement (production vs sandbox) dans lequel vous effectuez les tests ?
   - Y a-t-il des restrictions IP ou des prérequis supplémentaires pour autoriser nos URLs de callback/success ?

5. **Logs / monitoring**
   - Serait-il possible d’obtenir un extrait des logs pour une transaction de test récente (date/heure) afin d’identifier la cause exacte du passage en `merchanterror` ?
   - Existe-t-il un test « ping » ou un outil fourni par Intouch pour valider l’accessibilité de l’URL de retour et du webhook ?

---

_Note : Ce document peut être partagé avec Intouch ou enrichi suite à leurs retours._
