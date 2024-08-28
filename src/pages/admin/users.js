import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './admin.css';


function Users() {

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
      }
      const rows = [
        createData('Izadora Carvalho', 'IzadoraCarvalh@gmail.com', 999888777, 24, 0),
        createData('Regina Carvalho', 'ReginaCarvalho@gmail.com', 999888777, 37, 0),
        createData('Vinicius Carvalho','ViniciusCarvalho@gmail.com', 999888777, 24, 0),
      ];


    return (
        <>
            <div className='container-white'>
                <div className='top-container'>
                    <h2>Usuarios</h2>
                </div>
                <br/>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Editar</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell align="center">Email</TableCell>
                        <TableCell align="right">Contacto</TableCell>
                        <TableCell align="right">Categorias</TableCell>
                        <TableCell align="right">Marcaçoes</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            <button className="add-event-btn">
                            <i className="fas fa-pen"></i>
                            </button>
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
              
        </>
    );
}
    
export default Users;