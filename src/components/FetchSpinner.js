import { Spinner, Flex } from "@chakra-ui/react";

export default function FetchSpinner({ colors }) {
	return (
		<Flex mt={6} justifyContent={"center"}>
			<Spinner color={colors.blackAlpha500whiteAlpha300} size="lg" speed="1s" />
		</Flex>
	);
}
