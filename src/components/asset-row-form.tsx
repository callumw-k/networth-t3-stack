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
} from "@chakra-ui/react";
import type { Asset, Value } from "@prisma/client";
import { useForm } from "react-hook-form";
import cloneDeep from "lodash.clonedeep";
import { CheckIcon } from "@chakra-ui/icons";

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
  gridTemplateColumns: "1fr minmax(0, 10rem) minmax(0, 2.5rem)",
};

type FormProps = {
  assetName: string;
  value: number;
};

export function AssetRowForm({ asset }: AssetRowForm) {
  const trpcContext = api.useContext();
  const updateAssetMutation = api.assets.updateAsset.useMutation({
    onSuccess(data) {
      const assetsData = cloneDeep(
        trpcContext.assets.getAllAssetsForUser.getData()
      );
      if (!assetsData || !data) return;

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
    <form onSubmit={handleSubmit(onSubmit)}>
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
        {updateAssetMutation.isLoading && (
          <Box display="flex" justifyContent={"center"} alignItems={"center"}>
            <Spinner />
          </Box>
        )}
        {!updateAssetMutation.isLoading && hasValuesChanged && (
          <button aria-label="Update asset" type="submit">
            <CheckIcon />
          </button>
        )}
      </Box>
    </form>
  );
}
