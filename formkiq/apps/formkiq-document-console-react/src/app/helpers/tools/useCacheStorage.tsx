export enum storageKeys {
  allTags = 'allTags',
  allAttributes = 'allAttributes',
}

async function saveByKey(data: any, key: string) {
    caches.open('formkiq-document-console').then(function(cache) {
        cache.put(key, new Response(JSON.stringify(data)))
    })
}
async function getByKey(key: string) {
    const cache = await caches.open('formkiq-document-console')
    const response = await cache.match(key)
    if (response) {
        return await response.json()
    }
    return null
}

export const setAllTags = (data: any) => saveByKey(data, storageKeys.allTags)
export const getAllTags = () => getByKey(storageKeys.allTags)
export const setAllAttributes = (data: any) => saveByKey(data, storageKeys.allAttributes)
export const getAllAttributes = () => getByKey(storageKeys.allAttributes)
