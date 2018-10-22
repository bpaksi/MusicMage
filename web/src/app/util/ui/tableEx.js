import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export const TableHeadEx = ({ columns }) => (
  <TableHead>
    <TableRow>
      {columns.map(column => (
        <TableCell key={column.id} numeric={column.numeric}>
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export const TableEx = ({ data, columns, onRowProps }) => {
  const rows = [...Array(data.length).keys()];

  return (
    <Table>
      <TableHeadEx columns={columns} />
      <TableBody>
        {rows.map((row, rowIdx) => {
          const rowProps = onRowProps
            ? onRowProps(data[row], rowIdx)
            : data[row];

          return (
            <TableRow key={row}>
              {columns.map(column => (
                <TableCell key={column.id} numeric={column.numeric} style={{padding: "3px"}}>
                  {column.render(rowProps)}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
