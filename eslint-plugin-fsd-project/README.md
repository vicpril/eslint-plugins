# eslint-plugin-fsd-project

Check imports for FSD architecture

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-fsd-project`:

```sh
npm install eslint-plugin-fsd-project --save-dev
```

## Usage

Add `fsd-project` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "fsd-project"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "fsd-project/path-checker": [
            "error", 
            { "alias": "@", "srcPath": "src" }
        ],
        "fsd-project/public-api-imports": [
            "error", 
            {
                "alias": "@",
                "testFilesPatterns": ["**/*.test.ts", "**/*.test.tsx", "**/StoreDecorator.tsx"],
            }
        ],
        "fsd-project/layer-imports": [
            "error", {
                "alias": "@",
                "srcPath": "src",
                "ignoreImportPatterns": ["**/StoreProvider", "**/testing"],
            }
        ],
    }
}
```

## Rules

### `path-checker`

#### Описание

Пути импорта в рамках одного слайса должны бить относительными.

**Сообщение**
*В рамках одного слайса все пути должны быть относительными*

Исключением является слайс `shared`


#### Аргументы

`alias: string = ''` - строка-символ псевдонима путей 

`srcPath: string = 'src'` - строка - относительный путь от root до папки с src

---

### public-api-imports

#### Описание

Абсолютные пути импорда должны быть из Public API

**Сообщение**
- *Абсолютный импорт разрешен только из Public API (index.ts)*
- *Тестовые данные необходимо импортировать из publicApi/testing.ts*

Исключением является слайс `shared`


#### Аргументы

`alias`: string = '' - строка-символ псевдонима путей 

`testFilesPatterns`: string[] = [] - массив паттернов файлов для тестирования

---

### `layer-imports`

#### Описание

Проверяет корректный импорт между слоями в рамках концепции FSD:

Правила импортов:

**app** <-- `pages`, `widgets`, `features`, `shared`, `entities`

**pages** <-- `widgets`, `features`, `shared`, `entities`

**widgets** <-- `features`, `shared`, `entities`

**features** <-- `shared`, `entities`

**entities** <-- `shared`, `entities`

**shared** <-- `shared`



**Сообщение**
*Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)*


#### Аргументы

`alias: string = ''` - строка-символ псевдонима путей 

`srcPath: string = 'src'` - строка - относительный путь от root до папки с src

`ignoreImportPatterns: string[] = []` - массив паттернов файлов для исключений



