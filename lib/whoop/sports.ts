export type DisciplineKey =
  | "swim"
  | "bike"
  | "run"
  | "brick"
  | "strength"
  | "accessory"
  | "soccer"

export const SPORT_TO_DISCIPLINE: Record<string, DisciplineKey> = {
  running:             "run",
  trail_running:       "run",
  treadmill:           "run",
  cycling:             "bike",
  road_cycling:        "bike",
  mountain_biking:     "bike",
  indoor_cycling:      "bike",
  spin:                "bike",
  swimming:            "swim",
  pool_swimming:       "swim",
  open_water_swimming: "swim",
  weightlifting:       "strength",
  functional_fitness:  "strength",
  triathlon:           "brick",
  duathlon:            "brick",
  brick:               "brick",
  soccer:              "soccer",
}

export const OTHER_SPORT_STYLE = { emoji: "•", color: "#666" }
