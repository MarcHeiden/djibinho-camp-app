import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

import {
	Center,
	Box,
	FormControl,
	FormLabel,
	FormHelperText,
	Input,
	Stack,
	Link,
	Button,
	Heading,
	Text,
	InputGroup,
	InputRightElement,
	FormErrorMessage,
} from "@chakra-ui/react";

import BeatLoader from "react-spinners/BeatLoader";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Auth({ colors, showToast }) {
	const [switchTo, setSwitchTo] = useState("login");

	return (
		<Center minH={"100vh"} bg={colors.bg}>
			<Stack spacing={8} width={[300, 400]} py={12}>
				{switchTo === "login" ? (
					<Login
						colors={colors}
						setSwitchTo={setSwitchTo}
						showToast={showToast}
					/>
				) : switchTo === "signUp" ? (
					<SignUp
						colors={colors}
						setSwitchTo={setSwitchTo}
						showToast={showToast}
					/>
				) : null}
			</Stack>
		</Center>
	);
}

function Login({ colors, setSwitchTo, showToast }) {
	const [email, setEmail] = useState("");
	const [showEmailIsEmpty, setShowEmailIsEmpty] = useState(false);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordIsEmpty, setShowPasswordIsEmpty] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailInput = (e) => {
		if (showEmailIsEmpty === true) {
			setShowEmailIsEmpty(false);
		}
		setEmail(e.target.value);
	};
	const handlePasswordInput = (e) => {
		if (showPasswordIsEmpty === true) {
			setShowPasswordIsEmpty(false);
		}
		setPassword(e.target.value);
	};

	const handleLogin = async () => {
		if (email.length === 0 || password.length === 0) {
			if (email.length === 0) {
				setShowEmailIsEmpty(true);
			}
			if (password.length === 0) {
				setShowPasswordIsEmpty(true);
			}
		} else if (
			email.match(/^.+@djibinho.com$/i) === null ||
			password.match(
				/^(?=(.*[A-Z]){1,})(?=(.*[a-z]){1,})(?=(.*\d){1,}).{8,}$/
			) === null
		) {
			showToast("Email Adresse oder Passwort ist falsch.", null, "error");
		} else {
			try {
				setIsLoading(true);
				const { error } = await supabase.auth.signIn({
					email,
					password,
				});
				if (error) {
					setIsLoading(false);
					if (error.message === "Email not confirmed") {
						showToast(
							"Email Adresse noch nicht verifiziert.",
							"Verifiziere bitte deine Email Adresse, um dich einzuloggen.",
							"info"
						);
					} else if (error.message === "Invalid login credentials") {
						showToast("Email Adresse oder Passwort ist falsch.", null, "error");
					} else {
						console.log(error);
						showToast(error.error_description, error.message, "error");
					}
				}
			} catch (error) {
				console.log(error);
				setIsLoading(false);
			}
		}
	};

	return (
		<React.Fragment>
			<Heading fontSize={"4xl"} align={"center"}>
				Login ✌️
			</Heading>
			<Box
				rounded={"lg"}
				bg={colors.whitegray700}
				boxShadow={"lg"}
				p={8}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						handleLogin();
					}
				}}
			>
				<Stack spacing={4}>
					<FormControl id="email" isInvalid={showEmailIsEmpty}>
						<FormLabel>Email Adresse</FormLabel>
						<Input
							type="email"
							value={email}
							onChange={handleEmailInput}
							errorBorderColor={colors.red500red300}
							focusBorderColor={colors.blue500blue300}
						/>
						<FormErrorMessage color={colors.red500red300}>
							Bitte Email Adresse eingeben.
						</FormErrorMessage>
					</FormControl>
					<FormControl id="password" isInvalid={showPasswordIsEmpty}>
						<FormLabel>Passwort</FormLabel>
						<InputGroup>
							<Input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={handlePasswordInput}
								errorBorderColor={colors.red500red300}
								focusBorderColor={colors.blue500blue300}
							/>
							<InputRightElement h={"full"}>
								<Button
									_focus={{
										boxShadow: colors.transparent,
									}}
									variant={"ghost"}
									onClick={() =>
										setShowPassword((showPassword) => !showPassword)
									}
								>
									{showPassword ? <ViewIcon /> : <ViewOffIcon />}
								</Button>
							</InputRightElement>
						</InputGroup>
						<FormErrorMessage color={colors.red500red300}>
							Bitte Passwort eingeben.
						</FormErrorMessage>
					</FormControl>
				</Stack>
				<Button
					bg={colors.blue400}
					color={colors.white}
					_hover={{
						bg: colors.blue500,
					}}
					_active={{
						bg: colors.blue600,
					}}
					_focus={{
						boxShadow: colors.transparent,
					}}
					width={"100%"}
					mt={8}
					mb={6}
					isLoading={isLoading}
					spinner={<BeatLoader size={8} color={colors.white} />}
					onClick={handleLogin}
				>
					Login
				</Button>
				<Box textAlign={"start"}>
					<Text>Noch keinen Account?</Text>
					<Link
						color={colors.blue400}
						onClick={() => {
							setSwitchTo("signUp");
						}}
					>
						Jetzt registrieren
					</Link>
				</Box>
			</Box>
		</React.Fragment>
	);
}

