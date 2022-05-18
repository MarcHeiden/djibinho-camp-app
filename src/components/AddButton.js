import AddModal from "./AddModal.js";
import { Flex, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";

export default function AddButton({
	colors,
	modalHeading,
	modalPlaceholder,
	modalHandleAdd,
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Flex
			justifyContent="center"
			position={"fixed"}
			bottom={"40px"}
			left={0}
			right={0}
		>
			<Flex width={"75%"} maxWidth={"900px"} justifyContent="flex-end">
				<IconButton
					mr={2}
					height={"50px"}
					width={"50px"}
					isRound={true}
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
					icon={<AddIcon />}
					onClick={onOpen}
				/>
				<AddModal
					colors={colors}
					isOpen={isOpen}
					onClose={onClose}
					heading={modalHeading}
					placeholder={modalPlaceholder}
					handleAdd={modalHandleAdd}
				/>
			</Flex>
		</Flex>
	);
}
