
const vtexUtilsVersion = '0.5.0';

export default {
    API_URL: '\/\/api.vtexcrm.com.br/{storeName}/dataentities/{entity}/{type}/',
    API_ATTACHMENT_URL: '\/\/api.vtexcrm.com.br/{storeName}/dataentities/{entity}/documents/{id}/{field}/attachments',
    DEFAULT_ENTITY: 'CL',
    error: {
        ERR_INVALID_USER: 'User doesn\'t exist',
        ERR_INVALID_PARTNER: 'Partner doesn\'t exist',
        ERR_INVALID_EMAIL: 'Invalid email',
    },
    types: {
        DOCUMENTS: 'documents',
        SEARCH: 'search',
        SCHEMAS: 'schemas',
        FACET: 'search/facet',
        ATTACHMENT: 'documents',
    },
    operations: {
        OP_GET: 'get',
        OP_INSERT: 'insert',
        OP_UPDATE: 'update',
    },
    messages: {
        vtexUtils: 'VtexUtils.js is required and must be an instance. Download it from https://www.npmjs.com/package/vtex-utils and use "new VtexMasterdata(new VtexUtils())"',
        vtexUtilsVersion: vtexUtilsVersion,
        vtexUtilsVersionMessage: `VtexUtils version must be higher than ${vtexUtilsVersion}. Download last version on https://www.npmjs.com/package/vtex-utils`,
        storeName: 'Store name must be a string and not empty.',
    },
};
