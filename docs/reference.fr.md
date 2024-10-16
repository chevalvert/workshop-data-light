# Réferences API

## `draw()`

Le code à l’intérieur de cette fonction est exécuté à chaque _frame_ de l’animation, autant de fois par seconde que défini par `frameRate`.  
À l’intérieur de cette fonction, une variable `frameCount` (voir [**Constantes**](#constantes) plus bas) permet d’accéder au nombre de _frames_ écoulées depuis le lancement de l’animation.

L’exécution de cette fonction s’arrêtera après un nombre d’exécution défini dans l’interface.

```js
export function draw () {
  log(frameCount)
}
```

## `setup()` 

Le code à l’intérieur de cette fonction est exécuté une seule fois, avant le lancement de l’animation.  
Utile pour une manipulation de données ou une tâche plus lente, et qui n’a pas besoin d’être effectuée à chaque _frame_.  

```js
export function setup () {
  log('hello')
}
```

## Couleur

Toutes les couleurs sont définies et manipulées dans l’espace colorimétrique **RVB** (ou **RGB** en anglais).  
Plusieurs utilitaires de l’API permettent de créer et manipuler les couleurs, et la bibliothèque [`chromajs`](https://gka.github.io/chroma.js/) permet des manipulations plus avancées.

<details>
  <summary><strong><code>rgb(gray)</code></strong></summary>

  Défini une nuance de gris de `0` à `255`.

  ```js
  const white = rgb(255)
  const black = rgb(0)
  const gray50 = rgb(127)
  ```
</details>

<details>
  <summary><strong><code>rgb(red, green, blue)</code></strong></summary>

  Défini une couleur par ses canaux rouge, vert et bleu (de `0` à `255` chacun).

  ```js
  const red = rgb(255, 0, 0)
  const green = rgb(0, 255, 0)
  const blue = rgb(0, 0, 255)
  const niceBlue = rgb(0, 215, 233)
  ```
</details>

<details>
  <summary><strong><code>hsl(hue, saturation, lightness)</code></strong></summary>

  Défini une couleur par sa teinte (`hue`) sur une roue chromatique (de `0°` à `360°`), sa saturation (de `0` à `1`) et sa luminosité (de `0` à `1`).

  ```js
  const red = hsl(360, 1, 0.6)
  const sadBlue= hsl(180, 0.3, 0.5)
  ```
</details>

<details>
  <summary><strong><code>chroma.*</code></strong></summary>

  Permet l’accès à la bibliothèque [`chromajs`](https://gka.github.io/chroma.js/) pour effectuer des manipulations chromatiques avancées.

  À noter également que chaque objet de couleur instancié avec les méthodes `rgb` et `hsl` est une instance valide de chroma, et qu'il est par conséquent possible d’utiliser ses méthodes associées : 

  ```js
  const red = rgb(255, 0, 0)
  const orange = red.brighten(2)
  ```
</details>

## Lumière

Plusieurs permettent de contrôler les LEDs du bandeau.  
Lorsqu’une position est nécessaire, `0` représente toujours la première LED, et `ledCount - 1` la dernière LED.

<details>
  <summary><strong><code>fill(color)</code></strong></summary>
  
  Applique la couleur `color` à toutes les LEDs du bandeau.

  ```js
  const red = rgb(255, 0, 0)
  fill(red)
  ```
</details>

<details>
  <summary><strong><code>led(index, color)</code></strong></summary>
    
  Applique la couleur `color` à la LED de la position `index`.

  ```js
  // Allume la première LED en rouge
  led(0, rgb(255, 0, 0))
  ```
</details>

<details>
  <summary><strong><code>line(from, to, color)</code></strong></summary>
  
  Applique la couleur `color` à toutes les LEDs entre la position `from` et la position `to`.

  ```js
  // Une ligne bleue de 100 LEDs
  line(0, 100, rgb(0, 0, 255))
  ```
</details>

<details>
  <summary><strong><code>gradient(from, to, color1, color2)</code></strong></summary>

  Applique un dégradé de la couleur `color1` à la couleur `color2` à toutes les LEDS entre la position `from` et la position `to`.
  
  ```js
  // Un dégradé de 50 LEDs du rouge au vert
  const red = rgb(255, 0, 0)
  const green = rgb(0, 255, 0)
  gradient(0, 50, red, green)
  ```

  Un cinquième argument optionnel permet de sélectionner l’[espace colorimétrique de l’interpolation chromatique](https://gka.github.io/chroma.js/#chroma-mix) (par défault `rgb`).

  ```js
  gradient(0, 50, rgb(255, 0, 0), rgb(0, 255, 0), 'rgb')
  gradient(0, 50, rgb(255, 0, 0), rgb(0, 255, 0), 'hsl')
  gradient(0, 50, rgb(255, 0, 0), rgb(0, 255, 0), 'hcl')
  gradient(0, 50, rgb(255, 0, 0), rgb(0, 255, 0), 'oklab')
  ```
</details>

<details>
  <summary><strong><code>clear()</code></strong></summary>
  
  Éteint toutes les LEDs du bandeau. Équivalent de `fill(rgb(0, 0, 0))`.

  **Important :** le bandeau n’étant pas réinitialisé d’une _frame_ à la suivante, il est recommandé d’utiliser la fonction `clear()` au début du `draw()`.

  ```js
  clear()
  ```
</details>


## Constantes

Certaines variables globales peuvent être utilisées afin d’accéder à des paramètres de l’interface ou du bandeau LED. Ces constantes sont accessibles uniquement en lecture, et ne peuvent pas être altérées.

<details open>
  <summary><strong><code>data</code></strong></summary>
  
  Objet contenant les données importées dans l’onglet `data` de l’interface.
</details>

<details open>
  <summary><strong><code>frameCount</code></strong></summary>
  
  Nombre de _frames_ passées depuis le début de l’animation.

  ```js
  export function draw () {
    clear()
    led(frameCount, rgb(255))
  }
  ```
</details>

<details open>
  <summary><strong><code>frameRate</code></strong></summary>

  Nombre de _frames_ par seconde (ou _fps_). Réglée depuis l’interface.
</details>

<details open>
  <summary><strong><code>frames</code></strong></summary>

  Nombre total de _frames_ de l’animation. Réglée depuis l’interface.
</details>

<details open>
  <summary><strong><code>ledCount</code></strong></summary>

  Nombre de LEDs présentes sur le bandeau.
</details>

## Maths

En plus des fonctions arithmétiques basiques et de l’objet natif [Math](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math), cette API propose des méthodes mathématiques supplémentaires extraites de la bibliothèque [`missing-math`](https://github.com/arnaudjuracek/missing-math).

<details>
  <summary><strong><code>clamp(value, min, max)</code></strong></summary>

  Bloque une valeur entre un minimum et un maximum.

  ```js
  clamp(10, 0, 5) // → 5
  clamp(-10, 0, 5) // → 0
  ```
</details>

<details>
  <summary><strong><code>wrap(value, min, max)</code></strong></summary>

  Bloque une vlauer entre un minimum et un maximum en revenant au point de départ.

  ```js
  for (let angle = 0; angle < 1080; angle++) {
    wrap(angle, 0, 360) // angle fera des tours de 0 à 360
  }
  ```
</details>

<details>
  <summary><strong><code>normalize(value, min, max[, clamp = false])</code></strong></summary>

  Force une valeur entre `0` et `1`.  
  Si l’argument `clamp` est `true`, la valeur sera également bloquée entre `min` et `max` (assure que la valeur normalisée ne sorte pas du domaine `[0;1]`).

  ```js
  normalize(50, 0, 100) // → 0.5
  ```
</details>

<details>
  <summary><strong><code>map(value, in_min, in_max, out_min, out_max[, clamp = false])</code></strong></summary>

  Transforme proportionnellement une valeur d’un domaine à un autre.  
  Si l’argument `clamp` est `true`, la valeur d’entrée sera également bloquée entre `in_min` et `in_max`.

  ```js
  map(50, 0, 100, -10, 10) // → 0
  ```
</details>

<details>
  <summary><strong><code>lerp(a, b, t)</code></strong></summary>

  Applique une interpolation linéare entre la valeur `a` et la valeur `b`. Le facteur `t` contrôle la progression de l’interpolation entre `0` et `1`.

  ```js
  lerp(0, 100, 0) // → 0
  lerp(0, 100, 0.5) // → 50
  lerp(0, 100, 1) // → 1
  ```
</details>

<details>
  <summary><strong><code>random(a[, b])</code></strong></summary>

  Tire aléatoirement un nombre à virgule entre `0` et `a`, ou entre `a` et `b` si `b` est défini.

  ```js
  random(100) // → 41.37240334391761
  random(-1, 1) // → -0.4504311261648928
  ```
</details>

<details>
  <summary><strong><code>randomInt(a[, b])</code></strong></summary>

  Tire aléatoirement un nombre entier entre `0` et `a`, ou entre `a` et `b` si `b` est défini.

  ```js
  randomInt(100) // → 41
  randomInt(-1, 1) // 0
  ```
</details>

<details>
  <summary><strong><code>roundTo(value, nearest)</code></strong></summary>

  Arrondi la valeur au muliple de `nearest` le plus proche.

  ```js
  roundTo(13, 5) // → 15
  roundTo(13, 2) // → 12
  ```
</details>

<details>
  <summary><strong><code>floorTo(value, nearest)</code></strong></summary>

  Arrondi la valeur au muliple de `nearest` inférieur.

  ```js
  floorTo(13, 5) // → 10
  floorTo(13, 2) // → 12
  ```
</details>

<details>
  <summary><strong><code>ceilTo(value, nearest)</code></strong></summary>

  Arrondi la valeur au muliple de `nearest` supérieur.

  ```js
  ceilTo(13, 5) // → 15
  ceilTo(13, 2) // → 14
  ```
</details>

## Utilitaires

<details>
  <summary><strong><code>log(value)</code></strong></summary>

  Affiche la valeur ou l’objet dans la console du navigateur. Alias de `console.log`.
</details>
