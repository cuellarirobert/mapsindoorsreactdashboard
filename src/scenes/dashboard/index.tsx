import { Box, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";


import { useState } from "react";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

const gridTemplateLargeScreens = `
  "a b c"
  "a b c"
  "a b c"
  "a b i"
  "d e i"
  "d e i"
  "d h i"
  "g h i"
  "g h i"
  "g h i"
`;

const gridTemplateSmallScreens = `
  "a"
  "a"
  "a"
  "a"
  "b"
  "b"
  "b"
  "b"
  "c"
  "c"
  "c"
  "d"
  "d"
  "d"
  "e"
  "e"
  "g"
  "g"
  "g"
  "h"
  "h"
  "h"
  "h"
  "i"
  "i"
  "i"
  "i"
`;





const Dashboard = () => {
  const [minAmount, setMinAmount] = useState(0);
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  const theme = useTheme();

  return (
    <Box height="85vh" bgcolor={theme.palette.background.default} color={theme.palette.text.primary}>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
<TextField
  type="number"
  value={minAmount}
  onChange={(e) => setMinAmount(e.target.value)}
  variant="outlined"
  label="Filter by Tx Amount (USD)"
  InputProps={{
    style: {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      marginTop: "-10px", // Adjust the value as needed
      width: "200%", // Adjust the value as needed
    },
  }}
  InputLabelProps={{
    style: {
      color: theme.palette.text.primary,
      minWidth: "200px",
    },
  }}
/>


      </Box>
      <Box
        width="100%"
        height="100%"
        display="grid"
        gap="1.5rem"
        sx={
          isAboveMediumScreens
            ? {
                gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
                gridTemplateAreas: gridTemplateLargeScreens,
              }
            : {
                gridAutoColumns: "1fr",
                gridAutoRows: "80px",
                gridTemplateAreas: gridTemplateSmallScreens,
              }
        }
      >
        <Row1 />
        <Row2 />
        <Row3 minAmount={parseInt(minAmount) || 0} />
      </Box>
    </Box>
  );
};

export default Dashboard;
