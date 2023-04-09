import { Box } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <Box
      height="100vh"
      width="100vw"
      alignItems="center"
      display="flex"
      justifyContent="center"
    >
      <SignUp
        redirectUrl="/tracker"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </Box>
  );
};

export default SignUpPage;
