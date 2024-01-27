import { AppBar, Autocomplete, Button, Container, CssBaseline, Grid, TextField, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import stops from "./assets/stops.json"
import { StopsList } from "./StopsList";

function App() {
  const [stop, setStop] = useState(null)
  const [fetchedStop, setFetchedStop] = useState(null)
  const [busesList, setBusesList] = useState([])
  const [error, setError] = useState(null)
  const [stopNames, setStopNames] = useState([])

  useEffect(() => {
    const processedStops = Object.entries(stops).map((s) => {
      return { label: `${s[0]} - ${s[1].stop_name}`, key: s[0] }
    })
    setStopNames(processedStops)
  }, [])

  useEffect(() => {
    fetchStopData()
  }, [stop])

  async function fetchStopData() {
    if (stop) {
      try {
        const data = await fetch(`https://data.foli.fi/siri/sm/${stop.key}`);
        const newStops = await data.json();
        setBusesList(newStops.result)
        setFetchedStop(stop.label)
        setError(null)
      } catch (err) {
        setError(err)
        setFetchedStop(null)
      }
    }
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Grid container >
            <Grid item xs>
              <Autocomplete

                size="small"
                options={stopNames}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                onChange={(e, v) => setStop(v ? v : null)}
                renderInput={(params) => <TextField {...params} sx={{ '.MuiInputBase-root': { backgroundColor: "#FFF" } }} placeholder="Pysäkki" />}
              />
            </Grid>
              {
                error?.name !== undefined ? (
                  <Grid item xs={12}>
                    <Typography variant="body1">{`${error.name}: ${error.message}.`}</Typography>
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
        <StopsList busesList={busesList}></StopsList>
      </Container>
    </>
  )
}

export default App
