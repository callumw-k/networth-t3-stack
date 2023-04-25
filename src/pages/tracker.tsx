import { AssetTable } from "@/components/asset-table";
import { DefaultLayout } from "@/components/layout";
import { type NextPage } from "next";

const Tracker: NextPage = () => {
  return (
    <DefaultLayout>
      <AssetTable />
    </DefaultLayout>
  );
};
export default Tracker;
