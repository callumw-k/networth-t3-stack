import { api } from "@/utils/api";
import { Box, FormControl, Input, Spinner } from "@chakra-ui/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { inputStyles, rowStyles } from "./asset-row-form";
import { CheckIcon } from "@chakra-ui/icons";
import cloneDeep from "lodash.clonedeep";

type FormValues = {
  assetName: string;
  value: number;
};

export function CreateAssetRowForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<FormValues>();
  const trpcContext = api.useContext();
  const mutation = api.assets.createAsset.useMutation({
    onSuccess(data) {
      const assetsData = cloneDeep(
        trpcContext.assets.getAllAssetsForUser.getData()
      );
      if (!assetsData || !data) return;
      assetsData.push(data);
      trpcContext.assets.getAllAssetsForUser.setData(undefined, assetsData);
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (errors.assetName || errors.value) return;
    mutation.mutate({ assetName: data.assetName, assetValue: data.value });
    reset();
  };
  const correctValues = watch("assetName") && !isNaN(watch("value"));
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box {...rowStyles}>
        <FormControl isInvalid={Boolean(errors.assetName)}>
          <Input
            placeholder="Add new asset"
            {...register("assetName", { required: true })}
            {...inputStyles}
          />
        </FormControl>
        <FormControl isInvalid={Boolean(errors.value)}>
          <Input
            type="number"
            placeholder="420"
            {...register("value", { valueAsNumber: true, required: true })}
            {...inputStyles}
          />
        </FormControl>
        {mutation.isLoading && (
          <Box display="flex" justifyContent={"center"} alignItems={"center"}>
            <Spinner />
          </Box>
        )}
        {!mutation.isLoading && correctValues && (
          <button aria-label="Update asset" type="submit">
            <CheckIcon />
          </button>
        )}
      </Box>
    </form>
  );
}
