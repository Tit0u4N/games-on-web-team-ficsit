# Olympic Odyssey (🥉3rd rank🥉)

## Overview

Welcome we're excited to develop an innovative game that combines management,
4X and adventure elements, all set in the thrilling world of the Olympic Games for the Games On Web tournament.
Inspired by the game [For the King](https://store.steampowered.com/app/527230/For_The_King/)
and [Baldur's Gate III](https://store.steampowered.com/app/1086940/Baldurs_Gate_3/) for the gameplay.

> **Note:**
> If you prefer to read this document in French, please scroll down to the [French Version 🇫🇷](#olympic-odyssey-).

- [Game Link](https://tit0u4n.github.io/games-on-web-team-ficsit/)
- [Repository Github](https://github.com/Tit0u4N/games-on-web-team-ficsit)
- [Video Presentation](https://youtu.be/Ws0oB_I-Yis)
- [Team Members](#team-members)
- [Technology Stack](#technology-stack)
- [Key-development-points](#Key-development-points)
  - [Step 1: Generating the Map](#step-1-generating-the-map)
  - [Step 2: The Dice](#step-2-the-dice)
  - [Step 3: The Environment](#step-3-the-environment)
  - [Step 4: React](#step-4-react)
  - [Step 5: Animations](#step-5-animations)
  - [Step 6: Movement](#step-6-movement)
- [Development Approach](#development-approach)
  - [Package Management](#package-management)
  - [Getting Started](#getting-started)

## Team Members

- **[Titouan Lacombe--Fabre](https://github.com/Tit0u4N)** (L3 MIAGE, MIAGE Nice - Sophia)
- **[Tamas Palotas](https://github.com/Shiyamii)** (Bachelor degree in computer science *BUT 3*, Nice)
- **[Baptiste Lacroix](https://github.com/BaptisteLacroix)** (SI3 FISA, Diploma in computer engineering, Polytech Nice
  Sophia)

## Technology Stack

Our project is built using a robust and modern technology stack to ensure a high-quality gaming experience:

- **Primary Libraries:**
  - **BabylonJS**: For rendering stunning 3D graphics and creating immersive game environments.
  - **React**: To build a dynamic and responsive user interface.

- **Secondary Libraries:**
  - **NextUI**: For a modern and responsive UI design.
  - **Tailwind**: For sleek and efficient styling.
  - **SCSS**: To enhance CSS with more advanced styling capabilities.

- **Programming Language:** The entire project is written in **TypeScript**, utilizing its strong typing features for
  better code quality and maintainability.

- **Build Tool:** We use **Vite** for fast and efficient building and development.

- **Testing Framework:** We use **Jest** for testing our codebase.

- **Formatters and Linters:** We use **Prettier** and **ESLint** to ensure consistent code style and quality.

### The Idea

To create our game, we wanted to stand out by choosing a different type of game. We decided to develop a strategy, and
adventure game, inspired by titles like *For the King* and *Baldur's Gate III*.

We envisioned a game board made up of hexagonal tiles, featuring two types of buildings:

- Training centers, which allow our athletes to improve their skills.
- Arenas, where teams can battle other teams to win items.

Then, we imagined a final competition representing the Olympic Games after four years. The goal is to earn the most
points. There is a tournament for each sport to accumulate points. Each team is composed of three athletes, and the
ranking is done by team.

## Key development points

### Step 1: Generating the Map

To generate the map, we used Perlin noise and then added an algorithm to give our map an island shape.
For this, we used a Node.js library called 'tumult' which allows generating Perlin noise.
To use the library in our project, we encapsulated the code in a `Noise` class in TypeScript.

<p align="center">
  <img src="./images/perlin_1.png" alt="Perlin Noise Image" width="35%" />
  <img src="./images/perlin_2.png" alt="Perlin Noise Image" width="55%" />
  <img src="./images/perlin_3.png" alt="Perlin Noise Image" width="90%" />
</p>

To generate the map as we wanted, we adjusted the algorithm until we achieved the desired result.

### Step 2: The Dice

As dice rolling is at the heart of the game, we decided to give the player two options:

#### 2D Dice Roll

We first created a way to roll the dice in 2D, which is faster.
<p align="center">
  <img src="./images/dice_2d.png" alt="2D Dice Roll" width="80%" />
</p>

#### 3D Dice Roll

Next, we decided to create a 3D dice roll to make the game more immersive. For this, we needed to enable physics in
Babylon.js via Havok.
This was one of the biggest challenges because Havok is coded in WebAssembly (Wasm), so we had to handle its
asynchronous loading at the start of the game.
Additionally, adding a Wasm plugin to ViteJS was necessary.

<p align="center">
  <img src="./images/dice_3d_1.png" alt="3D Dice Roll" width="40%" />
  <img src="./images/dice_3d_2.png" alt="3D Dice Roll" width="55%" />
</p>

Once the physics were enabled, we were able to create and roll a 3D dice. However, the dice texture and the detection of
the "winning" face were issues to resolve.
For the texture, we faced inverted FaceUVs compared to what we wanted. To fix this, we reversed the texture direction
instead of recalculating the FaceUVs with a mathematical formula.

For detecting the "winning" face, we tested several methods. Initially, we wanted to detect the face whose vector
pointed upwards, but due to a high error rate, we switched to a simpler method of detecting the highest face. There may
still be errors, but the margin of error is much lower.

### Step 3: The Environment

For the environment, we decided to adopt a cartoon style to make the game more fun and accessible.
Low poly was a good choice as it is simpler to implement for us who are not experienced in 3D.

<p align="center">
  <img src="./images/decors_1.png" alt="Environment" width="98%" />
</p>

Most of our environment assets were trees and rocks that we created using Blender. For the buildings, we used free 3D
models found online.
The buildings were not an issue as there were few of them.

For the trees and rocks, there were a lot of 3D objects, up to about 18,400 trees and 3,350 rocks. Creating these 3D
objects directly required a lot of resources, so we decided to create instances of these objects, specifically "
ThinInstance", allowing us to create copies of the same 3D object without consuming additional resources. However, "
ThinInstance" prevented us from handling clicks or managing objects independently. To address this, we created a `Decor`
class that allowed us to manage all aspects of our environment and create multiple versions to show different trees (
shape, size, rotation).

<p align="center">
  <img src="./images/decors_2.png" alt="Environment" width="98%" />
  Images of trees and rocks during the early implementation (a bit demoralizing)
</p>

### Step 4: React

To build our user interface, we decided to use React for its simplicity and ease of use. However, React has its own
execution thread and becomes very finicky when we want to step outside of it. Fortunately, `useState` are functions and
can easily be passed into a function outside a React component.
In 95% of cases, this method works and allows React to update automatically. But in some cases, such as loading the
Havok physics engine or creating the map, we had to use `useEffect` with a `setTimeout` to force React to update.

Another challenge was managing modals and popups. For this, we created a `Modal` class that is a singleton and manages
almost all the game's modals. With a constraint, classes wanting a modal had to implement the `Reactable` interface to
ensure the management of certain methods.

### Step 5: Animations

To enhance the interactivity and appeal of the game, we decided to implement animations for the 3D character models in
the game. However, we encountered difficulties in animating the characters in the game. Initially, we used the custom global
function `importModel` to import 3D models with their animations into the BabylonJS scene. Despite the presence of
animations in the `AnimationGroups`, the characters appeared in a static (Blender) pose, and no animation was triggered.

To solve this problem, we rethought our approach and implemented a new function called `importMesh` within the `Pawn`
class. This function uses `SceneLoader.ImportMesh` to import the model and its animations. Here’s how our approach
evolved:

#### Previous Approach (`importModel`):

The `importModel` function was responsible for importing 3D models into the scene. However, despite the presence of
animations in the imported model, they were not triggered, and the characters appeared static. We
used `SceneLoader.ImportMeshAsync` for the import, hoping the animations would work without issue.

#### New Approach (`importMesh`):

In the revised approach, we introduced the `importMesh` function, using `SceneLoader.ImportMesh`. This function imports
the model and animations differently. Here’s what changed:

- **Parenting Meshes**: We created a parent mesh (`outer`) for the model and attached the model to this parent. This
  step was crucial as it provided a stable reference frame for the animations to apply correctly.

- **Managing Animations**: We properly configured the animations from the `AnimationGroups` obtained during the import.
  By directly accessing the `animationGroups` parameter in the import callback, we ensured the animations were correctly
  associated with the model.

#### Impact:

By adopting the new approach, we successfully resolved the animation issue. The characters are now animated as expected,
adding dynamism and immersion to the game world. The introduction of a parent mesh and proper animation configuration
significantly improved the integration of animations in our game, enhancing the overall gaming experience.

### Step 6: Movement

To move our characters, we had to create a movement system. For this, we used a graph defined across the entire map that
defines possible movements and movement costs. For this, we used the `data-structures` library, which allows easy
creation of graphs. Once the graph was created, it had to be displayed in 3D without being too heavy on calculations.

<p align="center">
  <img src="./images/displacement_1.png" alt="Character Movement" width="70%" />
</p>

Thanks to the library, we could easily determine all reachable tiles within a certain number of movement points. Once
these tiles were defined, they just needed to be made clickable, and the character would move to them.

## Development Approach

Our development follows the **Model-View-Presenter (MVP)** architecture. This approach allows us to separate the logic,
UI, and data handling aspects of the project, making our code more modular, scalable, and easier to manage.

### Package Management

We use **Yarn** as our package manager. The following commands are essential for working with our project:

- `yarn install`: To install all the necessary dependencies.
- `yarn run dev`: To start the development server.
- `yarn build`: To build the project for production.
- `yarn test`: To run the test suite.
- `yarn format`: To run the code formatter.

### Getting Started

To get started with contributing to this project, please follow these steps:

1. Clone the repository.
2. Run `yarn install` to install all dependencies.
3. Create a new branch for your feature following the naming convention.
4. Develop your feature and commit your changes.
5. Push your branch and open a pull request for review.

# Olympic Odyssey 🇫🇷 (🥉3ème place🥉)

## Aperçu

Bienvenue, nous sommes ravis de développer un jeu innovant qui combine des éléments de gestion,
4X et d'aventure, le tout dans le monde passionnant des Jeux Olympiques pour le tournoi Games On Web.
Inspiré par le jeu [For the King](https://store.steampowered.com/app/527230/For_The_King/)
et [Baldur's Gate III](https://store.steampowered.com/app/1086940/Baldurs_Gate_3/) pour le gameplay.

- [Lien du Jeu](https://tit0u4n.github.io/games-on-web-team-ficsit/)
- [Repository Github](https://github.com/Tit0u4N/games-on-web-team-ficsit)
- [Présentation Vidéo](https://youtu.be/Ws0oB_I-Yis)
- [Membres de l'équipe](#membres-de-léquipe)
- [Stack Technologique](#stack-technologique)
- [Points-clés-du-développement](#point-clé-du-développement)
  - [Étape 1: Génération de la Carte](#étape-1--génération-de-la-carte)
  - [Étape 2: Les Dés](#étape-2--le-dé)
  - [Étape 3: L'Environnement](#étape-3--les-décors)
  - [Étape 4: React](#étape-4--react)
  - [Étape 5: Les Animations](#étape-5--les-animations)
  - [Étape 6: Déplacements](#étape-6--les-déplacements)
- [Approche de Développement](#approche-de-développement)
  - [Gestion des Packages](#gestion-des-packages)
  - [Pour Commencer](#pour-commencer)

## Membres de l'équipe

- **[Titouan Lacombe--Fabre](https://github.com/Tit0u4N)** (L3 MIAGE, MIAGE Nice - Sophia)
- **[Tamas Palotas](https://github.com/Shiyamii)** (Licence en informatique *BUT 3*, Nice)
- **[Baptiste Lacroix](https://github.com/BaptisteLacroix)** (SI3 FISA, Diplôme en ingénierie informatique, Polytech Nice
  Sophia)

## Stack Technologique

Notre projet est construit en utilisant une stack technologique robuste et moderne pour garantir une expérience de jeu de haute qualité :

- **Bibliothèques Principales :**
  - **BabylonJS** : Pour rendre des graphismes 3D époustouflants et créer des environnements de jeu immersifs.
  - **React** : Pour construire une interface utilisateur dynamique et réactive.

- **Bibliothèques Secondaires :**
  - **NextUI** : Pour un design d'interface utilisateur moderne et réactif.
  - **Tailwind** : Pour un style élégant et efficace.
  - **SCSS** : Pour améliorer le CSS avec des capacités de style plus avancées.

- **Langage de Programmation :** L'ensemble du projet est écrit en **TypeScript**, utilisant ses fonctionnalités de typage fort pour
  une meilleure qualité et maintenabilité du code.

- **Outil de Build :** Nous utilisons **Vite** pour un build et un développement rapides et efficaces.

- **Framework de Test :** Nous utilisons **Jest** pour tester notre code.

- **Formatters et Linters :** Nous utilisons **Prettier** et **ESLint** pour garantir un style de code et une qualité cohérents.

### L'idée de base

Pour créer notre jeu, nous souhaitions nous démarquer en optant pour un type de jeu différent des autres.
Nous avons donc décidé de développer un jeu de stratégie et d'aventure, en nous inspirant de titres comme *For the King* et *Baldur's Gate III*.

Nous avons imaginé un plateau de jeu composé de cases hexagonales, avec deux types de bâtiments :

- Les centres d'entraînement, qui permettent d'améliorer les compétences de nos athlètes.
- Les arènes, où les équipes peuvent combattre d'autres équipes pour gagner des objets.

Ensuite, nous avons imaginé une compétition finale représentant les Jeux Olympiques au bout de quatre ans. Le but est d'obtenir le plus de points possible. Il y a un tournoi par sport pour accumuler les points. Chaque équipe est composée de trois athlètes et le classement se fait par équipe.


## Point clé du développement

### Étape 1 : Génération de la carte

Pour générer la carte, nous avons utilisé le bruit de Perlin, puis ajouté un algorithme afin de donner une forme d'île à
notre carte.
Pour cela, nous avons utilisé une librairie Node.js appelée 'tumult' qui permet de générer des bruits de Perlin.
Afin de pouvoir utiliser la librairie dans notre projet, nous avons dû encapsuler le code dans une classe `Noise` en
TypeScript.

<p align="center">
  <img src="./images/perlin_1.png" alt="Image bruit de Perlin" width="35%" />
  <img src="./images/perlin_2.png" alt="Image bruit de Perlin" width="55%" />
  <img src="./images/perlin_3.png" alt="Image bruit de Perlin" width="90%" />
</p>

Pour générer la carte comme nous le souhaitions, nous avons ajusté l'algorithme jusqu'à obtenir le résultat souhaité.

### Étape 2 : Le dé

Le lancer de dé étant au cœur du jeu, nous avons décidé de donner au joueur deux possibilités :

#### Lancer de dé en 2D

Nous avons d'abord créé une façon de lancer le dé en 2D, plus rapide.
<p align="center">
  <img src="./images/dice_2d.png" alt="Lancer de dé en 2D" width="80%" />
</p>

#### Lancer de dé en 3D

Ensuite, nous avons décidé de créer un lancer de dé en 3D pour rendre le jeu plus immersif. Pour cela, il fallait
activer la physique dans Babylon.js via Havok.
Ce fut l'un des plus gros problèmes à gérer car Havok est codé en WebAssembly (Wasm) et il fallait donc gérer son
chargement de manière asynchrone au début du jeu.
De plus, l'ajout d'un plugin Wasm à ViteJS était nécessaire.

<p align="center">
  <img src="./images/dice_3d_1.png" alt="Lancer de dé en 3D" width="40%" />
  <img src="./images/dice_3d_2.png" alt="Lancer de dé en 3D" width="55%" />
</p>

Une fois la physique activée, nous avons pu créer un dé en 3D et le lancer. Cependant, la texture du dé ainsi que la
détection de la face "gagnante" furent des problèmes à résoudre.
Pour la texture, nous avons dû faire face aux FaceUV qui étaient totalement inversées par rapport à ce que nous
voulions. Pour régler ce problème, nous avons inversé le sens de la texture plutôt que de remettre les FaceUV à
l'endroit via une formule mathématique.

Pour la détection de la face "gagnante", nous avons testé plusieurs méthodes. Initialement, nous voulions détecter la
face dont le vecteur pointait vers le haut, mais en raison d'un taux d'erreur trop élevé, nous nous sommes rabattus sur
une méthode plus simple consistant à détecter la face la plus haute. Il peut encore y avoir des erreurs, mais la marge
d'erreur est beaucoup plus faible.

### Étape 3 : Les décors

Pour les décors, nous avons décidé d'adopter un style cartoon pour rendre le jeu plus fun et accessible.
Le low poly était un bon choix car il est plus simple à mettre en place pour nous qui ne sommes pas expérimentés en 3D.

<p align="center">
  <img src="./images/decors_1.png" alt="Décors" width="98%" />
</p>

La majorité de nos décors étaient des arbres et des rochers que nous avons créés en utilisant Blender. Pour les
bâtiments, nous avons utilisé des modèles 3D gratuits trouvés sur internet.
Les bâtiments n'ont pas posé de problème car il y en avait peu.

Pour les arbres et les rochers, il y avait énormément d'objets 3D, jusqu'à environ 18 400 arbres et 3 350 rochers. Créer
directement ces objets 3D demandait beaucoup de ressources, nous avons donc décidé de créer des instances de ces objets,
plus exactement des "ThinInstance", permettant de créer des copies d'un même objet 3D sans consommer de ressources
supplémentaires. Cependant, les "ThinInstance" nous empêchaient de gérer les clics ou de gérer les objets
indépendamment. Pour cela, nous avons créé une classe `Decor` qui nous permet de gérer tous les aspects de nos décors et
d'en créer plusieurs versions afin de montrer plusieurs arbres différents (forme, taille, rotation).

<p align="center">
  <img src="./images/decors_2.png" alt="Décors" width="98%" />
  Images des arbres et des rochers lors des débuts de l'implémentation (petit coup au moral)
</p>

### Étape 4 : React

Pour construire notre interface utilisateur, nous avons décidé d'utiliser React pour sa simplicité et sa facilité.
Cependant, React a un fil d'exécution bien à lui et devient très capricieux lorsque nous voulons en sortir.
Heureusement, les `useState` sont des fonctions et peuvent donc facilement être transmises dans une fonction hors d'un
composant React.
Dans 95% des cas, cette méthode fonctionne et permet à React de se mettre à jour automatiquement. Mais dans certains
cas, comme le chargement du moteur physique Havok ou la création de la carte, nous avons dû utiliser des `useEffect`
avec un `setTimeout` pour forcer React à se mettre à jour.

Une autre difficulté rencontrée était la gestion des modals et des popups. Pour cela, nous avons créé une classe `Modal`
qui est un singleton et qui s'occupe de gérer quasiment toutes les modals du jeu. En ayant une contrainte, les classes
voulant une modal devaient implémenter l'interface `Reactable` qui permettait de garantir la gestion de certaines
méthodes.

### Étape 5 : Les animations

Pour améliorer l'interactivité et l'attrait du jeu, nous avons décidé d'implémenter des animations pour les modèles de
personnages en 3D dans le jeu. Cependant, nous avons rencontré des difficultés pour animer les personnages dans le jeu.
Initialement, nous utilisions la fonction custom globale `importModel` pour importer des modèles 3D avec leurs animations dans
la scène BabylonJS. Malgré la présence des animations dans les `AnimationGroups`, les personnages apparaissaient en pose
statique (Blender), et aucune animation n'était déclenchée.

Pour résoudre ce problème, nous avons repensé notre approche et implémenté une nouvelle fonction appelée `importMesh` à
l'intérieur de la classe `Pawn`. Cette fonction utilise `SceneLoader.ImportMesh` pour importer le modèle et ses
animations. Voici comment notre approche a évolué :

#### Approche précédente (`importModel`):

La fonction `importModel` était responsable de l'importation des modèles 3D dans la scène. Cependant, malgré la présence
des animations dans le modèle importé, elles n'étaient pas déclenchées et les personnages apparaissaient statiques. Nous
utilisions `SceneLoader.ImportMeshAsync` pour l'importation, en espérant que les animations fonctionnent sans problème.

#### Nouvelle approche (`importMesh`):

Dans l'approche révisée, nous avons introduit la fonction `importMesh`, en utilisant `SceneLoader.ImportMesh`. Cette
fonction importe le modèle et les animations différemment. Voici ce qui a changé :

- **Parentage des meshes** : Nous avons créé un mesh parent (`outer`) pour le modèle et attaché le modèle à ce parent.
  Cette étape était cruciale car elle fournissait un cadre de référence stable pour que les animations s'appliquent
  correctement.

- **Gestion des animations** : Nous avons correctement configuré les animations à partir des `AnimationGroups` obtenus
  lors de l'importation. En accédant directement au paramètre `animationGroups` du callback d'importation, nous avons
  assuré que les animations étaient correctement associées au modèle.

#### Impact :

En adoptant la nouvelle approche, nous avons réussi à résoudre le problème d'animation. Les personnages sont désormais
animés comme prévu, ajoutant du dynamisme et de l'immersion au monde du jeu. L'introduction d'un mesh parent et une
configuration correcte des animations ont considérablement amélioré l'intégration des animations dans notre jeu,
améliorant l'expérience globale de jeu.

### Étape 6 : Les déplacements

Afin de pouvoir déplacer nos personnages, nous avons dû créer un système de déplacement. Pour cela, nous avons utilisé
un graphe défini sur toute la carte qui définit les déplacements possibles et les coûts de déplacement. Pour cela, nous
avons utilisé la librairie `data-structures` qui permet de créer des graphes facilement. Une fois le graphe créé, il
fallait le faire afficher en 3D sans que ce soit trop lourd en calcul.

<p align="center">
  <img src="./images/displacement_1.png" alt="Déplacement des personnages" width="70%" />
</p>

Grâce à la librairie, nous pouvions facilement déterminer toutes les cases atteignables en un certain nombre de points
de mouvement. Une fois ces cases définies, il suffisait de les rendre cliquables et de faire bouger le personnage
dessus.


## Approche de Développement

Notre développement suit l'architecture **Model-View-Presenter (MVP)**. Cette approche nous permet de séparer la logique,
l'interface utilisateur et la gestion des données du projet, rendant notre code plus modulaire, évolutif et plus facile à gérer.

### Gestion des Packages

Nous utilisons **Yarn** comme gestionnaire de packages. Les commandes suivantes sont essentielles pour travailler avec notre projet :

- `yarn install` : Pour installer toutes les dépendances nécessaires.
- `yarn run dev` : Pour démarrer le serveur de développement.
- `yarn build` : Pour construire le projet pour la production.
- `yarn test` : Pour exécuter la suite de tests.
- `yarn format` : Pour exécuter le formateur de code.

### Pour Commencer

Pour commencer à contribuer à ce projet, veuillez suivre ces étapes :

1. Cloner le repository.
2. Exécuter `yarn install` pour installer toutes les dépendances.
3. Créer une nouvelle branche pour votre fonctionnalité en suivant la convention de nommage.
4. Développer votre fonctionnalité et valider vos modifications.
5. Pousser votre branche et ouvrir une pull request pour révision.
