import React from "react";
import { Route } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Fade,
  Box,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles } from "@material-ui/core/styles";
import { styleClass } from "../frontend/styles/theme";
import { purple } from "@material-ui/core/colors";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import SendIcon from "@material-ui/icons/Send";
import EcoIcon from "@material-ui/icons/Eco";
import firstLogo from "../frontend/images/logo/home_first_logo.png";

const orientation =
  (window.screen.orientation || {}).type ||
  window.screen.mozOrientation ||
  window.screen.msOrientation;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationResult: [],
      searchOnFocus: false,
      showFirstLogo: false,
      isInputValid: false,
      isSelectValid: false,
      inputError: false,
      coordinates: null,
      selected: "category",
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(event) {
    if (event.target.scrollTop >= 300) {
      this.setState({
        showFirstLogo: true,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    if (window.screen.width <= 1024 && orientation !== "landscape-primary") {
      this.setState({ showFirstLogo: true });
    }
    localStorage.setItem("craving_voyce_food_results_listing", "[]");
    localStorage.setItem("food_search_object", "null");
  }

  getLocations(location) {
    fetch(
      `${process.env.REACT_APP_MAPBOX_BASE_URL}${location}.json?country=US,CA&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => {
        let features = data.features;
        if (features.length > 0) {
          if (location.length > 30) {
            this.setState({
              coordinates: features[0].geometry.coordinates,
              isInputValid: true,
            });
          }
          this.setState({
            inputError: false,
          });
          this.setState({
            locationResult: features.map((res) => res.place_name),
          });
        } else {
          this.setState({ inputError: true });
        }
      })
      .catch(() => this.setState({ inputError: true }));
  }

  handleSelect(event) {
    this.setState({ selected: event.target.value });
    if (event.target.value !== "category")
      this.setState({ isSelectValid: true });
  }

  handleInputChange(elem, value) {
    if (elem.target.value === undefined) {
      this.setState({
        isInputValid: false,
        locationResult: [],
        inputError: false,
      });
    } else {
      if (value.length > 30) {
        this.getLocations(value);
      }
    }
  }

  handleOnKeyUp(e) {
    const searched_key = e.target.value.toLowerCase();
    if (searched_key !== "" && searched_key.length > 0) {
      this.getLocations(searched_key);
    } else {
      this.setState({
        isInputValid: false,
        inputError: false,
      });
    }
  }

  handleOnBlur(e) {
    this.setState({
      searchOnFocus: false,
    });
    if (e.target.value === "") {
      this.setState({
        locationResult: [],
        inputError: false,
      });
    }
  }

  sendInfoToListing(history) {
    localStorage.setItem(
      "food_search_object",
      JSON.stringify({
        secret_key: process.env.REACT_APP_SECRET_KEY,
        coordinates: this.state.coordinates,
        category: this.state.selected,
      })
    );
    localStorage.setItem("dataLoaded", "false");
    history.push("/restaurant/listing/" + this.state.selected);
  }

  render() {
    const { classes } = this.props;
    const smallScreen = window.screen.width < 600;
    return (
      <div>
        <Box className={classes.homeContainer}>
          <Box
            className={classes.searchAddress}
            style={{
              background: this.state.searchOnFocus ? purple[500] : "#fff",
            }}
          >
            <Box className={classes.locationIconBox}>
              <LocationOnIcon
                className={classes.locationOn}
                style={{
                  color: this.state.searchOnFocus ? "#fff" : purple[500],
                }}
              />
            </Box>
            <Autocomplete
              id="adress-searchbar"
              freeSolo={true}
              className={classes.autocomplete}
              onInputChange={(elem, value) =>
                this.handleInputChange(elem, value)
              }
              options={this.state.locationResult}
              getOptionLabel={(locations) => locations}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={this.state.inputError}
                  className="search-input"
                  color="secondary"
                  variant="outlined"
                  size={smallScreen ? "small" : "medium"}
                  InputLabelProps={{
                    style: {
                      fontSize: smallScreen ? 14 : 18,
                      fontWeight: "bold",
                    },
                  }}
                  label="Adress Search"
                  onKeyUp={(e) => this.handleOnKeyUp(e)}
                  onFocus={() => this.setState({ searchOnFocus: true })}
                  onBlur={(e) => this.handleOnBlur(e)}
                />
              )}
            />
            <Select
              labelId="food-categ-select-label"
              id="food-categ-select"
              autoWidth={true}
              onChange={(elem) => this.handleSelect(elem)}
              renderValue={(selected) => selected}
              value={
                smallScreen ? (
                  <EcoIcon
                    color={this.state.isSelectValid ? "secondary" : "disabled"}
                  />
                ) : (
                  this.state.selected
                )
              }
              IconComponent={() => null}
            >
              <MenuItem
                value="category"
                style={{
                  paddingLeft: "25%",
                }}
                disabled
              >
                Category
              </MenuItem>
              <MenuItem value="vegan">
                <Checkbox checked={this.state.selected === "vegan"} />
                <ListItemText primary="Vegan" />
              </MenuItem>
              <MenuItem value="vegetarian">
                <Checkbox checked={this.state.selected === "vegetarian"} />
                <ListItemText primary="Vegetarian" />
              </MenuItem>
            </Select>

            <Route
              render={({ history }) => (
                <Button
                  onClick={() => this.sendInfoToListing(history)}
                  className={classes.searchAddressButton}
                  style={{
                    background:
                      !this.state.isInputValid || !this.state.isSelectValid
                        ? "#E6DCD9"
                        : purple[500],
                  }}
                  variant="contained"
                  color="secondary"
                  disabled={
                    !this.state.isInputValid || !this.state.isSelectValid
                  }
                >
                  <SendIcon className={classes.sendAddressIcon} />
                </Button>
              )}
            />
          </Box>
        </Box>
        <Container className={classes.marginTop10}>
          <Fade in={this.state.showFirstLogo} timeout={750}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid md={3} xs={6} item>
                <img
                  className={this.state.showFirstLogo ? "rotateFirstLogo" : ""}
                  src={firstLogo}
                  alt="Home page first logo"
                />
              </Grid>
              <Grid md={6} xs={10} item>
                <Paper className={classes.rotatingPaper}>
                  <Typography
                    style={{ lineHeight: smallScreen ? "normal" : "3rem" }}
                    variant={window.screen.width > 600 ? "h5" : "body1"}
                  >
                    Craving for some green, benefit from our service to find
                    local vegan and vegetarian food delivery services in your
                    area powered by the best online food ordering and delivery
                    sources. Start by entering your address and see the result.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Fade>
        </Container>
      </div>
    );
  }
}

export default withStyles(styleClass)(Home);
