import { Action } from '@/stores/Dispatcher'
import { Coordinate, QueryPoint } from '@/stores/QueryStore'
import { ApiInfo, Bbox, Path, RoutingArgs, RoutingResult, RoutingProfile } from '@/api/graphhopper'
import { StyleOption } from '@/stores/MapOptionsStore'
import { PathDetailsPoint } from '@/stores/PathDetailsStore'
import { ViewportStoreState } from '@/stores/ViewportStore'

export class InfoReceived implements Action {
    readonly result: ApiInfo

    constructor(result: ApiInfo) {
        this.result = result
    }
}

export class SetPoint implements Action {
    readonly point: QueryPoint

    constructor(point: QueryPoint) {
        this.point = point
    }
}

export class SetVehicleProfile implements Action {
    readonly profile: RoutingProfile

    constructor(profile: RoutingProfile) {
        this.profile = profile
    }
}

export class AddPoint implements Action {
    readonly atIndex: number
    readonly coordinate: Coordinate
    readonly isInitialized: boolean

    constructor(atIndex: number, coordinate: Coordinate, isInitialized: boolean) {
        this.atIndex = atIndex
        this.coordinate = coordinate
        this.isInitialized = isInitialized
    }
}

export class ClearPoints implements Action {}

export class RemovePoint implements Action {
    readonly point: QueryPoint

    constructor(point: QueryPoint) {
        this.point = point
    }
}

export class InvalidatePoint implements Action {
    readonly point: QueryPoint

    constructor(point: QueryPoint) {
        this.point = point
    }
}

export class RouteRequestSuccess implements Action {
    readonly result: RoutingResult
    readonly request: RoutingArgs

    constructor(request: RoutingArgs, result: RoutingResult) {
        this.result = result
        this.request = request
    }
}

export class RouteRequestFailed implements Action {
    readonly errorMessage: string
    readonly request: RoutingArgs

    constructor(request: RoutingArgs, errorMessage: string) {
        this.errorMessage = errorMessage
        this.request = request
    }
}

export class ClearRoute implements Action {}

export class SetSelectedPath implements Action {
    readonly path: Path

    constructor(path: Path) {
        this.path = path
    }
}

export class DismissLastError implements Action {}

export class SelectMapStyle implements Action {
    readonly styleOption: StyleOption

    constructor(styleOption: StyleOption) {
        this.styleOption = styleOption
    }
}

export class MapIsLoaded implements Action {}

export class SetViewport implements Action {
    readonly viewport: ViewportStoreState

    constructor(viewport: ViewportStoreState) {
        this.viewport = viewport
    }
}

export class SetViewportToBbox implements Action {
    readonly bbox: Bbox

    constructor(bbox: Bbox) {
        this.bbox = bbox
    }
}

export class PathDetailsHover implements Action {
    readonly pathDetailsPoint: PathDetailsPoint | null

    constructor(pathDetailsPoint: PathDetailsPoint | null) {
        this.pathDetailsPoint = pathDetailsPoint
    }
}

export class PathDetailsRangeSelected implements Action {
    readonly bbox: Bbox | null

    constructor(bbox: Bbox | null) {
        this.bbox = bbox
    }
}

export class PathDetailsElevationSelected implements Action {
    readonly segments: Coordinate[][]

    constructor(segments: Coordinate[][]) {
        this.segments = segments
    }
}
