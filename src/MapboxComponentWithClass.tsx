// import mapbox like this instead of {Map} from 'mapbox-gl' because otherwise the app is missing some global mapbox state
import 'mapbox-gl/dist/mapbox-gl.css'

import { Path } from '@/routing/Api'
import { QueryPoint } from '@/stores/QueryStore'
import React, { useEffect, useRef, useState } from 'react'
import styles from '@/MapComponent.module.css'
import { GeoJSONSource, LngLat, LngLatBounds, Map, MapMouseEvent, Marker, Popup } from 'mapbox-gl'
import Dispatcher from '@/stores/Dispatcher'
import { SetPoint } from '@/actions/Actions'
import createPopup from '@/Popup'

type ComponentWithClassProps = {
    path: Path
    queryPoints: QueryPoint[]
    bbox: [number, number, number, number]
}

export default function ({ path, queryPoints, bbox }: ComponentWithClassProps) {
    const mapContainerRef: React.RefObject<HTMLDivElement> = useRef(null)
    const [map, setMap] = useState<MapboxWrapper | null>(null)

    useEffect(() => {
        const mapWrapper = new MapboxWrapper(
            mapContainerRef.current!,
            () => {
                setMap(mapWrapper)
            },
            e => {
                console.log('onclick: ' + e.lngLat)
            },
            e => {
                mapWrapper.drawPopup(e.lngLat, createPopup(e.lngLat, queryPoints))
            }
        )
        return () => map?.remove()
    }, [])
    useEffect(() => map?.drawLine(path), [path, map])
    useEffect(() => map?.drawMarkers(queryPoints), [queryPoints, map])
    useEffect(() => map?.fitBounds(bbox), [bbox, map])

    return <div className={styles.map} ref={mapContainerRef} />
}

const lineSourceKey = 'route'
const lineLayerKey = 'lines'
// have this right here for now. Not sure if this needs to be abstracted somewhere else
const mediaQuery = window.matchMedia('(max-width: 640px)')

class MapboxWrapper {
    private map: Map
    private markers: Marker[] = []
    private popup: Popup = new Popup({ closeOnMove: true, closeOnClick: true, closeButton: false })

    private mapIsReady = false

    constructor(
        container: HTMLDivElement,
        onMapReady: () => void,
        onClick: (e: MapMouseEvent) => void,
        onContextMenu: (e: MapMouseEvent) => void
    ) {
        this.map = new Map({
            container: container,
            accessToken:
                'pk.eyJ1IjoiamFuZWtkZXJlcnN0ZSIsImEiOiJjajd1ZDB6a3A0dnYwMnFtamx6eWJzYW16In0.9vY7vIQAoOuPj7rg1A_pfw',
            style: 'mapbox://styles/mapbox/streets-v11',
        })

        this.map.on('load', () => {
            this.map.addSource(lineSourceKey, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: [],
                    },
                },
            })
            this.map.addLayer({
                id: lineLayerKey,
                type: 'line',
                source: lineSourceKey,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#888',
                    'line-width': 8,
                },
            })
            this.mapIsReady = true
            onMapReady()
        })

        this.map.on('click', onClick)
        this.map.on('contextmenu', onContextMenu)
    }

    remove() {
        this.map.remove()
    }

    drawLine(path: Path) {
        if (!this.mapIsReady) return

        console.log('draw line')
        const source = this.map.getSource(lineSourceKey) as GeoJSONSource
        if (path.points.coordinates.length > 0) {
            source.setData({
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: path.points as GeoJSON.LineString,
                    },
                ],
            })
        } else {
            source.setData({
                features: [],
                type: 'FeatureCollection',
            })
        }
    }

    drawMarkers(queryPoints: QueryPoint[]) {
        if (!this.mapIsReady) return

        this.markers.forEach(marker => marker.remove())
        this.markers = queryPoints
            .map((point, i) => {
                return { index: i, point: point }
            })
            .filter(indexPoint => indexPoint.point.isInitialized)
            .map(indexPoint =>
                new Marker({
                    color: indexPoint.point.color,
                    draggable: true,
                })
                    .setLngLat(indexPoint.point.coordinate)
                    .on('dragend', (e: { type: string; target: Marker }) => {
                        const marker = e.target
                        const coords = marker.getLngLat()
                        Dispatcher.dispatch(new SetPoint(indexPoint.point.id, coords, indexPoint.point.queryText))
                    })
            )
        this.markers.forEach(marker => marker.addTo(this.map))
    }

    drawPopup(coordinate: LngLat, content: HTMLElement) {
        this.popup.setLngLat(coordinate).setDOMContent(content).addTo(this.map)
    }

    fitBounds(bbox: [number, number, number, number]) {
        if (bbox.every(num => num !== 0))
            this.map.fitBounds(new LngLatBounds(bbox), {
                padding: MapboxWrapper.getPadding(),
            })
    }

    private static getPadding() {
        return mediaQuery.matches
            ? { top: 200, bottom: 16, right: 16, left: 16 }
            : {
                  top: 100,
                  bottom: 100,
                  right: 100,
                  left: 400,
              }
    }
}