import {
  Alert,
  AppBar,
  Container,
  CssBaseline,
  Grid,
  Snackbar,
  Typography
} from "@mui/material"
import { useEffect, useState } from "react"
import stops from "./assets/stops.json"
import { StopsList } from "./StopsList";

import FilterBar from "./components/FilterBar";

function App() {
  const [stop, setStop] = useState(null)
  const [fetchedStop, setFetchedStop] = useState(null)
  const [busesList, setBusesList] = useState([])
  const [stopsError, setStopsError] = useState(null)
  const [stopNames, setStopNames] = useState([])
  const [loadingStops, setLoadingStops] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [locMessage, setLocMessage] = useState('')

  useEffect(() => {
    const processedStops = Object.entries(stops).map((s) => {
      return { label: `${s[0]} - ${s[1].stop_name}`, key: s[0], stop_lat: s[1].stop_lat, stop_lon: s[1].stop_lon }
    })
    setStopNames(processedStops)
  }, [])

  useEffect(() => {
    fetchStopData()
  }, [stop])

  async function fetchStopData() {
    if (stop) {
      setLoadingStops(true)
      // fieldRef.current.getElementsByTagName('input')[0].blur()
      try {
        const data = await fetch(`https://data.foli.fi/siri/sm/${stop.key}`);
        const newStops = await data.json();
        setBusesList(newStops.result)
        setFetchedStop(stop.label)
        setStopsError(null)
        setLoadingStops(false)
      } catch (err) {
        setFetchedStop(null)
        setStopsError(err)
        setLoadingStops(false)
      }
    }
  }

  function showLocMessage(message) {
    setLocMessage(message)
    setSnackOpen(true)
  }
  
  function handleCloseSnack() {
    setSnackOpen(false)
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <FilterBar stopNames={stopNames} onSetStop={(s) => setStop(s)} onLocUsageChange={showLocMessage} locPermissionMessage />
        <Container>
          <Typography variant="h6" mb="0.5em">{fetchedStop}</Typography>
        </Container>
      </AppBar>
      <Container>
      {
            stopsError?.name !== undefined ? (
              <Grid item xs={12}>
                <Typography variant="body1">{`${stopsError.name}: ${stopsError.message}.`}</Typography>
              </Grid>
            ) : null
          }
        <StopsList busesList={busesList} loadingStops={loadingStops}></StopsList>
      </Container>
      <Snackbar
        open={snackOpen}
        onClose={handleCloseSnack}
        autoHideDuration={3000}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {locMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default App
