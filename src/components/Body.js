import { Box, Flex, Stack } from "@chakra-ui/react";

export default function Body({ children }) {
	return (
		<Flex justifyContent={"center"}>
			<Box width={"75%"} maxWidth={"900px"}>
				<Stack spacing={6}>{children}</Stack>
			</Box>
		</Flex>
	);
}
