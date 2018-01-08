# VtexMasterdata.js

Helpers to manipulate data from Vtex Masterdata

## Table of contents

- [Main](#main)
- [Getting started](#getting-started)
- [Methods](#methods)
- [License](#license)
- [Dependencies](#dependencies)
- [Todo](#todo)

## Main

```text
dist/
├── vtex-masterdata.js        (UMD)
├── vtex-masterdata.min.js    (UMD, compressed)
├── vtex-masterdata.common.js (CommonJS, default)
└── vtex-masterdata.esm.js    (ES Module)
```

## Getting started

### Direct download

Download the script [here](https://github.com/Zeindelf/vtex-masterdata/blob/master/dist/vtex-masterdata.min.js) and include it.

You will need [VtexUtils.js](https://github.com/zeindelf/vtex-utils)

```html
<script type="text/javascript" src="/arquivos/vtex-utils.min.js"></script>
<script type="text/javascript" src="/arquivos/vtex-masterdata.min.js"></script>
```

### Package Managers

VtexMasterdata.js supports [npm](https://www.npmjs.com/package/vtex-masterdata) under the name `vtex-masterdata`.

```shell
npm install vtex-masterdata --save
```

### Module Loaders

VtexMasterdata.js can also be loaded as an CommonJS or ES6 module (recomended).

```js
// CommomJS
var VtexMasterdata = require('vtex-masterdata');

// ES6 module
import VtexMasterdata from 'vtex-masterdata';
```

### Usage

With UMD (Universal Module Definition), the package is available on `VTEX` namespace.

```js
// First, initialize VtexUtils.js
var vtexUtils = new VTEX.VtexUtils();

// Initialize constructor passing VtexUtils.js as a param
var vtexMasterdata = new VTEX.VtexMasterdata(vtexUtils);

// Set store name (https://store-name.vtexcommercestable.com.br)
vtexMasterdata.setStore('store-name');
```

## Methods

### vtexMasterdata.newsletter(email[, newsletter[, entity]])

Newsletter opt-in / opt-out

- **email**:
  - Type: `String`
  - The email of the user to opt-in/out

- **newsletter** (optional):
  - Type: `Boolean`
  - Default: `true`
  - Whether to opt-in/out

- **entity** (optional):
  - Type: `String`
  - Default: `'CL'`
  - The Entity of the user

#### Example

Remove user from newsletter

```js
vtexMasterdata.newsletter('email@email.com', false)
    .done(function(res) {
        if ( res.result.dataInsert.isNewsletterOptIn ) {
            window.console.log('Subscribed');
        } else {
            window.console.log('Not subscribed');
        }
    })
    .fail(function(err) {
        window.console.log(err)
    });
```

### vtexMasterdata.getUser(email, fields[, entity])

Get User by mail

- **email**:
  - Type: `String`
  - The email of the user

- **fields**
  - Type: `Array`
  - A list of fields to retrieve

- **entity** (optional):
  - Type: `String`
  - Default: `'CL'`
  - The Entity of the user

#### Example

Get **email**, **firstName** and **lastName** by user e-mail (needs read properties set to public on Masterdata)

```js
vtexMasterdata.getUser('email@email.com', ['email', 'firstName', 'lastName'])
    .done(function(res) {
        // Response with an object that contains id, email, firstName and lastName of user
        window.console.log(res.result.dataResponse);
    })
    .fail(function(err) {
        window.console.log(err)
    });
```

### vtexMasterdata.updateUser(email, data, entity)

### vtexMasterdata.insertUpdateUser(email, data, entity)

### vtexMasterdata.insert(data, entity)

### vtexMasterdata.insertUpdate(id, data, entity)

### vtexMasterdata.search(params, fields[, entity[, limit[, offset]]])

Performs a search

- **params**
  - Type: `Object`
  - The search parameters

- **fields**
  - Type: `Array`
  - A list of fields to retrieve

- **entity** (optional):
  - Type: `String`
  - Default: `'CL'`
  - The entity where the search will be performed

- **limit** (optional):
  - Type: `Integer`
  - Default: `'49'`
  - The search limit

- **offset** (optional):
  - Type: `Integer`
  - Default: `'0'`
  - The search offset

#### Example

Search only stores with state = SP

```js
vtexMasterdata.search({state: 'SP'}, ['latitute', 'longitude'], 'SO')
    .done(function(res) {
        // Response with an object that contains only stores from 'SP' and latitude/latitude properties
        window.console.log(res.result.dataResponse);
    })
    .fail(function(err) {
        window.console.log(err)
    });
```

To search all results from entity, pass **params** as an empty object

```js
vtexMasterdata.search({}, ['latitute', 'longitude'], 'SO')
    .done(function(res) {
        // Response all data from 'SO' entity
        window.console.log(res.result.dataResponse);
    })
    .fail(function(err) {
        window.console.log(err)
    });
```

### vtexMasterdata.get(id, fields, entity)

### vtexMasterdata.exists(id, entity)

### vtexMasterdata.uploadFile(id, entity, field, file)


## License
VtexMasterdata.js is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Dependencies

jQuery 1.8.3+

VtexUtils.js

## Todo

- Docs