
import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Divider,
  Zoom,
  Fade,
  useMediaQuery,
} from "@material-ui/core";
import { appClasses } from "../styles/theme";
import AboutLogo from "../images/logo/about-us-image.gif";

const About = () => {
  const classes = appClasses();
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down("xs")
  );
  return (
    <Container
      style={{
        marginTop: smallScreen ? "100px" : "10%",
      }}
    >
      <Typography
        variant={smallScreen ? "h5" : "h4"}
        align="left"
        className={classes.aboutTitle}
      >
        What is craving voyce &#63;
        <Divider className={classes.styledUnderline} />
      </Typography>
      <Box
        bgcolor="#e0f7fa"
        boxShadow={3}
        borderRadius={15}
        width={1}
        p={5}
        mt={5}
        style={{ textAlign: "center" }}
      >
        <Fade
          in={true}
          style={{
            transitionDelay: "900ms",
          }}
        >
          <Box width={extraSmallScreen ? 1 : 1 / 2} style={{ float: "left" }}>
            <img
              width={smallScreen ? "100%" : "90%"}
              src={AboutLogo}
              alt="About us logo"
            />
          </Box>
        </Fade>
        <Zoom
          in={true}
          style={{
            transitionDelay: "500ms",
          }}
        >
          <Box
            letterSpacing={{ xs: 0, sm: 1.5 }}
            lineHeight={2}
            fontSize={20}
            textAlign="justify"
          >
            <Box mb={2}>
              <Typography
                variant={smallScreen ? "h5" : "h4"}
                style={{
                  fontWeight: "bold",
                  color: "#00796b",
                }}
              >
                Craving for some green, yellow and grassy meals &#63;
              </Typography>
            </Box>
            Craving Voyce is a vegan and vegetarian search engine that helps you
            for searching local food delivery services and restaurants across
            all the United States faster than most online food ordering
            services. To use Craving Voyce, navigate to the{" "}
            <Link
              to="/"
              style={{
                textDecoration: "none",
              }}
            >
              home page
            </Link>
            , type in your address, choose your category of food, press the
            search button and VOILA! Wait for your listing to show. Searches can
            take up to one minute to show results.
            <Box
              mt={2}
              lineHeight={2}
              letterSpacing={{ xs: 0, sm: 2 }}
              fontSize={{ sm: 22, md: 25 }}
              fontWeight="bold"
            >
              Start by giving a valid email address to access to the service,
              you can unregister anytime.
            </Box>
          </Box>
        </Zoom>
      </Box>
    </Container>
  );
};

export default About;
