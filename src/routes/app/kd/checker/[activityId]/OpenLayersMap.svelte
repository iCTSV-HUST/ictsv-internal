<script lang="ts">
	// Svelte
	import type { Action } from 'svelte/action';

	// OpenLayers
	import Map from 'ol/Map';
	import TileLayer from 'ol/layer/Tile';
	import Feature from 'ol/Feature';

	import View from 'ol/View';
	import OSM from 'ol/source/OSM';
	import { useGeographic } from 'ol/proj';

	import { Circle, Geometry, Point } from 'ol/geom';
	import { Modify, defaults as defaultInteractions } from 'ol/interaction';
	import Collection from 'ol/Collection';

	import { Vector as VectorSource } from 'ol/source';
	import { Vector as VectorLayer } from 'ol/layer';
	import { Style, Stroke, Fill, Circle as StyleCircle } from 'ol/style';

	import { asArray } from 'ol/color';

	// Hard coding HUST location
	let area_radius = 0.0035;
	let area_coords = [105.8435, 21.0048];

	useGeographic();

	// Define circle color
	const circleClr = 'blue';

	// Default circle range
	const circle = new Circle(area_coords, area_radius);
	const center_point = new Point(area_coords);

	function onResize() {
		area_radius = circle.getRadius();
		area_coords = circle.getCenter();
		center_point.setCoordinates(area_coords);
	}

	circle.on('change', onResize);

	// Exports
	// Local state
	let mapId = 20;
	let map: Map | null = null;

	// Marker initialziation
	// export let marker = [0, 0];
	// const marker_point = new Point(marker);
	// $: marker_point.setCoordinates(marker);
	// const markerFeature = new Feature(marker_point);

	// --------------------
	// THIS PART IS DYNAMIC
	const vectorSource = new VectorSource();
	let paintfeatures: Feature<Geometry>[] = [];

	const addPoints = (list_points: number[][]) => {
		// Remove previous points
		paintfeatures.forEach((f) => vectorSource.removeFeature(f));
		paintfeatures = [];

		for (let i = 0; i < list_points.length; i++) {
			paintfeatures.push(
				new Feature({
					geometry: new Point(list_points[i])
					// name: thepoints[i].name,
				})
			);
		}

		vectorSource.addFeatures(paintfeatures);
	};

	// Svelte 5: $props -- Replace export let
	// Svelte 5: $effect -- Replace $:
	let { markerPoints = [] }: { markerPoints: number[][] } = $props();
	$effect(() => addPoints(markerPoints));
	// END OF DYNAMIC
	// --------------------

	// Set up
	const setupMap: Action = (node) => {
		const osmLayer = new TileLayer({
			source: new OSM({ url: 'https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png' })
		});

		map = new Map({
			renderer: 'webgl',
			target: node.id,
			layers: [osmLayer],
			view: new View({
				center: [105.8435, 21.0048],
				zoom: 16,
				maxZoom: 16,
				minZoom: 15
			}),
			interactions: defaultInteractions({
				dragPan: false,
				keyboard: false
			})
		});

		const circleFeature = new Feature(circle);
		const centerFeature = new Feature(center_point);
		centerFeature.setStyle(
			new Style({
				image: new StyleCircle({
					radius: 5,
					fill: new Fill({ color: circleClr })
				})
			})
		);

		// const checkinPoints = getCheckinPointsFeatures();
		// Marker initialziation
		// const markerFeature = new Feature(marker_point);

		vectorSource.addFeatures([circleFeature, centerFeature]);

		// Modify circle
		const modify = new Modify({ features: new Collection([circleFeature]) });
		map.addInteraction(modify);

		// Define custom color circle background
		const circleBg = asArray(circleClr);
		circleBg[3] = 0.1;

		// Create a new vector layer to hold the circle geometry
		const vectorLayer = new VectorLayer({
			source: vectorSource,
			style: new Style({
				stroke: new Stroke({
					color: circleClr,
					width: 2
				}),
				fill: new Fill({
					color: circleBg
				}),
				image: new StyleCircle({
					radius: 7,
					fill: new Fill({ color: 'red' })
				})
			})
		});

		// Add the vector layer to the map
		map.addLayer(vectorLayer);

		return {
			destroy() {
				if (map) {
					// as Map
					map.setTarget(null);
					map = null;
				}
			}
		};
	};
</script>

<div id="this-map" style="height: 100%;" use:setupMap>
	<!-- <div id="tooltip" class="tooltip"></div> -->
</div>
