import {
  Box,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { api } from "@/utils/api";
import { rowStyles } from "./asset-row-form";
import { useForm } from "react-hook-form";
import { type Value } from "@prisma/client";
import { readFileSync } from "fs";

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

type FormProps = {
  value: number;
  date: string;
};

function AssetDetailsRow(props: { value: Value }) {
  const {
    value: { value, createdAt },
  } = props;

  const { register } = useForm<FormProps>({
    defaultValues: {
      value,
      date: formatDate(createdAt),
    },
  });
  return (
    <Box {...rowStyles}>
      <Input {...register("value")} type="number" />
      <Input {...register("date")} type="date" />
    </Box>
  );
}
function AssetDetailsGrid(props: { assetId: number }) {
  const values = api.values.getAllValuesForAsset.useQuery({
    assetId: props.assetId,
  });

  if (values.isLoading) {
    return <Spinner />;
  }
  if (values.isError) {
    return <p>Error</p>;
  }
  return (
    <Box>
      {values.data.map((value) => (
        <AssetDetailsRow value={value} key={value.id} />
      ))}
    </Box>
  );
}
type AssetValues = { assetId: number };
export function AssetValuesModal(props: AssetValues) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} variant={"unstyled"}>
        <EmailIcon />
      </Button>
      <Modal motionPreset="scale" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <AssetDetailsGrid assetId={props.assetId} />
        </ModalContent>
      </Modal>
    </>
  );
}
