import { Table, TableBody, TableCell, TableRow, Box, CircularProgress } from "@mui/material";

export function StopsList({busesList, loadingStops}) {

  function formatTime(stop) {
    const time = new Date(stop.expectedarrivaltime * 1000)
    const delta = time - new Date()
    let showTime = ''
    if (delta < 30 * 60 * 1000) {
      showTime = `${stop.monitored ? '' : '~'}${Math.floor(delta / 1000 / 60)} min`
    } else {
      showTime = time.toLocaleTimeString().slice(0, -3)
    }
    return showTime
  }

  function formatDelay(stop) {
    return stop.delay ? ` (${stop.delay > -1 ? '+' : ''}${Math.floor(stop.delay / 60)} min)` : ''
  }

  return (
    <>
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
      <Table>
        <TableBody>
          {busesList.map((s, i) => <TableRow key={i}>
            <TableCell className="schedule-cell">{s.lineref} {s.destinationdisplay}</TableCell>
            <TableCell className="schedule-cell" align="right">{formatTime(s)}</TableCell>
            <TableCell className="schedule-cell" align="right">{formatDelay(s)}</TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </>
  );
}
