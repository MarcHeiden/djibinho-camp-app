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
} from "@chakra-ui/react";
import BeatLoader from "react-spinners/BeatLoader";

export default function AddModal({
	colors,
	isOpen,
	onClose,
	heading,
	placeholder,
	handleAdd,
}) {
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleInput = (e) => {
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
					<Input
						type="text"
						value={name}
						placeholder={placeholder}
						onChange={handleInput}
					></Input>
				</ModalBody>
				<ModalFooter>
					<Button
						bg={colors.green400}
						_focus={{
							boxShadow: colors.transparent,
						}}
						_hover={{
							bg: colors.green500,
						}}
						_active={{
							bg: colors.green600,
						}}
						onClick={handleAdd(onClose, name, setName, setIsLoading)}
						isLoading={isLoading}
						spinner={<BeatLoader size={8} color={colors.white} />}
					>
						Speichern
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
