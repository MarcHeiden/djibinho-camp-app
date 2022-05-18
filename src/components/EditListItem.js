import React, { useState, useEffect, useRef } from "react";
import {
	Flex,
	Text,
	IconButton,
	Stack,
	Icon,
	useDisclosure,
	Input,
	Box,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import DeleteModal from "./DeleteModal";

export default function EditListItem({
	colors,
	session,
	createdByID,
	createdByName,
	name,
	id,
	modalHeading,
	modalHandleDelete,
	modalFormLabel,
	handleEdit,
	modalText,
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editIconsStackDirection, setEditIconsStackDirection] = useState("row");
	const [showEditMode, setShowEditMode] = useState(false);
	const newName = useRef("");

	const handleEditMode = () => {
		if (!showEditMode) {
			setShowEditMode(true);
		} else {
			setShowEditMode(false);
		}
	};

	useEffect(() => {
		const vw = Math.max(
			document.documentElement.clientWidth || 0,
			window.innerWidth || 0
		);
		if (vw < 296) {
			setEditIconsStackDirection("column");
		}
	}, [session]);

	return (
		<Flex
			rounded={"lg"}
			boxShadow={"lg"}
			bg={colors.whitegray700}
			alignItems={"center"}
			justifyContent={"space-between"}
			p={2}
			px={4}
		>
			<Stack spacing={-1}>
				<Text fontSize={"xs"} as="i" color={colors.blackAlpha400whiteAlpha400}>
					erstellt von:{" "}
					<Text fontSize={"xs"} as="i" color={colors.cyan400cyan600}>
						{createdByName}
					</Text>
				</Text>
				{showEditMode ? (
					<Box pt={2} pr={4}>
						<Input
							type="text"
							ref={newName}
							placeholder="Neuer Name"
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									handleEdit(id, newName.current.value);
									handleEditMode();
								}
							}}
						></Input>
					</Box>
				) : (
					<Text fontSize={"2xl"}>{name}</Text>
				)}
			</Stack>
			<Stack direction={editIconsStackDirection} spacing={2}>
				<IconButton
					icon={<Icon as={MdEdit} />}
					_focus={{
						boxShadow: colors.transparent,
					}}
					_active={{
						bg: colors.blackAlpha600whiteAlpha50,
					}}
					_hover={{
						bg: colors.blackAlpha500whiteAlpha300,
					}}
					bg={colors.blackAlpha400whiteAlpha400}
					onClick={handleEditMode}
				/>
				{createdByID === session.user.id ? (
					<IconButton
						icon={<DeleteIcon />}
						_focus={{
							boxShadow: colors.transparent,
						}}
						_hover={{
							bg: colors.red500,
						}}
						_active={{
							bg: colors.red600,
						}}
						bg={colors.red400}
						onClick={onOpen}
					/>
				) : (
					<IconButton
						icon={<DeleteIcon />}
						_focus={{
							boxShadow: colors.transparent,
						}}
						isDisabled={true}
						_hover={{
							bg: colors.red400,
						}}
						_active={{
							bg: colors.red400,
						}}
						bg={colors.red400}
					/>
				)}
			</Stack>
			<DeleteModal
				colors={colors}
				isOpen={isOpen}
				onClose={onClose}
				heading={modalHeading}
				oldName={name}
				handleDelete={modalHandleDelete}
				formLabel={modalFormLabel}
				text={modalText}
				id={id}
			/>
		</Flex>
	);
}
