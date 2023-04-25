import { api } from "@/utils/api";
import { AssetRowForm } from "./asset-row-form";
import { CreateAssetRowForm } from "./create-asset-row-form";
import { Box, Container, Spinner } from "@chakra-ui/react";

export function AssetTable() {
  const response = api.assets.getAllAssetsForUser.useQuery();
  //map over the data and return the asset row form
  if (response.isLoading) {
    return (
      <Container maxW={"4xl"}>
        <Box display="flex" justifyContent={"center"} alignItems={"center"}>
          <Spinner size="xl" />
        </Box>
      </Container>
    );
  }
  return (
    <Container maxW="4xl">
      <Box margin="0 auto">
        {response.data?.map((asset) => (
          <AssetRowForm key={asset.id} asset={asset} />
        ))}
        <CreateAssetRowForm />
      </Box>
    </Container>
  );
}
