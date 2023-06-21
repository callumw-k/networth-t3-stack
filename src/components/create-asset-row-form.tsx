import { api } from "@/utils/api";
import { Box, Button, FormControl, Input } from "@chakra-ui/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { inputStyles, rowStyles } from "./asset-row-form";
import { CheckIcon } from "@chakra-ui/icons";
import cloneDeep from "lodash.clonedeep";
import { useState } from "react";
import { ButtonWithLoadingState } from "./button-with-loading-state";

type FormValues = {
  assetName: string;
  value: number;
};

type FormProps = {
  setClickedAddAsset: (value: boolean) => void;
};

function Form(props: FormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>();
  const trpcContext = api.useContext();
  const addAssetMutation = api.assets.createAsset.useMutation({
    onSuccess(data) {
      const assetsData = cloneDeep(
        trpcContext.assets.getAllAssetsForUser.getData()
      );
      if (!assetsData || !data) return;
      assetsData.push(data);
      trpcContext.assets.getAllAssetsForUser.setData(undefined, assetsData);
      props.setClickedAddAsset(false);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (errors.assetName || errors.value) return;
    addAssetMutation.mutate({
      assetName: data.assetName,
      assetValue: data.value,
    });
  };

  const hasBothValues = Boolean(watch("value")) && Boolean(watch("assetName"));

  return (
    <Box flexGrow={1}>
      <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
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
          <ButtonWithLoadingState
            isLoading={addAssetMutation.isLoading}
            isVisible={hasBothValues}
            type="submit"
            variant={"unstyled"}
          >
            <CheckIcon />
          </ButtonWithLoadingState>
        </Box>
      </form>
    </Box>
  );
}

export function CreateAssetRowForm() {
  const [clickedAddAsset, setClickedAddAsset] = useState(false);
  return (
    <Box>
      {clickedAddAsset && <Form setClickedAddAsset={setClickedAddAsset} />}
      <Button
        marginTop={4}
        onClick={() => setClickedAddAsset(!clickedAddAsset)}
      >
        {clickedAddAsset ? "Cancel" : "Add new asset"}
      </Button>
    </Box>
  );
}
