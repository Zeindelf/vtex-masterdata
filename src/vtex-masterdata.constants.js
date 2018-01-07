
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
};
