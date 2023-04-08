import { AssetRow } from "@/components/asset-row";
import { api } from "@/utils/api";
import { Box, FormControl, Input } from "@chakra-ui/react";
import { type NextPage } from "next";

const Tracker: NextPage = () => {
  const data = api.assets.getAll.useQuery({ asset_id: 1 });
  console.debug(data.data);

  return (
    <Box>
      {data.data?.map((asset) => {
        return (
          <Box key={asset.id} display="grid" gridTemplateColumns="1fr 1fr">
            <FormControl>
              <Input borderRadius={0} type="string" placeholder={asset.name} />
            </FormControl>
            <FormControl>
              <Input value={asset.values[0]?.value} />
            </FormControl>
          </Box>
        );
      })}
    </Box>
  );
};
export default Tracker;
