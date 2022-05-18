import styles from "./App.css";
import Auth from "./components/Auth.js";
import Camps from "./components/Camps";
import Groups from "./components/Groups";
import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useColorModeValue, useColorMode, useToast } from "@chakra-ui/react";
import Players from "./components/Players";
import Reports from "./components/Reports";

export default function App() {
	const colors = {
		bg: useColorModeValue("gray.50", "gray.800"),
		whitegray700: useColorModeValue("white", "gray.700"),
		blue400: "blue.400",
		white: "white",
		blue500: "blue.500",
		blue600: "blue.600",
		red500red300: useColorModeValue("red.500", "red.300"),
		green500green200: useColorModeValue("green.500", "green.200"),
		gray500gray300: useColorModeValue("gray.500", "gray.300"),
		blue500blue300: useColorModeValue("blue.500", "blue.300"),
		blackAlpha200whiteAlpha200: useColorModeValue(
			"blackAlpha.200",
			"whiteAlpha.200"
		),
		blackAlpha300whiteAlpha50: useColorModeValue(
			"blackAlpha.300",
			"whiteAlpha.50"
		),
		transparent: "transparent",
		green400: "green.400",
		green500: "green.500",
		green600: "green.600",
		blackAlpha400whiteAlpha400: useColorModeValue(
			"blackAlpha.400",
			"whiteAlpha.400"
		),
		cyan400cyan600: useColorModeValue("cyan.400", "cyan.600"),
		blackAlpha500whiteAlpha300: useColorModeValue(
			"blackAlpha.500",
			"whiteAlpha.300"
		),
		blackAlpha600whiteAlpha50: useColorModeValue(
			"blackAlpha.600",
			"whiteAlpha.50"
		),
		red500: "red.500",
		red600: "red.600",
		red400: "red.400",
		gray900gray300: useColorModeValue("gray.900", "gray.300"),
		blackAlpha600whiteAlpha600: useColorModeValue(
			"blackAlpha.600",
			"whiteAlpha.600"
		),
	};

	const [session, setSession] = useState(null);
	const [switchTo, setSwitchTo] = useState({ component: "Camps" });

	const { colorMode, toggleColorMode } = useColorMode();

	const toast = useToast();
	const showToast = (title, description, status) => {
		toast({
			title,
			description,
			status,
			duration: 10000,
			isClosable: true,
			position: "top",
		});
	};

	useEffect(() => {
		setSession(supabase.auth.session());

		supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_OUT") {
				setSwitchTo({
					component: "Camps",
				});
			}
			setSession(session);
		});
	}, []);

	if (session !== null) {
		switch (switchTo.component) {
			case "Camps":
				return (
					<Camps
						colors={colors}
						session={session}
						colorMode={colorMode}
						toggleColorMode={toggleColorMode}
						showToast={showToast}
						setSwitchTo={setSwitchTo}
					/>
				);
			case "Groups":
				return (
					<Groups
						colors={colors}
						session={session}
						colorMode={colorMode}
						toggleColorMode={toggleColorMode}
						showToast={showToast}
						setSwitchTo={setSwitchTo}
						params={switchTo}
					/>
				);
			case "Players":
				return (
					<Players
						colors={colors}
						session={session}
						colorMode={colorMode}
						toggleColorMode={toggleColorMode}
						showToast={showToast}
						setSwitchTo={setSwitchTo}
						params={switchTo}
					/>
				);
			case "Reports":
				return (
					<Reports
						colors={colors}
						session={session}
						colorMode={colorMode}
						toggleColorMode={toggleColorMode}
						showToast={showToast}
						setSwitchTo={setSwitchTo}
						params={switchTo}
					/>
				);
		}
	}

	return <Auth colors={colors} showToast={showToast} />;
}
