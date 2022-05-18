import { Box } from "@chakra-ui/react";

export default function BoxWrapper({ pyPadding, colors, children }) {
	return (
		<Box minH={"100vh"} py={pyPadding} pt={0} bg={colors.bg}>
			{children}
		</Box>
	);
}
