import React from "react";
import { AppBar, Typography, Box, useMediaQuery } from "@material-ui/core";
import { appClasses } from "../styles/theme";

const Footer = () => {
  const [keyword, setKeyword] = React.useState();
  const [slideKeyword, setSlideKeyword] = React.useState(false);
  const [variantColor, setVariantColor] = React.useState("green");
  const date = new Date();
  const classes = appClasses();
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const keywords = [
    "Green",
    "Fresh",
    "Natural",
    "Healthy Stuff",
    "Craving Voyce",
  ];
  const colors = ["#2e7d32", "#01579b", "#00695c", "#e91e63", "#6a1b9a"];
  let time = 750;
  let index = 0;

  const animate = () =>
    setTimeout(() => {
      changeText(index);
      index++;
      if (index === keywords.length) {
        index = 0;
        time = 2500;
      } else time = 750;
      animate(time);
    }, time);

  const changeText = (index) => {
    setSlideKeyword(true);
    setVariantColor(colors[index]);
    setKeyword(keywords[index]);
    setTimeout(() => setSlideKeyword(false), 200);
  };

  React.useEffect(() => animate(time), []);

  return (
    <Box mt="15%">
      <AppBar className={classes.footer} position="relative" color="primary">
        <Typography
          variant={smallScreen ? "h5" : "h4"}
          className={classes.animationText}
        >
          Craving for some{" "}
          <span
            className={slideKeyword ? "slide" : ""}
            style={{ color: variantColor, textTransform: "uppercase" }}
          >
            {keyword}
          </span>
        </Typography>
        <Box style={{ textAlign: "center", marginTop: "3%" }}>
          <Typography variant="h6">
            {date.getFullYear()} Craving Voyce &copy;
          </Typography>
        </Box>
      </AppBar>
    </Box>
  );
};

export default Footer;
