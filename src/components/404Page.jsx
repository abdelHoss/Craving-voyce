
import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, useMediaQuery } from "@material-ui/core";
import { appClasses } from "../styles/theme";

const Page404 = () => {
  const classes = appClasses();
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Container style={{ minHeight: "70vh" }}>
      <Typography variant={smallScreen ? "h4" : "h3"} align="center">
        <Box
          mt={{ xs: "30%", sm: "20%", md: "10%", lg: "8%" }}
          fontWeight="bold"
          bgcolor="#26c6da"
          color="#fff"
          boxShadow={10}
          width={{ xs: "90%", md: "75%" }}
          mx="auto"
          py={3}
          borderRadius={6}
        >
          <Box fontSize={{ xs: 50, lg: 60 }}>OOOPS</Box>
          You seem to be lost!
          <Box fontSize={{ xs: "8rem", sm: 280 }}>404</Box>
          <Link to="/" className={classes.homeLink}>
            Home
          </Link>
        </Box>
      </Typography>
    </Container>
  );
};

export default Page404;
