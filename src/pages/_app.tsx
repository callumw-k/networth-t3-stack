import { type AppType } from "next/app";

import { api } from "@/utils/api";
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
