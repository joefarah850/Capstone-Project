import React, { SetStateAction, useEffect, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UndoIcon from "@mui/icons-material/Undo";
import httpClient from "../httpClient";
import "../css/favorites.scss";
import Footer from "../components/Footer";
import { confirm } from "react-confirm-box";
import Button from "@mui/material/Button";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { set } from "react-hook-form";

const Favorites: React.FC = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [emptyRows, setEmptyRows] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletedRows, setDeletedRows] = useState([]);
  const [hasDeletedRows, setHasDeletedRows] = useState(false);

  const confirmOptions = {
    labels: {
      confirmable: "Yes",
      cancellable: "No",
    },
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const deleteRow = async (id: number) => {
    try {
      const result = await confirm(
        "Are you sure you want to delete this prediction?",
        confirmOptions
      );

      if (result === true) {
        await httpClient.post("http://localhost:5000/remove-favorite", {
          id,
        });

        load();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const restoreRow = async (id: number) => {
    try {
      await httpClient.post("http://localhost:5000/restore-favorite", {
        id,
      });

      setShowDeleted(false);
      load();
      notify();
    } catch (error: any) {
      console.log(error);
    }
  };

  const viewRow = (id: number) => {
    // Implement your view logic here. For example, navigate to a detail view or open a modal.
    console.log("Viewing row with id:", id);
  };

  const notify = () =>
    toast.success("Favorite Restored!", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Zoom,
      style: { backgroundColor: "#133C55", color: "#efeff3", marginTop: "25%" },
    });

  const toggleShowDeleted = () => {
    const filteredData = deletedRows.filter((row: any) => !row.deleted);
    const nonDeleted = filteredData.map((row: any, index: number) => ({
      ...row,
      displayId: index + 1,
      displayPrice: formatCurrency(row.predicted_price, "AED"),
    }));

    let newData = [] as any[];

    if (!showDeleted) {
      const filteredDataDeleted = deletedRows.filter((row: any) => row.deleted);
      const onlyDeleted = filteredDataDeleted.map(
        (row: any, index: number) => ({
          ...row,
          displayId: nonDeleted.length + index + 1,
          displayPrice: formatCurrency(row.predicted_price, "AED"),
        })
      );

      newData = [...nonDeleted, ...onlyDeleted];
    } else {
      newData = [...nonDeleted];
    }

    setRows(newData as SetStateAction<never[]>);
    setShowDeleted(!showDeleted);
  };

  const load = async () => {
    try {
      const resp = await httpClient.get("http://localhost:5000/get-favorites");

      if (resp.data.data.length === 0) {
        setEmptyRows(true);
        return;
      }

      const unfilteredData = resp.data.data;
      const filteredData = resp.data.data.filter((row: any) => !row.deleted);

      const newData = filteredData.map((row: any, index: number) => ({
        ...row,
        displayId: index + 1,
        displayPrice: formatCurrency(row.predicted_price, "AED"),
      }));

      const newDataUnfiltered = unfilteredData.map(
        (row: any, index: number) => ({
          ...row,
          displayId: index + 1,
          displayPrice: formatCurrency(row.predicted_price, "AED"),
        })
      );

      const hasDeleted = newDataUnfiltered.some((row: any) => row.deleted);

      setHasDeletedRows(hasDeleted);

      setRows(newData);
      setDeletedRows(newDataUnfiltered);
      setShowDeleted(false);

      setColumns([
        {
          field: "displayId",
          headerName: "",
          width: 50,
          headerClassName: "my-header",
          disableColumnMenu: true,
        },
        {
          field: "size",
          headerName: "Size",
          width: 110,
          headerClassName: "my-header",
          disableColumnMenu: true,
        },
        {
          field: "bedrooms",
          headerName: "# of Bedrooms",
          width: 165,
          headerClassName: "my-header",
          disableColumnMenu: true,
        },
        {
          field: "bathrooms",
          headerName: "# of Bathrooms",
          width: 170,
          headerClassName: "my-header",
          disableColumnMenu: true,
        },
        {
          field: "region",
          headerName: "Region",
          width: 330,
          headerClassName: "my-header",
          disableColumnMenu: true,
        },
        {
          field: "type",
          headerName: "Type",
          width: 180,
          headerClassName: "my-header",
          disableColumnMenu: true,
        },
        {
          field: "displayPrice",
          headerName: "Predicted Price",
          width: 170,
          headerClassName: "my-header",
          disableColumnMenu: true,
        },
        {
          field: "actions",
          type: "actions",
          headerName: "",
          headerClassName: "my-header",
          cellClassName: "actions-cell",
          width: 90,
          getActions: (params) => {
            if (params.row.deleted) {
              return [
                <GridActionsCellItem
                  icon={<UndoIcon />}
                  label="Undo"
                  onClick={() => restoreRow(Number(params.id))}
                  color="inherit"
                />,
              ];
            }

            return [
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => deleteRow(Number(params.id))}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<VisibilityIcon />}
                label="View"
                onClick={() => viewRow(Number(params.id))}
                color="inherit"
              />,
            ];
          },
        },
      ]);
    } catch (error: any) {
      console.log(error);
      window.location.replace("/login");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const CustomFooter = (props: any) => (
    <GridFooterContainer>
      <Button
        variant="outlined"
        onClick={toggleShowDeleted}
        className="show-deleted-button"
        disabled={!hasDeletedRows}
        style={{ opacity: hasDeletedRows ? 1 : 0.6 }}
      >
        {showDeleted ? "Hide Deleted" : "View Deleted"}
      </Button>
      <GridPagination {...props} />
    </GridFooterContainer>
  );

  return (
    <>
      <ToastContainer />
      <div className="favorites-container">
        <h1>Favorites</h1>
        {showDeleted && (
          <p id="note">
            Please be aware that items removed from your favorites will be
            permanently deleted after a certain period.
          </p>
        )}
        {emptyRows ? (
          <h2 className="empty-rows">No favorites found!</h2>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            className="favorites-table"
            isCellEditable={() => false}
            isRowSelectable={() => false}
            slots={{
              footer: CustomFooter,
            }}
            getRowClassName={(params) =>
              params.row.deleted ? "deleted-row" : ""
            }
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Favorites;
