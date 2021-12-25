import React, { useEffect, useState, useCallback } from "react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { Popup } from "react-map-gl";
import usaHeatMapData from "../../assets/usa-heatmap.json";
import BaseMap, { DEFAULT_INITIAL_VIEWSTATE } from "./BaseMap";
import { bboxFromGeoJson, bbox2Viewport } from "../../js/GeoHelpers";

const Color_Range = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

const NAV_BAR_OFFSET = 66;

export default function Heatmap({ geojson, children, getTooltip }) {
  const [[width, height], setWH] = useState([400, 400]);
  const [viewstate, setViewState] = useState(DEFAULT_INITIAL_VIEWSTATE);
  const [popupInformation, setPopupInformation] = useState(null);
  useEffect(() => {
    if (!geojson) return;

    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    const bbox = bboxFromGeoJson(geojson);
    const vs = bbox2Viewport(bbox, width, height);

    if (geojson.geometry && geojson.geometry.type.toUpperCase() === "POINT") {
      setViewState({ ...vs, zoom: 10 });
    } else {
      setViewState(vs);
    }
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [geojson]);

  const onViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState);
  });

  const updateDimensions = useCallback(() => {
    const { width, height } = getMapDivDimensions("my-area-map");
    setWH([width, height]);
  });

  const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
  };

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: geojson ? geojson : [],
      pickable: false,
      stroked: true,
      filled: viewstate.zoom < 8,
      extruded: false,
      pointType: "circle",
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [251, 113, 133, 50],
      opacity: viewstate.zoom < 6 ? 1 : 0.2,
      getLineColor: [253, 164, 175],
      getPointRadius: 100,
      getLineWidth: 4,
      getElevation: 0,
    }),
    new HeatmapLayer({
      data: usaHeatMapData,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d.lon, d.lat, 10],
      getWeight: 1,
      radiusPixels: 20,
      intensity: 1,
      threshold: 0.03,
      opacity: 0.65,
      colorRange: Color_Range,
    }),
    new IconLayer({
      id: "icon-layer",
      data: children,
      pickable: true,
      iconAtlas:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      iconMapping: ICON_MAPPING,
      getIcon: (d) => "marker",
      sizeScale: 15,
      getPosition: (d) => [
        d.frontmatter.metadata.lng,
        d.frontmatter.metadata.lat,
        12,
      ],
      // onHover: (info, event) => console.log("Hovered:", info, event),
      // onClick: (info, event) => {
      //   setPopupInformation(info.object);
      // },
      getSize: (d) => 2,
      getColor: (d) => [139, 177, 146],
    }),
  ];

  return (
    <div
      id="my-area-map"
      className="w-full xl:sticky xl:top-16 z-9 xl:m-0 xl:p-0"
      style={{ height }}
    >
      <BaseMap
        getTooltip={getTooltip}
        layers={layers}
        initialViewState={viewstate}
        viewstate={viewstate}
        onViewStateChange={onViewStateChange}
      >
        {popupInformation && (
          <Popup
            latitude={popupInformation.frontmatter.metadata.lat}
            longitude={popupInformation.frontmatter.metadata.lng}
            closeButton={true}
            closeOnClick={false}
            onClose={() => {
              setPopupInformation(null);
            }}
            anchor="top"
          >
            <div>{popupInformation.frontmatter.area_name}</div>
          </Popup>
        )}
      </BaseMap>
    </div>
  );
}

const getMapDivDimensions = (id) => {
  const div = document.getElementById(id);
  let width = 200;
  if (div) {
    width = div.clientWidth;
  }
  const height = window.innerHeight - NAV_BAR_OFFSET;
  return { width, height };
};
