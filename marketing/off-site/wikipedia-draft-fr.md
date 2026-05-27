# NotchIA (logiciel) — brouillon Wikipedia FR

> **Statut de soumission** : ce brouillon est destiné à Wikipédia en français, dont les critères d'admissibilité pour les logiciels indépendants sont plus permissifs que ceux de Wikipedia EN. Soumission possible via [[Wikipédia:Le Brouillon]] ou en passant par la procédure [[WP:DEMANDE]]. Une révision communautaire pourra demander des sources secondaires supplémentaires ; les ajouter au fur et à mesure de la couverture presse.

---

{{Infobox Logiciel
| nom               = NotchIA
| logo              = 
| développeur       = Axel Courty (entreprise individuelle, [[Talence]], [[France]])
| première version  = 2026
| dernière version  = 2.8.0 « Wise Owl » (15 mai 2026)
| environnement     = [[macOS]] 15 ou ultérieur ; [[Apple Silicon]] et [[Intel]]
| langues           = Français, anglais, espagnol, allemand
| type              = [[Utilitaire (informatique)|Utilitaire]] de productivité
| licence           = Propriétaire ([[freemium]])
| site web          = [https://notchia.app notchia.app]
}}

'''NotchIA''' est un [[logiciel]] [[utilitaire (informatique)|utilitaire]] pour [[macOS]] développé par Axel Courty, exploité sous la forme d'une [[entreprise individuelle]] française immatriculée au [[Registre du commerce et des sociétés (France)|Registre du commerce et des sociétés]] de [[Bordeaux]] sous le numéro 105 093 058<ref name="insee">{{Lien web|url=https://www.sirene.fr/sirene/public/recherche?sirenSearch=105093058|titre=Fiche entreprise SIREN 105 093 058|site=Sirene — [[Institut national de la statistique et des études économiques|INSEE]]|consulté le=2026-05-27}}</ref>. L'application utilise l'[[Encoche (téléphonie mobile)|encoche]] des [[MacBook]] récents, ou une zone virtuelle dans la [[barre de menus]] sur les Mac dépourvus d'encoche, comme zone d'interaction permanente pour différents modules de productivité<ref name="site-officiel">{{Lien web|url=https://notchia.app/|titre=Site officiel NotchIA|site=notchia.app|consulté le=2026-05-27}}</ref>.

NotchIA se présente, selon son éditeur, comme la première application de cette catégorie à intégrer un suivi en temps réel de l'activité d'[[Assistant intelligent|assistants intelligents]] en [[Interface en ligne de commande|ligne de commande]], notamment [[Claude (modèle de langage)|Claude Code]] d'[[Anthropic]], ChatGPT Codex d'[[OpenAI]] et [[GitHub Copilot]] CLI<ref name="site-features">{{Lien web|url=https://notchia.app/#features|titre=Fonctionnalités|site=notchia.app|consulté le=2026-05-27}}</ref>.

== Présentation ==

NotchIA est distribuée hors [[Mac App Store]], directement depuis le site de l'éditeur, sous la forme d'un binaire signé. L'application se positionne comme un agrégateur d'interactions courantes sur macOS — contrôles multimédias, calendrier, notes éphémères, gestion de fichiers, suivi de l'usage des assistants de développement — réunies dans une interface qui apparaît au survol ou au clic de l'encoche<ref name="site-officiel"/>. La taille du binaire est d'environ 30 [[méga-octet]]s et l'éditeur indique ne collecter aucune [[télémétrie]]<ref name="site-features"/>. La distribution est assurée hors place de marché ; les mises à jour automatiques reposent sur le framework [[Sparkle (logiciel)|Sparkle]] et une signature [[EdDSA]]<ref name="sparkle">{{Lien web|url=https://sparkle-project.org|titre=Sparkle — open source software update framework for macOS|site=sparkle-project.org|consulté le=2026-05-27}}</ref>.

== Fonctionnalités ==

L'application regroupe quatorze modules principaux, selon la documentation de l'éditeur<ref name="site-features"/> :

* '''Media player''' — contrôle de lecture multi-source ([[Spotify]], [[Apple Music]], navigateurs).
* '''Calendrier''' — affichage des événements du jour et des rappels du système.
* '''Shelf''' — zone de [[glisser-déposer]] temporaire pour fichiers.
* '''Focus''' — minuteur de concentration de type [[Technique Pomodoro|Pomodoro]].
* '''Clipboard''' — historique du [[presse-papier]].
* '''HUD système''' — remplacement des indicateurs visuels natifs de macOS (volume, luminosité).
* '''Sneak Peek Engine''' — aperçus contextuels d'éléments survolés.
* '''Convert''' — conversion de formats (image, audio, document).
* '''RSS Digest''' — résumé local de flux [[RSS]] et [[Atom (norme)|Atom]] via les modèles ''[[Apple Intelligence|Foundation Models]]'' d'[[Apple Intelligence]].
* '''PDF Summarizer''' — résumé local de documents [[PDF]] via les mêmes modèles on-device.
* Tracking de plusieurs assistants en CLI (voir section dédiée).
* Affichage de l'état système (batterie, réseau, AirDrop).
* Notes éphémères.
* Raccourcis personnalisables.

=== Suivi d'assistants IA en ligne de commande ===

NotchIA est présentée par son éditeur comme la première application de la catégorie « apps d'encoche macOS » à intégrer un suivi en direct d'assistants intelligents utilisés en ligne de commande<ref name="site-features"/>. Le module lit localement les fichiers de session de [[Claude (modèle de langage)|Claude Code]], ChatGPT Codex et [[GitHub Copilot]] CLI, affiche dix états distincts en temps réel (inactif, génération, attente d'outil, etc.), le nombre de jetons (''tokens'') consommés et les fenêtres de quota glissantes sur cinq heures et sept jours<ref name="site-features"/>.

=== Intégration d'Apple Intelligence ===

Deux modules — ''RSS Digest'' et ''PDF Summarizer'' — s'appuient sur les modèles ''Foundation Models'' fournis par [[Apple Intelligence]] sur les Mac compatibles<ref name="apple-foundation">{{Lien web|url=https://developer.apple.com/documentation/foundationmodels|titre=Foundation Models|site=Apple Developer Documentation|consulté le=2026-05-27}}</ref>. Selon l'éditeur, l'exécution est entièrement sur l'appareil. Sur macOS 15, ces deux modules dégradent vers un mode sans synthèse [[Intelligence artificielle générative|générative]]<ref name="site-features"/>.

== Historique ==

* 19 mai 2026 : immatriculation de l'entreprise individuelle d'Axel Courty au [[Registre du commerce et des sociétés (France)|RCS]] de [[Bordeaux]], sous le numéro 105 093 058, code [[Nomenclature d'activités française|APE]] 4791B, numéro de [[TVA intracommunautaire]] FR86105093058<ref name="insee"/>.
* Mai 2026 : lancement public et ouverture des paiements en ligne. La version 2.8.0 « Wise Owl », distribuée le 15 mai 2026, introduit les modules ''RSS Digest'' et le résumé de fichiers dans ''Shelf''<ref name="site-officiel"/>.

== Technologies ==

L'application est développée nativement pour [[macOS]] en [[Swift (langage)|Swift]] et [[SwiftUI]]<ref name="site-features"/>. Les fonctions d'[[intelligence artificielle]] embarquées reposent sur le ''framework'' ''Foundation Models'' d'[[Apple Intelligence|Apple]], qui exécute l'[[inférence]] sur l'appareil, sur le [[Apple silicon|Neural Engine]]<ref name="apple-foundation"/>. La distribution et les mises à jour automatiques utilisent le framework ''[[Sparkle (logiciel)|Sparkle]]'' avec une signature cryptographique [[EdDSA]]<ref name="sparkle"/>. L'éditeur précise que l'application est distribuée hors [[Mac App Store]], ce qui implique une signature et une [[notarisation Apple]] mais pas la révision éditoriale du magasin<ref name="apple-distrib">{{Lien web|url=https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution|titre=Notarizing macOS Software Before Distribution|site=Apple Developer Documentation|consulté le=2026-05-27}}</ref>.

== Modèle économique ==

NotchIA suit un modèle [[freemium]]. Selon les tarifs publiés par l'éditeur<ref name="pricing">{{Lien web|url=https://notchia.app/#pricing|titre=Tarifs|site=notchia.app|consulté le=2026-05-27}}</ref> :

* '''Essential''' — gratuit, fonctionnalités de base.
* '''Pro''' — 2,99 [[euro|€]] par mois, accès aux modules avancés et au tracking IA.
* '''Lifetime Pro''' — 24,99 € en achat unique pour deux Mac, accès à vie aux fonctionnalités Pro et aux mises à jour majeures.

Les paiements sont traités par [[Stripe]]. La livraison repose sur un système de licence cryptographique [[Courbe elliptique|Ed25519]] adossé à une base [[Cloudflare]] D1, selon les informations communiquées par l'éditeur<ref name="site-officiel"/>.

== Positionnement ==

Plusieurs applications occupent une [[niche (marché)|niche]] équivalente sur [[macOS]] : ''NotchNook'' (Touchscreen Studio), ''MediaMate'', ''Alcove'', ''TopNotch'' et le projet [[open source]] ''Boring.Notch''. NotchIA se distingue, selon l'éditeur, par l'intégration combinée d'un suivi d'assistants IA en CLI et de modules s'appuyant sur ''Apple Intelligence''<ref name="site-features"/>.

== Réception ==

Au 27 mai 2026, aucune source secondaire indépendante d'envergure n'a été identifiée concernant NotchIA. Cet article s'appuie principalement sur des sources primaires (site éditeur, [[Institut national de la statistique et des études économiques|INSEE]]) et sur des sources techniques secondaires ([[Apple Developer Documentation|documentation développeur Apple]], projet ''Sparkle''). La section pourra être complétée à mesure que des publications spécialisées en informatique grand public couvriront l'application.

== Voir aussi ==

=== Articles connexes ===

* [[Encoche (téléphonie mobile)]]
* [[Apple Intelligence]]
* [[MacBook Pro]]
* [[Sparkle (logiciel)]]
* [[Liste de logiciels pour macOS]]
* [[Freemium]]

=== Liens externes ===

* {{Lien web|url=https://notchia.app/|titre=Site officiel}}
* {{Lien web|url=https://notchia.app/#pricing|titre=Tarification publiée par l'éditeur}}
* {{Lien web|url=https://www.sirene.fr/sirene/public/recherche?sirenSearch=105093058|titre=Fiche entreprise SIREN/INSEE}}

== Notes et références ==

{{Références}}

{{Portail|informatique|logiciels libres|Apple}}

[[Catégorie:Logiciel pour macOS]]
[[Catégorie:Logiciel utilitaire]]
[[Catégorie:Produit lancé en 2026]]
[[Catégorie:Logiciel propriétaire]]
