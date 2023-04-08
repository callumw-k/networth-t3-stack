import {
  Box,
  Button,
  FormControl,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { Asset, Value } from "@prisma/client";
import { useForm } from "react-hook-form";

export function AssetRowForm({
  asset,
}: {
  asset: Asset & { values: Value[] };
}) {
  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      assetName: asset.name,
      value: asset.values[0]?.value,
    },
  });
  return (
    <form onSubmit={handleSubmit((data) => console.debug(data))}>
      <Box display="grid" gridTemplateColumns="1fr 1fr minmax(0, 5rem)">
        <FormControl>
          <Input {...register("assetName")} borderRadius={0} type="string" />
        </FormControl>
        <FormControl>
          <NumberInput allowMouseWheel>
            <NumberInputField {...register("value")} borderRadius={0} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button type="submit">Submit</Button>
      </Box>
    </form>
  );
}
