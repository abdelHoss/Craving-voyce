import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import ListingCards from "./ListingCards";
import {
  Container,
  Box,
  Drawer,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon,
  Toolbar,
  CircularProgress,
  Backdrop,
  Collapse,
  Slider,
  TextField,
  Fab,
  Zoom,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import { appClasses } from "../styles/theme";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ReplayIcon from "@material-ui/icons/Replay";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";
import PriceRange from "../images/icons/PriceRange";
import FilterAlt from "../images/icons/FilterAlt";

const environment = {
  mapbox: {
    accessToken:
      "pk.eyJ1IjoiYWJkZWwtaG9zcyIsImEiOija28xNDFieGUwMWRiMnhyeHEyM3hkendnIn0.8xTTj2fBlz5AbmxO202K7g",
  },
  request: {
    key: "TmV3T3JkZXI4NTQzMmZvckdyZWVuQ3JhdmluZ3RoZURlbGl2ZXJ5Vm95Y2VBbG90TW9yZWV4dHJhdmFnYW50RWFzaWVyU0ltcGxlckJlYXV0aWZ1bE1pa2VSb3RoODk1NjMyQXN0cmF6V2FybmVyQ3V6",
  },
};

const BASE_URL = "http://localhost:5000";

const ListingPage = () => {
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const [responseData, setResponseData] = React.useState(
    JSON.parse(localStorage.getItem("craving_voyce_food_results_listing"))
  );
  const [noResult, setNoResult] = React.useState(false);
  const [pageFilter, setPageFilter] = React.useState("default");
  const [openPriceCollapse, setOpenPriceCollapse] = React.useState(false);
  const [openSearchCollapse, setOpenSearchCollapse] = React.useState(false);
  const [rangeValues, setRangeValues] = React.useState([0, 100]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openFilterDrawer, setOpenFilterDrawer] = React.useState(false);
  const [allDataLoaded, setAllDataLoaded] = React.useState(
    JSON.parse(localStorage.getItem("dataLoaded"))
  );
  const requestObject = JSON.parse(localStorage.getItem("food_search_object"));
  const history = useHistory();

  const authorize_access_from_server = (data) => {
    if (data) {
      if (data.secret_key === environment.request.key) {
        get_content_from_server(data);
      } else {
        history.push("/");
      }
    } else {
      history.push("/");
    }
  };

  React.useEffect(() => {
    if (responseData === false) {
      history.push("/");
    } else if (!responseData.length && !noResult) {
      authorize_access_from_server(requestObject);
    }
  }, []);

  const get_content_from_server = (import_data) => {
    fetch(BASE_URL + "/find/city/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(import_data),
    })
    .then(response => response.json())
      .then((res) => {
        if (res.content && res.loop > 0 && !res.close_browser) {
          import_data.loop = true;
          import_data.close_browser = false;
          let loop_times = res.loop;
          const wait_response = (data) => {
            return new Promise((resolve) => resolve(data));
          };

          (async () => {
            for (let i = 0; i < loop_times; i++) {
              import_data.index = i;
              const request = fetch(BASE_URL + "/find/city/deliveries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(import_data),
              })
                .then((response) => response.json())
                .then((sec_res) => {
                  if (sec_res.loop_again) {
                    i = 0;
                    loop_times = sec_res.loop_times;
                  }
                  if (sec_res.next_disabled) {
                    setAllDataLoaded(true);
                    localStorage.setItem("dataLoaded", "true");
                  }
                  if (sec_res.content) {
                    const food_session = JSON.parse(
                      localStorage.getItem("craving_voyce_food_results_listing")
                    );
                    food_session.push(...sec_res.content);
                    localStorage.setItem(
                      "craving_voyce_food_results_listing",
                      JSON.stringify(food_session)
                    );

                    setResponseData(
                      JSON.parse(
                        localStorage.getItem(
                          "craving_voyce_food_results_listing"
                        )
                      )
                    );
                  }
                })
                .catch((sec_err) => sec_err);
              await wait_response(request);
            }
          })();
        } else {
          setNoResult(true);
          localStorage.setItem(
            "craving_voyce_food_results_listing",
            JSON.stringify(res.content)
          );
        }
      })
      .catch((err) => err);
  };

  const filterByPriceRange = (event, newValue) => {
    setRangeValues(newValue);
    setPageFilter("by_price_range");
  };

  const addQueryValue = (event) => {
    setSearchQuery(event.target.value);
    setPageFilter("by_search_query");
  };

  const classes = appClasses();

  return (
    <Container className={classes.listingRoot}>
      <Backdrop
        className={classes.backdrop}
        open={!noResult && !responseData.length}
      >
        <CircularProgress color="inherit" size={80} />
      </Backdrop>
      <Drawer
        anchor="left"
        open={openFilterDrawer}
        onClose={() => setOpenFilterDrawer(false)}
        className={classes.drawer}
        classes={{
          paper: classes.thePaper,
        }}
      >
        <Typography variant="h4"> Filter results </Typography>
        <div style={{ overflow: "auto" }}>
          <Toolbar variant="dense" />
          <List>
            <Divider />
            <ListItem
              button
              selected={pageFilter === "default" ? true : false}
              onClick={() => {
                setPageFilter("default");
                setRangeValues([0, 100]);
                setSearchQuery("");
              }}
              disabled={noResult}
            >
              <ListItemIcon>
                <ReplayIcon />
              </ListItemIcon>
              <ListItemText primary="Default display" />
            </ListItem>
            <Divider />
            <ListItem
              button
              selected={pageFilter === "by_price" ? true : false}
              onClick={() => setPageFilter("by_price")}
              disabled={noResult}
            >
              <ListItemIcon>
                <MonetizationOnIcon />
              </ListItemIcon>
              <ListItemText primary="By item price" />
            </ListItem>
            <Divider />
            <ListItem
              button
              selected={pageFilter === "by_delivery_price" ? true : false}
              onClick={() => setPageFilter("by_delivery_price")}
              disabled={noResult}
            >
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText primary="By delivery price" />
            </ListItem>
            <Divider />
            <ListItem
              button
              selected={pageFilter === "by_delivery_time" ? true : false}
              onClick={() => setPageFilter("by_delivery_time")}
              disabled={noResult}
            >
              <ListItemIcon>
                <QueryBuilderIcon />
              </ListItemIcon>
              <ListItemText primary="By delivery time" />
            </ListItem>
            <Divider />
            <ListItem
              button
              selected={pageFilter === "by_search" ? true : false}
              onClick={() => setOpenSearchCollapse(!openSearchCollapse)}
              disabled={noResult}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="By search" />
              {openSearchCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openSearchCollapse} unmountOnExit>
              <Box style={{ height: "5rem" }}>
                <TextField
                  color="secondary"
                  style={{ width: "80%", marginTop: "15px" }}
                  variant="outlined"
                  type="search"
                  placeholder="Type your search"
                  onChange={addQueryValue}
                  value={searchQuery}
                />
              </Box>
            </Collapse>
            <Divider />
            <ListItem
              button
              selected={pageFilter === "by_price_range" ? true : false}
              onClick={() => setOpenPriceCollapse(!openPriceCollapse)}
              disabled={noResult}
            >
              <ListItemIcon>
                <PriceRange />
              </ListItemIcon>
              <ListItemText primary="By price range" />
              {openPriceCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openPriceCollapse} unmountOnExit>
              <Box style={{ height: "5rem" }}>
                <Slider
                  style={{ width: "85%", marginTop: "1rem" }}
                  min={0}
                  max={100}
                  step={1}
                  value={rangeValues}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  onChangeCommitted={filterByPriceRange}
                  defaultValue={[0, 100]}
                />
              </Box>
            </Collapse>
            <Divider />
          </List>
        </div>
      </Drawer>
      <Box className={classes.cardBox}>
        <Toolbar />
        <Toolbar />
        {noResult && (
          <div style={{ textAlign: "center" }}>
            <Typography variant={smallScreen ? "h5" : "h4"} align="center">
              No Results For Your Search
            </Typography>
            <Toolbar />
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="large">
                Make another search
              </Button>
            </Link>
          </div>
        )}

        <ListingCards
          response={responseData}
          filter={pageFilter}
          range={rangeValues}
          query={searchQuery}
        />

        {responseData.length > 0 && !allDataLoaded && (
          <Box textAlign="center">
            <CircularProgress color="secondary" size={80} thickness={6} />
          </Box>
        )}
      </Box>
      <Zoom in={!noResult && responseData.length > 0}>
        <Tooltip title="filter" aria-label="filter">
          <Fab
            onClick={() => setOpenFilterDrawer(true)}
            color="secondary"
            aria-label="filter"
            className={classes.filterButton}
          >
            <FilterAlt fontSize="large" />
          </Fab>
        </Tooltip>
      </Zoom>
    </Container>
  );
};

export default ListingPage;
