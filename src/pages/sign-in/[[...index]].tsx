import { Box } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <Box
    height="100vh"
    width="100vw"
    alignItems="center"
    display="flex"
    justifyContent="center"
  >
    <SignIn
      redirectUrl="/tracker"
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
    />
  </Box>
);

export default SignInPage;
