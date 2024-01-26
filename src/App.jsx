import { AppBar, Autocomplete, Button, Container, CssBaseline, Grid, Table, TableBody, TableCell, TableRow, TextField, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import stops from "./assets/stops.json"

function App() {
  const [stop, setStop] = useState('')
  const [busesList, setBusesList] = useState([])
  const [error, setError] = useState(null)
  const [stopNames, setStopNames] = useState([])

  useEffect(() => {
    const processedStops = Object.entries(stops).map((s) => {
      return {label: `${s[0]} - ${s[1].stop_name}`, key: s[0]}
    })
    setStopNames(processedStops)
  }, [])

  async function fetchStopData() {
    if (stop) {
      try {
        const data = await fetch(`http://data.foli.fi/siri/sm/${stop}`);
        const newStops = await data.json();
        setBusesList(newStops.result)
        setError(null)
      } catch(err) {
        setError(err)
      }
    }
  }

  function formatTime(stop) {
    const time = new Date(stop.expectedarrivaltime * 1000)
    const delta = time - new Date()
    let showTime = ''
    if (delta < 10 * 60 * 1000) {
      showTime = `${Math.floor(delta / 1000 / 60)} min`
    } else {
      showTime = time.toLocaleTimeString().slice(0,-3)
    }
    return showTime
  }

  function formatDelay(stop) {
    return stop.delay ? ` (${stop.delay > -1 ? '+' : ''}${Math.floor(stop.delay / 60)} min)` : ''
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
        <Grid container >
          <Grid item xs pr="1em">
            <Autocomplete
              
              size="small"
              options={stopNames}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              onChange={(e, v) => setStop(v ? v.key : null)}
              renderInput={(params) => <TextField {...params} sx={{'.MuiInputBase-root':{backgroundColor: "#FFF"}}} placeholder="Pysäkki" />}
            />
          </Grid>
          <Grid item>
            <Button sx={{backgroundColor: "#FFF", height: '100%'}} variant="outlined" onClick={fetchStopData}>Hae</Button>
          </Grid>
          <Grid item xs={12}>
            {
              error?.name !== undefined ? (
                <Typography variant="body1">{`${ error.name}: ${error.message}.`}</Typography>
                ) : null
            }
          </Grid>
        </Grid>
          
        </Toolbar>
      </AppBar>
      <Container sx={{mt: '2em'}}>
        <Table>
          <TableBody>
            { busesList.map((s, i) => (
              <TableRow key={i}>
                <TableCell>{s.lineref} {s.destinationdisplay}</TableCell>
                <TableCell align="right">{formatTime(s)}</TableCell>
                <TableCell align="right">{formatDelay(s)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  )
}

export default App
