import { Button, Container, Grid, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@mui/material"
import { useState } from "react"

function App() {
  const [stop, setStop] = useState('')
  const [stopslist, setStopsList] = useState([])
  const [error, setError] = useState(null)

  async function fetchStops() {
    if (stop) {
      try {
        const data = await fetch(`http://data.foli.fi/siri/sm/${stop}`);
        const newStops = await data.json();
        setStopsList(newStops.result)
        setError(null)
      } catch(err) {
        setError(err)
      }
    }
  }

  return (
    <>
      <Container>
        <Grid container>
          <Grid item xs={3}>
            <TextField label="Pysäkki" size="small" onChange={(e) => setStop(e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <Button variant="outlined" onClick={fetchStops}>Hae</Button>
          </Grid>
          <Grid item xs={3}>
            {
              error?.name !== undefined ? (
                <Typography variant="body1">{`${ error.name}: ${error.message}.`}</Typography>
                ) : null
            }
          </Grid>
        </Grid>
        <Table>
          <TableBody>
            { stopslist.map((s, i) => (
              <TableRow key={i}>
                <TableCell>{s.lineref} {s.destinationdisplay}</TableCell>
                <TableCell>{new Date(s.expectedarrivaltime * 1000).toLocaleTimeString().slice(0,5)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  )
}

export default App
