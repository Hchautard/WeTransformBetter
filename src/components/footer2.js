import { Box, Container, Typography, Link } from "@mui/material";

export default function Footer2() {
  return (
    <Box
      component="footer"
      sx={{
        position: "sticky",
        bottom: 0,
        mt: "auto", 
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        p: 0,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ fontSize: "0.7rem", mb: 1 }}
        >
          {"Copyright © "}
          <Link color="inherit" href="/">
            WeTransformBetter
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ fontSize: "0.7rem" }}
        >
          <Link href="/conditions" color="inherit">
            Conditions Générales d'Utilisation
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
