# Zelda.js

Prototype de jeu d'action-aventure 3D inspiré de l'univers Zelda, développé avec `Three.js`, `Rapier` et `Vite`.

Le projet s'appuie sur un tutoriel de la chaîne YouTube [Codeur de nuit](https://www.youtube.com/@CodeurDeNuit) et en particulier sur cette vidéo / playlist :

- [Tutoriel suivi sur YouTube](https://www.youtube.com/watch?v=WrVV-ToJILc&list=PLuEuUxlVFTod6sU3pjCKCO1Rj3BRyzXnj)

Ce dépôt correspond à une version déjà enrichie par rapport au tutoriel, avec plusieurs systèmes de gameplay, de caméra, de lumière et de contrôle déjà intégrés.

## Aperçu

Le jeu propose actuellement un personnage jouable dans un monde 3D avec :

- déplacement libre
- caméra third-person inclinée vers le bas
- attaques et bouclier
- animations synchronisées avec des effets sonores
- gestion de différentes surfaces au sol
- ombres dynamiques et éclairage type soleil
- compatibilité manette, clavier et souris

## Technologies utilisées

- `Three.js` pour le rendu 3D
- `@dimforge/rapier3d-compat` pour la physique
- `Vite` pour le lancement et le bundling

## Éléments déjà mis en place

### Gameplay

- déplacement du personnage avec physique dynamique
- rotation du personnage dans la direction du mouvement
- animation `idle`
- animation `run`
- animation `attack`
- animation `shield`
- priorités de gameplay entre attaque et bouclier
- vitesse de déplacement corrigée en diagonale

### Contrôles

- support manette
- support clavier
- support souris
- compatibilité `ZQSD`, `WASD` et flèches directionnelles
- clic gauche pour attaquer
- clic droit ou `Shift` pour lever le bouclier
- `Espace` pour l'attaque clavier

### Audio

- lecture des sons d'attaque
- lecture du son du bouclier
- sons de pas synchronisés avec l'animation
- variation des sons selon le type de sol

### Monde et environnement

- chargement de scènes `.glb`
- séparation visuels / colliders / zones
- détection de zones de terrain
- plusieurs mondes de test présents dans `public/glb`
- gestion de surfaces comme herbe, pierre, bois et terre

### Rendu visuel

- lumière ambiante
- soleil directionnel avec ombres
- réflexion solaire élargie via plusieurs sources directionnelles
- ombres adoucies
- caméra rapprochée et centrée sur le personnage
- légère vue par-dessus pour le gameplay

## Commandes

### Clavier / souris

- `ZQSD` / `WASD` / flèches : déplacement
- `Espace` ou clic gauche : attaque
- `Shift` / `C` ou clic droit : bouclier
- `E` : saut

### Manette

- stick gauche : déplacement
- bouton `0` : attaque
- bouton `7` : bouclier
- bouton `1` : saut

## Lancer le projet

### Installation

```bash
npm install
```

### Démarrage en développement

```bash
npm run dev
```

### Build de production

```bash
npm exec vite build
```

## Structure du projet

```text
.
├── README.md
├── app.js
├── index.html
├── package.json
├── package-lock.json
├── windowsSize.js
├── controls/
│   └── gamepad.js
├── src/
│   ├── class/
│   │   ├── animator.js
│   │   ├── area.js
│   │   ├── camera.js
│   │   ├── graphic.js
│   │   ├── light.js
│   │   ├── physic.js
│   │   ├── player.js
│   │   ├── sound.js
│   │   └── world.js
│   └── tools/
│       ├── function.js
│       ├── loader.js
│       └── overwrite.js
├── public/
│   ├── css/
│   │   └── app.css
│   ├── glb/
│   │   ├── character.glb
│   │   ├── mob1.glb
│   │   ├── mob2.glb
│   │   ├── world.glb
│   │   ├── world0.glb
│   │   ├── world1.glb
│   │   └── world2.glb
│   ├── image/
│   │   ├── gamepad.png
│   │   ├── sky.jpg
│   │   ├── sprite_ui.png
│   │   └── tech.png
│   ├── sound/
│   │   ├── attack*.wav
│   │   ├── shield.wav
│   │   ├── step_*.wav
│   │   └── ...
│   └── blender/
│       ├── character/
│       ├── mob1/
│       ├── mob2/
│       └── world/
└── dist/
    └── build de production généré par Vite
```

## Crédits

- Tutoriel d'origine : [Codeur de nuit](https://www.youtube.com/@CodeurDeNuit)
- Référence suivie : [vidéo / playlist YouTube](https://www.youtube.com/watch?v=WrVV-ToJILc&list=PLuEuUxlVFTod6sU3pjCKCO1Rj3BRyzXnj)

## État du projet

Le projet est en cours de développement. La base technique du personnage, des contrôles, des animations, de l'audio, de la lumière et de la navigation dans le monde est déjà en place.

Les prochaines évolutions possibles peuvent inclure :

- ennemis et IA
- système de combat plus avancé
- interface utilisateur
- objets interactifs
- quêtes ou progression
- optimisation graphique et sonore
