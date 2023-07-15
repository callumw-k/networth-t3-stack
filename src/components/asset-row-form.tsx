import { api } from "@/utils/api";
import {
  Box,
  FormControl,
  Input,
  type InputProps,
  type NumberInputFieldProps,
  Spinner,
  type NumberInputProps,
  type BoxProps,
  Button,
} from "@chakra-ui/react";
import type { Asset, Value } from "@prisma/client";
import { useForm } from "react-hook-form";
import cloneDeep from "lodash.clonedeep";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { ButtonLoading } from "./button-loading";
import { AssetDetails } from "./asset-details";

type AssetRowForm = {
  asset: Asset & { values: Value[] };
};

export const inputStyles: InputProps = {
  borderRadius: "none",
  variant: "outline",
  border: "1px solid transparent",
  focusBorderColor: "gray.600",
};

export const numberInputStyles: {
  numberInputField: NumberInputFieldProps;
  numberInput: NumberInputProps;
} = {
  numberInputField: {
    borderRadius: "none",
    border: "1px solid transparent",
    _focus: { border: "1px", outline: "none" },
  },
  numberInput: {
    focusBorderColor: "black",
  },
};

export const rowStyles: BoxProps = {
  display: "grid",
  gridTemplateColumns:
    "1fr minmax(0, 10rem) minmax(0, 2.5rem) minmax(0, 2.5rem)  minmax(0, 2.5rem)",
};

type FormProps = {
  assetName: string;
  value: number;
};

export function AssetRowForm({ asset }: AssetRowForm) {
  const trpcContext = api.useContext();

  const deleteAssetMutation = api.assets.deleteAsset.useMutation({
    onSuccess(data) {
      const oldData = trpcContext.assets.getAllAssetsForUser.getData();
      if (!oldData || !data) return;
      const updatedAssets = oldData.filter((asset) => asset.id !== data.id);
      trpcContext.assets.getAllAssetsForUser.setData(undefined, updatedAssets);
    },
  });

  const updateAssetMutation = api.assets.updateAsset.useMutation({
    onSuccess(data) {
      const assetsData = cloneDeep(
        trpcContext.assets.getAllAssetsForUser.getData()
      );

      if (!assetsData || !data) return;

      void trpcContext.assets.getDetailsForAsset.invalidate({
        assetId: data?.asset.id,
      });

      let assetFound = false;

      for (const [i, asset] of assetsData.entries()) {
        if (asset.id === data.asset.id) {
          assetsData[i] = {
            ...data.asset,
            values: [data.newValue, ...asset.values],
          };
          assetFound = true;
          break;
        }
      }

      if (!assetFound) {
        assetsData.push({ ...data.asset, values: [data.newValue] });
      }

      trpcContext.assets.getAllAssetsForUser.setData(undefined, assetsData);
    },
  });

  const { register, handleSubmit, watch } = useForm<FormProps>({
    defaultValues: {
      assetName: asset.name,
      value: asset.values[0]?.value,
    },
  });

  const onSubmit = (data: FormProps) => {
    updateAssetMutation.mutate({
      assetId: asset.id,
      newValue: data.value,
      newName: data.assetName,
    });
  };

  const hasValuesChanged =
    !(watch("assetName") === asset.name) ||
    !(watch("value") === asset.values[0]?.value);

  return (
    <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
      <Box {...rowStyles}>
        <FormControl>
          <Input {...inputStyles} {...register("assetName")} type="string" />
        </FormControl>
        <FormControl>
          <Input
            {...inputStyles}
            {...register("value", { valueAsNumber: true })}
            type="number"
          />
        </FormControl>
        <ButtonLoading
          aria-label="Update asset"
          variant={"unstyled"}
          type="submit"
          isLoading={updateAssetMutation.isLoading}
          isVisible={hasValuesChanged}
        >
          <CheckIcon />
        </ButtonLoading>
        <Box gridColumnStart={4}>
          <ButtonLoading
            variant={"unstyled"}
            type="button"
            aria-label="Delete asset"
            onClick={() => deleteAssetMutation.mutate({ assetId: asset.id })}
            isLoading={deleteAssetMutation.isLoading}
            isVisible={true}
          >
            <CloseIcon boxSize={3.5} />
          </ButtonLoading>
        </Box>
        <AssetDetails asset={asset} />
      </Box>
    </form>
  );
}
