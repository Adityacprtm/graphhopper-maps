import QueryStore from '@/stores/QueryStore'
import RouteStore from '@/stores/RouteStore'
import ApiInfoStore from '@/stores/ApiInfoStore'
import ErrorStore from '@/stores/ErrorStore'
import MapOptionsStore from '@/stores/MapOptionsStore'
import PathDetailsStore from '@/stores/PathDetailsStore'

let queryStore: QueryStore
let routeStore: RouteStore
let infoStore: ApiInfoStore
let errorStore: ErrorStore
let mapOptionsStore: MapOptionsStore
let pathDetailsStore: PathDetailsStore

interface StoresInput {
    queryStore: QueryStore
    routeStore: RouteStore
    infoStore: ApiInfoStore
    errorStore: ErrorStore
    mapOptionsStore: MapOptionsStore
    pathDetailsStore: PathDetailsStore
}

export const setStores = function(stores: StoresInput) {
    queryStore = stores.queryStore
    routeStore = stores.routeStore
    infoStore = stores.infoStore
    errorStore = stores.errorStore
    mapOptionsStore = stores.mapOptionsStore
    pathDetailsStore = stores.pathDetailsStore
}

export const getQueryStore = () => queryStore
export const getRouteStore = () => routeStore
export const getApiInfoStore = () => infoStore
export const getErrorStore = () => errorStore
export const getMapOptionsStore = () => mapOptionsStore
export const getPathDetailsStore = () => pathDetailsStore
