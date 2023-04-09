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
import type { Asset, Value } from "@prisma/client";
import { useForm } from "react-hook-form";

export function AssetRowForm({
  asset,
}: {
  asset: Asset & { values: Value[] };
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      assetName: asset.name,
      value: asset.values[0]?.value,
    },
  });
  const onSubmit = (data: Record<string, unknown>) => {
    console.debug(data);
  };
  return (
    <form onSubmit={() => handleSubmit(onSubmit)}>
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
