import { Alert, AppBar, Autocomplete, Box, Button, CircularProgress, Container, CssBaseline, Grid, IconButton, Snackbar, TextField, Toolbar, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import stops from "./assets/stops.json"
import { StopsList } from "./StopsList";

import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import GpsOffIcon from '@mui/icons-material/GpsOff';

function App() {
  const [stop, setStop] = useState(null)
  const [fetchedStop, setFetchedStop] = useState(null)
  const [busesList, setBusesList] = useState([])
  const [stopsError, setStopsError] = useState(null)
  const [stopNames, setStopNames] = useState([])
  const [filteredStops, setFilteredStops] = useState([])
  const [loadingStops, setLoadingStops] = useState(false)
  const [location, setLocation] = useState(null)
  const [hasLoc, setHasLoc] = useState(false)
  const [locError, setLocError] = useState(null)
  const [locFilter, setLocFilter] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const latFrame = 0.002;
  const lonFrame = 0.004

  const fieldRef = useRef()

  useEffect(() => {
    const processedStops = Object.entries(stops).map((s) => {
      return { label: `${s[0]} - ${s[1].stop_name}`, key: s[0], stop_lat: s[1].stop_lat, stop_lon: s[1].stop_lon }
    })
    setStopNames(processedStops)
    setFilteredStops(processedStops)
    getLocation()
    setInterval(getLocation, 30000)
  }, [])

  useEffect(() => {
    fetchStopData()
  }, [stop])

  useEffect(() => {
    filterStops()
  }, [locFilter])

  async function fetchStopData() {
    if (stop) {
      setLoadingStops(true)
      fieldRef.current.getElementsByTagName('input')[0].blur()
      try {
        const data = await fetch(`https://data.foli.fi/siri/sm/${stop.key}`);
        const newStops = await data.json();
        setBusesList(newStops.result)
        setFetchedStop(stop.label)
        setStopsError(null)
        setLoadingStops(false)
      } catch (err) {
        setStopsError(err)
        setFetchedStop(null)
        setLoadingStops(false)
      }
    }
  }

  function getLocation() {
    // 60.445668, 22.273896
    // 0.005 - 0.01
    if (navigator.geolocation) {
      setHasLoc(true)
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocError(null)
        setLocation(pos.coords)
      },
      (err) => {
        console.error('geoloc.error', err)
        setLocation(null)
        if (err.code === 1) {
          setHasLoc(false)
        } else {
          setLocError(err)
        }
      })
    } else {
      setLocation(null)
      setHasLoc(false)
      console.error('no geoloc avalliable')
    }
  }

  function handleFilterClick() {
    setLocFilter(!locFilter && location)
    if (locError || !hasLoc) {
      setSnackOpen(true)
    }
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

  function handleCloseSnack() {
    setSnackOpen(false)
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Grid container >
            <Grid item xs>
              <Autocomplete
                ref={fieldRef}
                size="small"
                options={filteredStops}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                onChange={(e, v) => setStop(v ? v : null)}
                renderInput={(params) => <TextField {...params} sx={{ '.MuiInputBase-root': { backgroundColor: "#FFF" } }} placeholder="Pysäkki" />}
                ListboxProps={{ style: { maxHeight: '85vh' } }}
              />
            </Grid>
            <Grid item>
              <Button
                variant={locFilter ? 'outlined' : 'text'}
                color="inherit"
                sx={{ml: '1em', height: '100%'}}
                onClick={handleFilterClick}
              >
                { !hasLoc || locError ? <GpsOffIcon /> : location ? <MyLocationIcon /> : <LocationSearchingIcon className="rotate"/>}
              </Button>
            </Grid>
              {
                stopsError?.name !== undefined ? (
                  <Grid item xs={12}>
                    <Typography variant="body1">{`${stopsError.name}: ${stopsError.message}.`}</Typography>
                  </Grid>
                ) : null
              }
          </Grid>

        </Toolbar>
        <Container>
          <Typography variant="h6" mb="0.5em">{fetchedStop}</Typography>
        </Container>
      </AppBar>
      <Container>
        <Box
          height="100%"
          width="100vw"
          position="absolute"
          backgroundColor="rgba(255,255,255, 0.5)"
          display={loadingStops ? 'flex' : 'none'}
          justifyContent="center"
          alignItems="center"
          top={0}
          left={0}
        >
          <CircularProgress color="inherit" />
        </Box>
        <StopsList busesList={busesList}></StopsList>
      </Container>
      <Snackbar
        open={snackOpen}
        onClose={handleCloseSnack}
        autoHideDuration={3000}
      >
        <Alert severity="error" variant="filled" sx={{width: "100%"}}>
          {!hasLoc ? 'Sijaintipalvelut ei käytössä' : locError ? 'Sijantipalvelussa virhe' : 'Sijainti käytössä'}
        </Alert>
      </Snackbar>
    </>
  )
}

export default App
