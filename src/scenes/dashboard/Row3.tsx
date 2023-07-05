import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsAboveAmountQuery
} from "@/state/api";
import MapsIndoorsMap from '@mapsindoors/map-template/dist/mapsindoors-react.es.js';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";


const Row3 = ({ minAmount }) => { // minAmount as a prop
  console.log("Min Amount: ", minAmount);
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];

  const getRandomDate = (startDate, endDate) => {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp).toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  const startDate = new Date('2022-01-01');
  const endDate = new Date('2022-12-31');

  

  const { data: kpiData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: transactionData } = useGetTransactionsAboveAmountQuery(minAmount); // Updated hook

  // Create a new array of product IDs from the transaction data
  const transactionProductIds = transactionData?.flatMap(transaction => transaction.productIds) || [];

  // Filter the products to only include ones that are also in the transaction data
  const filteredProductData = productData?.filter(product => transactionProductIds.includes(product._id));
  const filteredProductIds = filteredProductData?.length > 0 ? filteredProductData.map(product => product._id) : [''];


  
  // Log the length of the transactionData array
  console.log('Number of transactions: ', transactionData?.length);

  const updatedTransactionData = useMemo(() => {
    if (transactionData) {
      return transactionData.map(transaction => ({
        ...transaction,
        date: getRandomDate(startDate, endDate),
      }));
    }
    return [];
  }, [transactionData, startDate, endDate]);

  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          return [
            {
              name: key,
              value: value,
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - value,
            },
          ];
        }
      );
    }
  }, [kpiData]);

  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    // {
    //   field: "productName",
    //   headerName: "Product Name",
    //   flex: 1,
    // },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];
  
  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
      maxWidth: 100,
      renderCell: (params: GridCellParams) => params.value.slice(-10), // Show only the last 10 characters of the ID
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.67,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) => (params.value as Array<string>).length,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.35,
      renderCell: (params: GridCellParams) => {
        const date = new Date(params.value);
        const formattedDate = date.toLocaleString('en-US', { month: 'short', day: '2-digit' });
        return formattedDate;
      },
    },
  ];
  

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader
          title="List of Products"
          sideText={`${filteredProductData?.length} products`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={filteredProductData || []}
            columns={productColumns}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="h">
        <BoxHeader
          title="Recent Orders"
          sideText={`${transactionData?.length} latest transactions`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionData?.map(transaction => ({
              ...transaction,
              date: getRandomDate(startDate, endDate),
            })) || []}
            columns={transactionColumns}
          />
        </Box>
      </DashboardBox>

      <DashboardBox gridArea="i" style={{ marginTop: '20px' }}>
  <BoxHeader title="Product locations filtered by Transactions" sideText="+4%" />
  <div style={{ marginTop: '10px', height: 'calc(100% - 20px)' }}>
    <MapsIndoorsMap
      apiKey={import.meta.env.VITE_MAPSINDOORS_API_KEY}
      venue="WHOLE_FOODS_MARKET"
      startZoomLevel="20"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      externalIDs={filteredProductIds}

    />
  </div>
</DashboardBox>

       
    </>
  );
};

export default Row3;