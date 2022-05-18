import React, { useState } from "react";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	Input,
	FormLabel,
	Text,
} from "@chakra-ui/react";
import BeatLoader from "react-spinners/BeatLoader";

export default function DeleteModal({
	colors,
	isOpen,
	onClose,
	heading,
	oldName,
	handleDelete,
	formLabel,
	text,
	id,
}) {
	const [name, setName] = useState("");
	const [isNameValid, setIsNameValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleInput = (e) => {
		if (e.target.value === oldName) {
			setIsNameValid(true);
		} else {
			setIsNameValid(false);
		}
		setName(e.target.value);
	};

	const handleOnClose = () => {
		setName("");
		onClose();
	};

	return (
		<Modal
			closeOnOverlayClick={true}
			isOpen={isOpen}
			onClose={handleOnClose}
			size={"xs"}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{heading}</ModalHeader>
				<ModalCloseButton
					_focus={{
						boxShadow: colors.transparent,
					}}
				/>
				<ModalBody>
					<FormLabel mt={-2}>{formLabel}</FormLabel>
					<Text color={colors.gray900gray300} as={"span"}>
						{text}
					</Text>
					<Text fontWeight={"medium"} color={colors.red500} as={"span"}>
						{oldName}
					</Text>
					<Input mt={4} type="text" value={name} onChange={handleInput}></Input>
				</ModalBody>
				<ModalFooter>
					{isNameValid ? (
						<Button
							bg={colors.red400}
							_focus={{
								boxShadow: colors.transparent,
							}}
							_hover={{
								bg: colors.red500,
							}}
							_active={{
								bg: colors.red600,
							}}
							onClick={handleDelete(onClose, id, setIsLoading)}
							isLoading={isLoading}
							spinner={<BeatLoader size={8} color={colors.white} />}
						>
							Löschen
						</Button>
					) : (
						<Button
							bg={colors.red400}
							_focus={{
								boxShadow: colors.transparent,
							}}
							_hover={{
								bg: colors.red400,
							}}
							_active={{
								bg: colors.red400,
							}}
							isDisabled={true}
						>
							Löschen
						</Button>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