function SignUp({ colors, setSwitchTo, showToast }) {
	const [username, setUsername] = useState("");
	const [isUsernameValid, setIsUsernameValid] = useState(false);
	const [wasUsernameInputFocused, setWasUsernameInputFocused] = useState(false);
	const [email, setEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(false);
	const [wasEmailInputFocused, setWasEmailInputFocused] = useState(false);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [minOneLetterUppercase, setMinOneLetterUppercase] = useState(false);
	const [minOneLetterLowercase, setMinOneLetterLowercase] = useState(false);
	const [minOneLetterDigit, setMinOneLetterDigit] = useState(false);
	const [minEightLetters, setMinEightLetters] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [wasPassworInputFocused, setWasPasswordInputFocused] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleUsernameInput = (e) => {
		setUsername(e.target.value);
		/* Username state is set after render, 
		therefore I used e.target.value and not username for the lenght check */
		setIsUsernameValid(e.target.value.length > 3);
	};

	/* Alternative implemtation of the username lenght check. 
	Here I am able to use username for the lenght check, 
	because effects invoke after the render and therefore the username state was updated */
	/* useEffect(() => {
		setIsUsernameValid(userName.length > 3);
	}, [userName]);
 */

	const handleUsernameOnFocus = () => setWasUsernameInputFocused(true);

	const handleEmailInput = (e) => {
		setEmail(e.target.value);
		// Regex: min. 1 letter + @djibinho.com
		setIsEmailValid(e.target.value.match(/^.+@djibinho.com$/i) !== null);
	};

	const handleEmailOnFocus = () => setWasEmailInputFocused(true);

	const handlePasswordInput = (e) => {
		setPassword(e.target.value);
		/* 	Full regex: /^(?=(.*[A-Z]){1,})(?=(.*[a-z]){1,})(?=(.*\d){1,}).{8,}$/
			=> min. 1 Uppercase Letter, min. 1 Lowercase Letter, min. 1 Digit and min. lenght of 8 chars */
		setMinOneLetterUppercase(new RegExp(/[A-Z]{1,}/).test(e.target.value));
		setMinOneLetterLowercase(new RegExp(/[a-z]{1,}/).test(e.target.value));
		setMinOneLetterDigit(new RegExp(/\d{1,}/).test(e.target.value));
		setMinEightLetters(new RegExp(/.{8,}/).test(e.target.value));
	};

	const handlePasswordOnFocus = () => setWasPasswordInputFocused(true);

	useEffect(() => {
		setIsPasswordValid(
			minOneLetterUppercase &&
				minOneLetterLowercase &&
				minOneLetterDigit &&
				minEightLetters
		);
	}, [
		minOneLetterUppercase,
		minOneLetterLowercase,
		minOneLetterDigit,
		minEightLetters,
	]);

	const handleSignUp = async () => {
		if (isUsernameValid && isEmailValid && isPasswordValid) {
			try {
				setIsLoading(true);
				const { error } = await supabase.auth.signUp(
					{
						email,
						password,
					},
					{
						data: {
							username,
						},
					}
				);
				if (error) {
					setIsLoading(false);
					if (error.status === 429) {
						showToast(
							"Account wurde schon erstellt.",
							"Verifiziere deine Email Adresse, um dich einzuloggen.",
							"info"
						);
					} else {
						console.log(error);
						showToast(error.error_description, error.message, "error");
					}
				} else {
					showToast(
						"Account wurde erstellt.",
						"Verifiziere bitte deine Email Adresse, um dich einzuloggen.",
						"success"
					);
					setSwitchTo("login");
				}
			} catch (error) {
				console.log(error);
				setIsLoading(false);
			}
		} else {
			setWasUsernameInputFocused(true);
			setWasEmailInputFocused(true);
			setWasPasswordInputFocused(true);
		}
	};

	return (
		<React.Fragment>
			<Heading fontSize={"4xl"} textAlign={"center"}>
				Registrieren
			</Heading>
			<Box
				rounded={"lg"}
				bg={colors.whitegray700}
				boxShadow={"lg"}
				p={8}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						handleSignUp();
					}
				}}
			>
				<Stack spacing={4}>
					<FormControl
						id="userName"
						isRequired
						isInvalid={!isUsernameValid && wasUsernameInputFocused}
					>
						<FormLabel>Benutzername</FormLabel>
						<Input
							type="text"
							value={username}
							onChange={handleUsernameInput}
							onFocus={handleUsernameOnFocus}
							focusBorderColor={
								!isUsernameValid && wasUsernameInputFocused
									? colors.red500red300
									: colors.blue500blue300
							}
							errorBorderColor={colors.red500red300}
						/>
						<FormHelperText
							color={
								!isUsernameValid && wasUsernameInputFocused
									? colors.red500red300
									: colors.gray500gray300
							}
						>
							Benutzername muss mindestens 3 Zeichen umfassen.
						</FormHelperText>
					</FormControl>
					<FormControl
						id="email"
						isRequired
						isInvalid={!isEmailValid && wasEmailInputFocused}
					>
						<FormLabel>Email Adresse</FormLabel>
						<Input
							type="email"
							value={email}
							onChange={handleEmailInput}
							onFocus={handleEmailOnFocus}
							focusBorderColor={
								!isEmailValid && wasEmailInputFocused
									? colors.red500red300
									: colors.blue500blue300
							}
							errorBorderColor={colors.red500red300}
						/>
						<FormHelperText
							color={
								!isEmailValid && wasEmailInputFocused
									? colors.red500red300
									: colors.gray500gray300
							}
						>
							Email Adresse muss auf djibinho.com enden.
						</FormHelperText>
					</FormControl>
					<FormControl
						id="password"
						isRequired
						isInvalid={!isPasswordValid && wasPassworInputFocused}
					>
						<FormLabel>Passwort</FormLabel>
						<InputGroup>
							<Input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={handlePasswordInput}
								onFocus={handlePasswordOnFocus}
								focusBorderColor={
									!isPasswordValid && wasPassworInputFocused
										? colors.red500red300
										: colors.blue500blue300
								}
								errorBorderColor={colors.red500red300}
							/>
							<InputRightElement h={"full"}>
								<Button
									variant={"ghost"}
									_focus={{
										boxShadow: colors.transparent,
									}}
									onClick={() =>
										setShowPassword((showPassword) => !showPassword)
									}
								>
									{showPassword ? <ViewIcon /> : <ViewOffIcon />}
								</Button>
							</InputRightElement>
						</InputGroup>
						<FormHelperText color={colors.gray500gray300}>
							<Text mb={1}>Passwort Anforderungen:</Text>
						</FormHelperText>
						<FormHelperText>
							<Stack spacing={0}>
								<Text
									color={
										wasPassworInputFocused
											? minOneLetterUppercase
												? colors.green500green200
												: colors.red500red300
											: colors.gray500gray300
									}
								>
									- min. ein Großbuchstabe
								</Text>
								<Text
									color={
										wasPassworInputFocused
											? minOneLetterLowercase
												? colors.green500green200
												: colors.red500red300
											: colors.gray500gray300
									}
								>
									- min. ein Kleinbuchstabe
								</Text>
								<Text
									color={
										wasPassworInputFocused
											? minOneLetterDigit
												? colors.green500green200
												: colors.red500red300
											: colors.gray500gray300
									}
								>
									- min. eine Ziffer
								</Text>
								<Text
									color={
										wasPassworInputFocused
											? minEightLetters
												? colors.green500green200
												: colors.red500red300
											: colors.gray500gray300
									}
								>
									- min. 8 Zeichen lang
								</Text>
							</Stack>
							<FormHelperText color={colors.gray500gray300}>
								<Text>Hinweis: Umlaute sind nicht erlaubt.</Text>
							</FormHelperText>
						</FormHelperText>
					</FormControl>
				</Stack>
				<Button
					bg={colors.blue400}
					color={colors.white}
					_hover={{
						bg: colors.blue500,
					}}
					_active={{
						bg: colors.blue600,
					}}
					_focus={{
						boxShadow: colors.transparent,
					}}
					width={"100%"}
					mt={8}
					mb={6}
					isLoading={isLoading}
					spinner={<BeatLoader size={8} color={colors.white} />}
					onClick={handleSignUp}
				>
					Registrieren
				</Button>
				<Box textAlign={"start"}>
					<Text>Schon einen Account?</Text>
					<Link
						color={colors.blue400}
						onClick={() => {
							setSwitchTo("login");
						}}
					>
						Jetzt einloggen
					</Link>
				</Box>
			</Box>
		</React.Fragment>
	);
}
