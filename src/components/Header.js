import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
	Box,
	Flex,
	Avatar,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	Center,
	Switch,
	IconButton,
	Heading,
	Icon,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";

export default function Header({
	colors,
	session,
	colorMode,
	toggleColorMode,
	showToast,
	heading,
	handleEditMode,
	isBackButtonHidden,
	handleSwitchTo,
	isEditButtonHidden,
}) {
	const [username, setUsername] = useState("");

	const handleLogout = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			}
		} catch (error) {
			console.log(error);
			showToast(error.error_description, error.message, "error");
		}
	};

	useEffect(() => {
		async function fetchUsername() {
			try {
				const { data, error } = await supabase
					.from("trainers")
					.select("name")
					.eq("trainer_id", session.user.id);
				if (error) {
					console.log(error);
					showToast(error.error_description, error.message, "error");
				} else {
					setUsername(data[0].name);
				}
			} catch (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			}
		}
		fetchUsername();
	}, [session.user.id]);

	return (
		<Box position={"sticky"} top={0} left={0} right={0} zIndex={1}>
			<Flex
				pt={2}
				h={"80px"}
				alignItems={"center"}
				justifyContent={"space-between"}
				bg={colors.bg}
				px={6}
			>
				<Box>
					{isBackButtonHidden ? null : (
						<IconButton
							size={"md"}
							icon={<ArrowBackIcon />}
							bg={colors.whitegray700}
							_hover={{
								bg: colors.blackAlpha200whiteAlpha200,
							}}
							_active={{
								bg: colors.blackAlpha300whiteAlpha50,
							}}
							_focus={{
								boxShadow: colors.transparent,
							}}
							onClick={handleSwitchTo}
						/>
					)}
				</Box>
				<Menu autoSelect={false} gutter={20}>
					<MenuButton
						as={Button}
						rounded={"full"}
						variant={"link"}
						minW={0}
						_hover={{
							color: colors.transparent,
						}}
						_focus={{
							boxShadow: colors.transparent,
						}}
					>
						<Avatar size={"md"} name={username} />
					</MenuButton>
					<MenuList minWidth="180px" bg={colors.whitegray700}>
						<Center mt={3}>
							<Avatar size={"lg"} name={username} />
						</Center>
						<Center mt={2}>
							<p>{username}</p>
						</Center>
						<MenuDivider />
						<MenuItem
							closeOnSelect={false}
							_hover={{
								bg: colors.transparent,
							}}
						>
							Dark Mode:
							<Switch
								pl={5}
								size={"md"}
								onChange={toggleColorMode}
								isChecked={colorMode === "dark"}
							/>
						</MenuItem>
						<MenuItem
							_hover={{
								bg: colors.blackAlpha200whiteAlpha200,
							}}
							_active={{
								bg: colors.blackAlpha300whiteAlpha50,
							}}
							onClick={handleLogout}
						>
							Logout
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
			<Flex justifyContent="center" bg={colors.bg}>
				<Flex
					pt={2}
					pb={6}
					alignItems={"center"}
					width={"75%"}
					maxWidth={"900px"}
				>
					<Heading fontSize={"4xl"}>{heading}</Heading>
					{isEditButtonHidden ? null : (
						<IconButton
							ml={6}
							icon={<Icon as={MdEdit} />}
							_focus={{
								boxShadow: colors.transparent,
							}}
							_hover={{
								bg: colors.blackAlpha200whiteAlpha200,
							}}
							_active={{
								bg: colors.blackAlpha300whiteAlpha50,
							}}
							bg={colors.whitegray700}
							onClick={handleEditMode}
						/>
					)}
				</Flex>
			</Flex>
		</Box>
	);
}
