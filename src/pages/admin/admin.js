import * as React from 'react';
import NavBar from '../../components/navbar';
import Users from './users';
import CreateUser from './CreateUser';


import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import './admin.css';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function Admin() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
        <NavBar />
        <div className='body'>
            <div className="container-calendar">
                <div className='container'>
                  <div>
                    <h1>Administração</h1>
                    <br/>
                  </div>
                
                  <div className='container-white'>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="Usuarios" {...a11yProps(0)} />
                          <Tab label="Adicionar usuarios" {...a11yProps(1)} />
                          <Tab label="Configuração" {...a11yProps(2)} />
                        </Tabs>
                      </Box>
                      <CustomTabPanel value={value} index={0}>
                        <Users/>
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={1}>
                        <CreateUser/>
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={2}>
                        Item Three
                      </CustomTabPanel>
                    </Box>
                    
                  </div>
                </div>
            </div>
        </div>
    </>
  );
}
