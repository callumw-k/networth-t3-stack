import { AssetRow } from "@/components/asset-row";
import { DefaultLayout } from "@/components/layout";
import { type NextPage } from "next";

const Tracker: NextPage = () => {
  return (
    <DefaultLayout>
      <AssetRow />
    </DefaultLayout>
  );
};
export default Tracker;
