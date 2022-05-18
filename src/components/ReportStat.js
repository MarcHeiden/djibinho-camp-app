import React, { useState, useEffect } from "react";
import {
	Box,
	Flex,
	Text,
	Stack,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Progress,
	IconButton,
	Icon,
	useDisclosure,
} from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import { DeleteIcon } from "@chakra-ui/icons";
import EditReportModal from "./EditReportModal";
import DeleteModal from "./DeleteModal";

export default function ReportStat({
	colors,
	session,
	id,
	name,
	note,
	scoreBefore,
	scoreAfter,
	createdByName,
	createdByID,
	modalHandleUpdate,
	modalHandleDelete,
}) {
	const {
		isOpen: editModalIsOpen,
		onOpen: editModalOnOpen,
		onClose: editModalOnClose,
	} = useDisclosure();

	const {
		isOpen: deleteModalIsOpen,
		onOpen: deleteModalOnOpen,
		onClose: deleteModalOnClose,
	} = useDisclosure();

	const [editIconsStackDirection, setEditIconsStackDirection] = useState("row");

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
		<>
			<Stat
				p={2}
				px={4}
				rounded={"lg"}
				boxShadow={"lg"}
				bg={colors.whitegray700}
			>
				<Flex justifyContent={"space-between"} alignItems={"center"}>
					<Box>
						<Text
							fontSize={"xs"}
							as="i"
							color={colors.blackAlpha400whiteAlpha400}
						>
							erstellt von:{" "}
							<Text fontSize={"xs"} as="i" color={colors.cyan400cyan600}>
								{createdByName}
							</Text>
						</Text>
						<StatLabel fontSize={"2xl"} mt={-1}>
							{name}
						</StatLabel>
					</Box>
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
							onClick={editModalOnOpen}
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
								onClick={deleteModalOnOpen}
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
				</Flex>
				<Stack spacing={2} mb={2}>
					{scoreBefore !== null ? (
						<Box>
							<StatHelpText mb={-1}>Vor Camp</StatHelpText>
							<StatNumber fontSize={"xl"}>{scoreBefore}%</StatNumber>
							<Progress mt={1} value={scoreBefore} rounded={"md"} size={"xs"} />
						</Box>
					) : null}
					{scoreAfter !== null ? (
						<Box>
							<StatHelpText mb={-1}>Nach Camp</StatHelpText>
							<StatNumber fontSize={"xl"}>{scoreAfter}%</StatNumber>
							<Progress mt={1} value={scoreAfter} rounded={"md"} size={"xs"} />
						</Box>
					) : null}
					{note !== null ? (
						<Box>
							<StatHelpText>Notizen</StatHelpText>
							<Box
								mt={-1}
								p={2}
								border={"1px"}
								borderColor={colors.blackAlpha400whiteAlpha400}
								rounded={"lg"}
							>
								<Text fontSize={"xs"} color={colors.blackAlpha600whiteAlpha600}>
									{note}
								</Text>
							</Box>
						</Box>
					) : null}
				</Stack>
			</Stat>
			<EditReportModal
				colors={colors}
				isOpen={editModalIsOpen}
				onClose={editModalOnClose}
				params={{
					id: id,
					name: name,
					note: note,
					scoreBefore: scoreBefore,
					scoreAfter: scoreAfter,
				}}
				handleUpdate={modalHandleUpdate}
			/>
			<DeleteModal
				colors={colors}
				isOpen={deleteModalIsOpen}
				onClose={deleteModalOnClose}
				heading="Spielerreport löschen"
				oldName={name}
				handleDelete={modalHandleDelete}
				formLabel="Achtung: Löschen kann nicht rückgängig gemacht werden!"
				text="Um den Report zu löschen bitte den Namen des Reports eingeben: "
				id={id}
			/>
		</>
	);
}
