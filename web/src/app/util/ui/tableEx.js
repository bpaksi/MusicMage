import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: "#f2f2f2"
      // backgroundColor: theme.palette.background.default,
    }
  }
}))(TableRow);

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "lightgrey",
    // color: theme.palette.common.white,
    fontSize: 16
  },
  body: {
    // fontSize: 14,
  }
}))(TableCell);

export const TableHeadEx = ({ columns }) => (
  <TableHead>
    <TableRow>
      {columns.map(column => (
        <StyledTableCell key={column.id} align="center">
          {column.label}
        </StyledTableCell>
      ))}
    </TableRow>
  </TableHead>
);

export const TableEx = ({ data, columns, onRowProps }) => {
  const rows = [...Array(data.length).keys()];

  return (
    <Table size="small">
      <TableHeadEx columns={columns} />
      <TableBody>
        {rows.map((row, rowIdx) => {
          const rowProps = onRowProps
            ? onRowProps(data[row], rowIdx)
            : data[row];

          return (
            <StyledTableRow key={row}>
              {columns.map(column => (
                <StyledTableCell key={column.id} style={{ padding: "3px" }}>
                  {column.render(rowProps)}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
