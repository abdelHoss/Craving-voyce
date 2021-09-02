import React from "react";
import {
  Container,
  Typography,
  Slide,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Box,
  useMediaQuery,
} from "@material-ui/core";
import { appClasses } from "../styles/theme";
import { FixedSizeGrid as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import CloseIcon from "@material-ui/icons/Close";
import defaultCardImage from "../images/background/default_card_image.jpg";
import FingerPrintJS from "@fingerprintjs/fingerprintjs";
import RegisterEmail from "./RegisterEmail";

const slideUp = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ListingCards = (props) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [openEmailModal, setOpenEmailModal] = React.useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = React.useState(null);
  const [modalInfo, setModalInfo] = React.useState({
    title: null,
    description: null,
    price: null,
    image: null,
    link: null,
    delivery_time: null,
    delivery_fee: null,
    restaurant_name: null,
  });

  const mediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const smallScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("xs", "sm")
  );
  const extraSmallScreen = useMediaQuery("(max-width:450px)");

  const environment = {
    request: {
      key: "TmV3T3JkZXI4NTQzMmZvckdyZWVuQ3JhdmluZ3RoZURlbGl2ZXJ5Vm95Y2VBbG90TW9yZWV4dHJhdmFnYW50RWFzaWVyU0ltcGxlckJlYXV0aWZ1bE1pa2VSb3RoODk1NjMyQXN0cmF6V2FybmVyQ3V6",
    },
  };

  const BASE_URL = "http://localhost:5000";
  const wrong_display =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNikAQAACIAHF/uBd8AAAAASUVORK5CYII=";

  const filterItems = (object) => {
    let cardCount = 4;
    if (mediumScreen) cardCount = 3;
    else if (extraSmallScreen) cardCount = 1;
    else if (smallScreen) cardCount = 2;

    switch (props.filter) {
      case "by_price":
        object.sort((a, b) => {
          const first_price = Number(a.price.slice(1, a.price.length));
          const second_price = Number(b.price.slice(1, b.price.length));
          return first_price - second_price;
        });
        break;
      case "by_delivery_price":
        let free_array = [];
        let others_array = [];
        object.map((item) => {
          if (item.delivery_fee !== "Free delivery") {
            others_array.push(item);
          } else {
            free_array.push(item);
          }
        });

        others_array.sort((a, b) => {
          let prices = [
            Number(a.delivery_fee.slice(1, a.delivery_fee.length)),
            Number(b.delivery_fee.slice(1, b.delivery_fee.length)),
          ];

          if (a.delivery_fee.length > 6) {
            prices[0] = Number(
              a.delivery_fee.slice(1, a.delivery_fee.length - 9)
            );
          }
          if (b.delivery_fee.length > 6) {
            prices[1] = Number(
              b.delivery_fee.slice(1, b.delivery_fee.length - 9)
            );
          }
          return prices[0] - prices[1];
        });
        object = [...free_array, ...others_array];
        break;

      case "by_delivery_time":
        object.sort((a, b) => {
          const first_number =
            Number(a.delivery_time.slice(0, 2)) +
            Number(a.delivery_time.slice(3, 5));
          const second_number =
            Number(b.delivery_time.slice(0, 2)) +
            Number(b.delivery_time.slice(3, 5));
          return first_number - second_number;
        });
        break;
      case "by_price_range":
        let temp_data = object.filter((item) => {
          const price = Number(item.price.slice(1, item.price.length));
          if (price >= props.range[0] && price <= props.range[1]) {
            return item;
          }
        });
        object = temp_data;
        break;
      case "by_search_query":
        temp_data = object.filter((item) => {
          const title_search = item.title.toLowerCase().search(props.query);
          const description_search = item.description
            .toLowerCase()
            .search(props.query);
          if (title_search !== -1 || description_search !== -1) {
            return item;
          }
        });
        object = temp_data;
        break;

      default:
        object = JSON.parse(
          localStorage.getItem("craving_voyce_food_results_listing")
        );
    }

    const FilteredCards = ({
      columnIndex,
      rowIndex,
      style,
      index = rowIndex * cardCount + columnIndex,
      element = object[index],
    }) => {
      if (index < object.length) {
        let newStyles = {
          ...style,
          right: 0,
          top: style.top + 100,
        };
        return (
          <Grid key={index} style={newStyles} item={true}>
            <Card
              className="listing-card"
              onClick={() => {
                setOpenModal(true);
                setModalInfo({
                  title: element.title,
                  description: element.description,
                  price: element.price,
                  image: element.image,
                  link: element.link,
                  delivery_time: element.delivery_time,
                  delivery_fee: element.delivery_fee,
                  restaurant_name: element.restaurant_name,
                });
              }}
            >
              <CardActionArea className="action-card">
                <CardMedia
                  className={classes.foodCard}
                  image={
                    element.image && element.image !== wrong_display
                      ? element.image
                      : defaultCardImage
                  }
                  title={element.title + " for delivery"}
                />
                <CardContent>
                  <Typography
                    align="center"
                    gutterBottom
                    variant={smallScreen ? "h6" : "h5"}
                  >
                    {element.title}
                  </Typography>
                  <Typography align="center" variant="h6">
                    {element.price.slice(1, element.price.length)}
                    <span> &#36;</span>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      } else {
        return null;
      }
    };

    if (!object.length && props.response.length) {
      return (
        <Box style={{ width: "100%" }}>
          <Typography
            style={{ marginTop: extraSmallScreen ? 15 : 0 }}
            variant={extraSmallScreen ? "h5" : "h4"}
            color="secondary"
            align="center"
          >
            {props.filter === "by_price_range"
              ? `No result for item between ${props.range[0]} $ and ${props.range[1]} $`
              : `No result for keyword ${props.query}`}
          </Typography>
        </Box>
      );
    } else if (props.response.length) {
      return (
        <div
          style={{ width: extraSmallScreen ? "80vw" : "90vw", height: "100vh" }}
        >
          <AutoSizer style={{ marginTop: -60, marginLeft: "2.5%" }}>
            {({ height, width }) => (
              <List
                columnCount={cardCount}
                columnWidth={width / cardCount - 15}
                height={height}
                width={width}
                rowCount={
                  extraSmallScreen
                    ? object.length / cardCount
                    : Math.floor(object.length / cardCount) +
                      (object.length % cardCount)
                }
                rowHeight={450}
              >
                {FilteredCards}
              </List>
            )}
          </AutoSizer>
        </div>
      );
    }
  };

  const verifyFingerprint = () => {
    const fpPromise = FingerPrintJS.load();
    (async () => {
      const fp = await fpPromise;
      const result = await fp.get();
      setDeviceFingerprint(result.visitorId);
      fetch(BASE_URL + "/verify/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret_key: environment.request.key,
          fingerprint: result.visitorId,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.found_record) window.open(modalInfo.link, "_blank");
          else setOpenEmailModal(true);
        })
        .catch((err) => err);
    })();
  };

  const classes = appClasses();

  return (
    <Container>
      {props.response && <Grid container> {filterItems(props.response)} </Grid>}
      <Dialog
        open={openModal && !openEmailModal}
        onClose={() => setOpenModal(false)}
        TransitionComponent={slideUp}
        fullWidth={true}
        style={{ textAlign: "center" }}
      >
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <CloseIcon />
        </IconButton>
        <img
          alt="Dish illustration"
          src={
            modalInfo.image && modalInfo.image !== wrong_display
              ? modalInfo.image
              : defaultCardImage
          }
          className="listing-modal-image"
        />
        <DialogTitle> {modalInfo.title} </DialogTitle>
        <DialogContent dividers={true} style={{ minHeight: "150px" }}>
          <Typography variant="h6">
            {modalInfo.price &&
              modalInfo.price.slice(1, modalInfo.price.length)}
            &#36;
          </Typography>
          <Typography variant="h6"> {modalInfo.delivery_time} </Typography>
          <Typography variant="h6">
            {modalInfo.delivery_fee === "$0 delivery"
              ? "Free delivery"
              : modalInfo.delivery_fee}
          </Typography>
          <DialogContentText
            style={{
              textAlign:
                modalInfo.description && modalInfo.description.length > 100
                  ? "justify"
                  : "center",
              fontSize: "1.3em",
              marginTop: "10px",
            }}
          >
            {modalInfo.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={verifyFingerprint}
            className={
              classes.verifyDeviceButton + " " + classes.cravingVoyceButton
            }
            variant="contained"
            size="large"
            color="primary"
            endIcon={<RestaurantMenuIcon />}
          >
            Order now
          </Button>
        </DialogActions>
      </Dialog>
      <RegisterEmail
        open={openEmailModal}
        fingerprint={deviceFingerprint}
        dialogState={setOpenEmailModal}
        fingerprintExist={false}
      />
    </Container>
  );
};

export default ListingCards;
