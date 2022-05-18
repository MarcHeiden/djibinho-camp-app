import {
	Box,
	Flex,
	Text,
	Stack,
	Link,
	LinkOverlay,
	LinkBox,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

export default function ListItem({
	colors,
	name,
	createdBy,
	handleSwitchTo,
	id,
}) {
	return (
		<LinkBox
			rounded={"lg"}
			boxShadow={"lg"}
			bg={colors.whitegray700}
			_hover={{
				bg: colors.blackAlpha200whiteAlpha200,
			}}
			_active={{
				bg: colors.blackAlpha300whiteAlpha50,
			}}
		>
			<Flex alignItems={"center"} justifyContent={"space-between"} p={2} px={4}>
				<Stack spacing={-1}>
					<Text
						fontSize={"xs"}
						as="i"
						color={colors.blackAlpha400whiteAlpha400}
					>
						erstellt von:{" "}
						<Text fontSize={"xs"} as="i" color={colors.cyan400cyan600}>
							{createdBy}
						</Text>
					</Text>
					<Text fontSize={"2xl"}>{name}</Text>
				</Stack>
				<Box>
					<ChevronRightIcon boxSize={"20px"} />
				</Box>
			</Flex>
			<LinkOverlay as={Link} onClick={handleSwitchTo(id, name)} />
		</LinkBox>
	);
}
