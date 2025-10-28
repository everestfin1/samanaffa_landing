Gestion de la sécurité IT de la plateforme Sama Naffa 
Propositions d’amélioration 

 

Authentification, Comptes & Sessions 

Exiger des mots de passe forts → Empêche les accès non autorisés en imposant des mots de passe complexes et uniques. 

Activer la double authentification et OTP → Renforce la sécurité des connexions par une vérification supplémentaire. 

Bloquer les comptes après plusieurs tentatives ratées → Protège contre les attaques par force brute (3 tentatives). 

Déconnexion automatique après inactivité → Évite qu’une session ouverte soit exploitée par un tiers. 

Alerte en cas de connexion suspecte→ Permet de détecter rapidement un accès inhabituel au compte(capchat). 

Gestion sécurisée des sessions → Utilise des jetons de session chiffrés, avec expiration automatique et régénération après authentification pour éviter les détournements (session hijacking). 

 

Backend & Base de données 

Chiffrer les données sensibles → Protège les informations critiques (ID, coordonnées bancaires, etc.) contre tout accès illégitime. 

Hashage des mots de passe avec bcrypt → Rend les mots de passe inexploitables même en cas de fuite de la base. 

Restreindre au maximum l’accès direct à la base de données → Réduit le risque d’intrusion en limitant les connexions à des sources autorisées. 

Séparer les environnements (dev/prod) → Évite que des erreurs de test affectent la production. 

Mettre en place des sauvegardes chiffrées et testées régulièrement → Garantit la restauration sécurisée des données après incident. 

Sécuriser la base de données → Applique des contrôles d’accès stricts, du chiffrement au repos et la surveillance des requêtes anormales. 

 

 

API & Intégrations 

Appliquer un rate limiting → Empêche les abus ou attaques DDoS en limitant les requêtes par utilisateur. 

Valider toutes les entrées utilisateur → Protège contre les injections SQL et les données malveillantes. 

Authentifier les requêtes avec JWT ou NextAuth → Garantit que seules les requêtes légitimes sont acceptées. 

Vérifier les signatures HMAC pour les callbacks Intouch → Assure l’intégrité et la provenance des échanges. 

 

Frontend 

Forcer le HTTPS sur tous les environnements (Certificat) → Chiffre les communications entre clients et serveur. 

Protéger contre les attaques XSS et CSRF → Empêche l’injection de scripts malveillants et les actions non autorisées. 

Mettre à jour régulièrement les dépendances (Next.js, React, etc.) → Élimine les vulnérabilités connues dans les bibliothèques utilisées. 

 

Accès Administrateur 

Restreindre l’accès au back-office (VPN/IP autorisées) → Limite les connexions aux administrateurs autorisés. 

Exiger la 2FA et OTP pour les comptes admin → Sécurise les comptes les plus sensibles. 

Journaliser toutes les actions d’administration → Permet d’auditer et de retracer les opérations effectuées. 

Gérer les rôles et niveaux d’accès → Donne à chaque administrateur uniquement les privilèges nécessaires. 

 

Infrastructure système & Réseau 

Déployer un WAF (Web Application Firewall) → Filtre et bloque les attaques web courantes. 

Centraliser et surveiller les logs (Grafana, ELK, Datadog) → Détecte les anomalies et incidents de sécurité en temps réel. 

Mettre à jour régulièrement les serveurs et logiciels → Corrige les failles exploitées par les attaquants. 

Sauvegarde régulière des logiciels et configurations → Assure la continuité du service après incident. 

Segmenter les services (base, backend, stockage) → Permet de limiter les dommages en cas de compromission d’un service. 

 

Conformité & Données Personnelles 

Respecter la CDP du Sénégal et le RGPD → Garantit la conformité légale dans la protection des données personnelles. 

Permettre la suppression et la portabilité des données → Donne à l’utilisateur un contrôle complet sur ses informations. 

Limiter la durée de conservation des données → Réduit les risques liés à la rétention excessive. 

Afficher et faire accepter une politique de confidentialité claire → Informe les utilisateurs sur l’utilisation et la finalité de leurs données personnelles. 

 

Surveillance & Amélioration continue 

Utiliser un outil de supervision pour le suivi des erreurs → Permet la détection et la correction rapide des anomalies. 

Mettre en place des alertes en cas d’activités suspectes → Facilite la réaction immédiate à une menace potentielle. 

Effectuer des scans de vulnérabilité réguliers → Identifie les failles de sécurité avant qu’elles ne soient exploitées. 

Utiliser des outils de monitoring (Grafana, ELK, Datadog) → Surveille en continu les performances et la sécurité du système. 

Changer périodiquement les clés et secrets → Réduit les risques liés à des identifiants compromis (3 ou 6 mois). 

 

Priorités immédiates 

Activer 2FA et rate limiting → Protège les comptes et APIs contre les abus et les intrusions. 

Mettre en place le chiffrement des données sensibles → Sécurise immédiatement les informations critiques. 

Déployer un WAF → Défend activement contre les attaques web. 

Effectuer des scans de vulnérabilité et procéder aux mises à jour logicielles → Ferme les failles de sécurité connues. 

Centraliser les logs et activer la surveillance continue → Garantit une détection rapide des anomalies. 