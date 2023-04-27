import { Box, Button, Spinner, type ButtonProps } from "@chakra-ui/react";

type LoadingButtonProps = {
  children: React.ReactNode;
  isLoading: boolean;
  isVisible: boolean;
} & Partial<ButtonProps>;
export function ButtonLoading(props: LoadingButtonProps) {
  const { children, isLoading, isVisible, ...rest } = props;
  if (isLoading) {
    return (
      <Box
        display="flex"
        height={"100%"}
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner />
      </Box>
    );
  }
  if (isVisible) {
    return <Button {...rest}>{children}</Button>;
  }
  return <></>;
}
