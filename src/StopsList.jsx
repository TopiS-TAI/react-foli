import { Table, TableBody, TableCell, TableRow } from "@mui/material";

export function StopsList(props) {

  function formatTime(stop) {
    const time = new Date(stop.expectedarrivaltime * 1000)
    const delta = time - new Date()
    let showTime = ''
    if (delta < 30 * 60 * 1000) {
      showTime = `${Math.floor(delta / 1000 / 60)} min`
    } else {
      showTime = time.toLocaleTimeString().slice(0, -3)
    }
    return showTime
  }

  function formatDelay(stop) {
    return stop.delay ? ` (${stop.delay > -1 ? '+' : ''}${Math.floor(stop.delay / 60)} min)` : ''
  }

  return (<Table>
    <TableBody>
      {props.busesList.map((s, i) => <TableRow key={i}>
        <TableCell className="schedule-cell">{s.lineref} {s.destinationdisplay}</TableCell>
        <TableCell className="schedule-cell" align="right">{formatTime(s)}</TableCell>
        <TableCell className="schedule-cell" align="right">{formatDelay(s)}</TableCell>
      </TableRow>)}
    </TableBody>
  </Table>);
}
