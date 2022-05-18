import React, { useState, useEffect } from "react";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	Input,
	FormLabel,
	NumberInput,
	NumberInputField,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Flex,
	Stack,
	Box,
	Textarea,
} from "@chakra-ui/react";
import BeatLoader from "react-spinners/BeatLoader";

export default function EditReportModal({
	colors,
	isOpen,
	onClose,
	handleUpdate,
	params,
}) {
	const [name, setName] = useState("");
	const [note, setNote] = useState("");
	const [scoreBefore, setScoreBefore] = useState("");
	const [scoreAfter, setScoreAfter] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleNameInput = (e) => {
		setName(e.target.value);
	};

	const handleNoteInput = (e) => {
		setNote(e.target.value);
	};

	const handleScoreBeforeChange = (scoreBefore) => setScoreBefore(scoreBefore);
	const handleScoreAfterChange = (scoreAfter) => setScoreAfter(scoreAfter);

	useEffect(() => {
		if (params.note === null) {
			setNote("");
		} else {
			setNote(params.note);
		}
		if (params.scoreBefore === null) {
			setScoreBefore("");
		} else {
			setScoreBefore(params.scoreBefore);
		}
		if (params.scoreAfter === null) {
			setScoreAfter("");
		} else {
			setScoreAfter(params.scoreAfter);
		}
		setName(params.name);
	}, [params]);

	return (
		<Modal
			closeOnOverlayClick={true}
			isOpen={isOpen}
			onClose={onClose}
			size={"xs"}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Spielerreport bearbeiten</ModalHeader>
				<ModalCloseButton
					_focus={{
						boxShadow: colors.transparent,
					}}
				/>
				<ModalBody>
					<Stack spacing={2} mt={-2}>
						<Box>
							<FormLabel>Report Name</FormLabel>
							<Input
								type="text"
								value={name}
								onChange={handleNameInput}
							></Input>
						</Box>
						<Box>
							<FormLabel>Score vor Camp</FormLabel>
							<Flex>
								<Slider
									flex="1"
									focusThumbOnChange={false}
									value={scoreBefore}
									onChange={handleScoreBeforeChange}
									mr={6}
								>
									<SliderTrack>
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb fontSize="sm" boxSize="24px" />
								</Slider>
								<NumberInput
									min={0}
									max={100}
									maxW="100px"
									value={scoreBefore}
									onChange={handleScoreBeforeChange}
								>
									<NumberInputField />
								</NumberInput>
							</Flex>
						</Box>
						<Box>
							<FormLabel>Score nach Camp</FormLabel>
							<Flex>
								<Slider
									flex="1"
									focusThumbOnChange={false}
									value={scoreAfter}
									onChange={handleScoreAfterChange}
									mr={6}
								>
									<SliderTrack>
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb fontSize="sm" boxSize="24px" />
								</Slider>
								<NumberInput
									min={0}
									max={100}
									maxW="100px"
									value={scoreAfter}
									onChange={handleScoreAfterChange}
								>
									<NumberInputField />
								</NumberInput>
							</Flex>
						</Box>
						<Box>
							<FormLabel>Notizen</FormLabel>
							<Textarea value={note} onChange={handleNoteInput} />
						</Box>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<Button
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
						onClick={handleUpdate(
							onClose,
							params.id,
							name,
							note,
							scoreBefore,
							scoreAfter,
							setIsLoading
						)}
						isLoading={isLoading}
						spinner={<BeatLoader size={8} color={colors.white} />}
					>
						Speichern
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
