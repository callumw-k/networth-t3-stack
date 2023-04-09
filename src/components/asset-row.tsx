import { api } from "@/utils/api";
import { AssetRowForm } from "./asset-row-form";

export function AssetRow() {
  const response = api.assets.getAllAssetsForUser.useQuery();
  return (
    <>
      {response.data?.map((asset) => (
        <AssetRowForm key={asset.id} asset={asset} />
      ))}
    </>
  );
}
