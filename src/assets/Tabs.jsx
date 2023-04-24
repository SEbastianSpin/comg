import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddPhotoAlternateSharpIcon from '@mui/icons-material/AddPhotoAlternateSharp';
import ShapeLineSharpIcon from '@mui/icons-material/ShapeLineSharp';
import Liezno from './Lienzo';
import MyDiv from './MyDiv';
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
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

export default function BasicTabs({ uploadf ,userImage}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' , height:"100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                   
                    <Tab label="Vector" {...a11yProps(0)} />
                    <Tab label="Pixel" {...a11yProps(1)} />

                </Tabs>
            </Box>

            <TabPanel value={value} index={0}   >
                <Liezno></Liezno>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <Button component="label">
                    <AddPhotoAlternateSharpIcon> </AddPhotoAlternateSharpIcon>
                    <input hidden id="upload" type="file" accept="image/*" onChange={uploadf} />
                </Button>

                <MyDiv userImage={userImage}>

                </MyDiv>

            </TabPanel>
            

        </Box>
    );
}
