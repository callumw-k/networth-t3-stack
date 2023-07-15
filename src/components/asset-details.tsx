import Trpc from "@/pages/api/trpc/[trpc]";
import { api } from "@/utils/api";
import { ButtonLoading } from "./button-loading";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { type Asset } from "@prisma/client";
type AssetDetails = { asset: Asset };

function DetailsModal({
  isOpen,
  onClose,
  asset,
}: {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}) {
  const details = api.assets.getDetailsForAsset.useQuery({ assetId: asset.id });
  return (
    <>
      {details.isLoading && <Spinner />}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{asset.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {details.data?.map((value) => {
              return (
                <div key={value.id}>
                  <p>{value.value}</p>
                  <p>{value.createdAt.toString()}</p>
                </div>
              );
            })}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function AssetDetails({ asset }: AssetDetails) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      {isOpen && (
        <DetailsModal asset={asset} isOpen={isOpen} onClose={onClose} />
      )}
      <ButtonLoading
        variant={"unstyled"}
        type="button"
        aria-label="Asset details"
        isLoading={false}
        isVisible
        onClick={onOpen}
      >
        <EmailIcon />
      </ButtonLoading>
    </>
  );
}
