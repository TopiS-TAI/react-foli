import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Toolbar,
} from "@mui/material"
import { useEffect, useState, useRef } from "react"

import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import GpsOffIcon from '@mui/icons-material/GpsOff';
import '../index.css'

function FilterBar({ stopNames, onSetStop, onLocUsageChange }) {
  const [filteredStops, setFilteredStops] = useState([])
  const [location, setLocation] = useState(null)
  const [hasLoc, setHasLoc] = useState(false)
  const [locError, setLocError] = useState(null)
  const [locFilter, setLocFilter] = useState(false)

  const latFrame = 0.002;
  const lonFrame = 0.004
  const fieldRef = useRef()

  useEffect(() => {
    setInterval(getLocation, 10000)
  })

  useEffect(() => {
    setFilteredStops(stopNames)
  }, [stopNames])

  useEffect(() => {
    filterStops()
  }, [locFilter])

  useEffect(() => {
    console.log('hasloc', hasLoc)
    console.log('locerror', locError)
    onLocUsageChange(getLocMessage)
  }, [hasLoc, locError])

  function getLocation() {
    // 60.445668, 22.273896
    // 0.005 - 0.01
    if (navigator.geolocation) {
      if (!hasLoc) {
        setHasLoc(true)
      }
      navigator.geolocation.getCurrentPosition((pos) => {
        if (locError) {
          setLocError(null)
        }
        setLocation(pos.coords)
      },
        (err) => {
          console.error('geoloc.error', err)
          setLocation(null)
          if (err.code === 1 && hasLoc) {
            setHasLoc(false)
          } else if (!locError || err.code !== locError.code) {
            setLocError(err)
          }
        })
    } else {
      setLocation(null)
      if (hasLoc) {
        setHasLoc(false)
      }
      console.error('no geoloc avalliable')
    }
  }

  function handleFilterClick() {
    setLocFilter(!locFilter && location)
  }

  function filterStops() {
    if (location && locFilter) {
      const filteredStops = stopNames.filter((s) => {
        return (
          (location.latitude - latFrame / 2) < s.stop_lat && s.stop_lat < (location.latitude + latFrame / 2) &&
          (location.longitude - lonFrame / 2) < s.stop_lon && s.stop_lon < (location.longitude + lonFrame / 2)
        )
      })
      setFilteredStops(filteredStops)
    } else {
      if (stopNames.length) {
        setFilteredStops(stopNames)
      }
    }
  }

  function getLocMessage() {
    return !hasLoc ? 'Sijaintipalvelut ei käytössä' : locError ? 'Sijantipalvelussa virhe' : 'Sijainti käytössä'
  }

  function blurInput() {
    fieldRef.current.getElementsByTagName('input')[0].blur()
  }

  return (
    <>
      <Toolbar>
        <Grid container >
          <Grid item xs>
            <Autocomplete
              ref={fieldRef}
              size="small"
              options={filteredStops}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              noOptionsText="Ei pysäkkejä lähistöllä"
              onChange={(e, v) => onSetStop(v ? v : null)}
              renderInput={(params) => <TextField {...params} sx={{ '.MuiInputBase-root': { backgroundColor: "#FFF" } }} placeholder="Pysäkki" />}
              ListboxProps={{ style: { maxHeight: '85vh' } }}
            />
          </Grid>
          <Grid item>
            <Button
              variant={locFilter ? 'outlined' : 'text'}
              color="inherit"
              sx={{ ml: '1em', height: '100%' }}
              onClick={handleFilterClick}
            >
              {!hasLoc || locError ? <GpsOffIcon /> : location ? <MyLocationIcon /> : <LocationSearchingIcon className="rotate" />}
            </Button>
          </Grid>

        </Grid>
      </Toolbar>
    </>
  )
}

export default FilterBar;