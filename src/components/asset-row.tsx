import { api } from "@/utils/api";
import { Box, FormControl, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { AssetRowForm } from "./asset-row-form";

export function AssetRow() {
  const response = api.assets.getAll.useQuery({ asset_id: 1 });
  return (
    <>
      {response.data?.map((asset) => (
        <AssetRowForm key={asset.id} asset={asset} />
      ))}
    </>
  );
}
