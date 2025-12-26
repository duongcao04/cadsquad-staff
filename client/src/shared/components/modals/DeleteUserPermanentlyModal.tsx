import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Chip,
} from "@heroui/react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void; // Async handler
  user: {
    id: string;
    username: string;
    displayName: string;
  } | null;
}

export const DeleteUserPermanentlyModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  user 
}: DeleteUserModalProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setConfirmText("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (confirmText !== user?.username) return;

    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
      setIsLoading(false);
    }
  };

  const isMatch = confirmText === user?.username;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      backdrop="blur"
      size="md"
      hideCloseButton={isLoading}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-red-50/50 border-b border-red-100">
              <div className="flex items-center gap-2 text-danger">
                <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle size={20} />
                </div>
                <span className="text-lg font-bold">Delete User Permanently?</span>
              </div>
            </ModalHeader>

            <ModalBody className="py-6">
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-sm text-red-800">
                    <strong>Warning:</strong> This action is <u>irreversible</u>. 
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>The user <strong>@{user?.username}</strong> will be removed.</li>
                        <li>All login sessions will be terminated.</li>
                        <li>Historical logs (like created jobs) may be anonymized.</li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        To confirm, type <Chip size="sm" variant="flat" className="font-mono text-xs">{user?.username}</Chip> below:
                    </label>
                    <Input
                        placeholder={user?.username}
                        variant="bordered"
                        color={confirmText && !isMatch ? "danger" : "default"}
                        value={confirmText}
                        onValueChange={setConfirmText}
                        isDisabled={isLoading}
                        errorMessage={confirmText && !isMatch ? "Username does not match" : ""}
                    />
                </div>
              </div>

            </ModalBody>

            <ModalFooter className="bg-slate-50/50 border-t border-slate-100">
              <Button 
                variant="light" 
                onPress={close} 
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                color="danger" 
                variant="shadow"
                isLoading={isLoading}
                isDisabled={!isMatch}
                onPress={handleDelete}
                startContent={!isLoading && <Trash2 size={18} />}
                className="font-semibold"
              >
                {isLoading ? "Deleting..." : "Permanently Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};