import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BoxWrapper from "./BoxWrapper.js";
import Header from "./Header.js";
import Body from "./Body.js";
import AddButton from "./AddButton.js";
import ListItem from "./ListItem.js";
import EditListItem from "./EditListItem.js";
import FetchSpinner from "./FetchSpinner";

export default function Players({
	colors,
	session,
	colorMode,
	toggleColorMode,
	showToast,
	setSwitchTo,
	params,
}) {
	const [showEditMode, setShowEditMode] = useState(false);
	const [pyPadding, setPyPadding] = useState("120px");
	const [players, setPlayers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSwitchToGroups = () => {
		setSwitchTo({
			component: "Groups",
			campID: params.campID,
		});
	};

	function handleSwitchToReports(playerID, playerName) {
		return function innerFunc() {
			setSwitchTo({
				component: "Reports",
				playerID: playerID,
				groupID: params.groupID,
				campID: params.campID,
				playerName: playerName,
			});
		};
	}

	const handleEditMode = () => {
		if (!showEditMode) {
			setShowEditMode(true);
			setPyPadding("60px");
		} else {
			setShowEditMode(false);
			setPyPadding("120px");
		}
	};

	function handleAddPlayer(
		onClose,
		playerNameToAdd,
		setPlayerNameToAdd,
		setAddModalIsLoading
	) {
		return async function innerFunc() {
			try {
				setAddModalIsLoading(true);
				const { error } = await supabase.from("players").insert([
					{
						name: playerNameToAdd,
						camp_id: params.campID,
						group_id: params.groupID,
						created_by: session.user.id,
					},
				]);
				if (error) {
					console.log(error);
					showToast(error.error_description, error.message, "error");
				} else {
					onClose();
				}
			} catch (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			} finally {
				setAddModalIsLoading(false);
				setPlayerNameToAdd("");
			}
		};
	}

	function handleDeletePlayer(
		onClose,
		playerIDToDelete,
		setDeleteModalIsLoading
	) {
		return async function innerFunc() {
			try {
				setDeleteModalIsLoading(true);
				const { error } = await supabase
					.from("players")
					.delete()
					.eq("player_id", playerIDToDelete);
				if (error) {
					console.log(error);
					showToast(error.error_description, error.message, "error");
				} else {
					onClose();
				}
			} catch (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			} finally {
				setDeleteModalIsLoading(false);
			}
		};
	}

	async function handleUpdatePlayer(playerID, newPlayerName) {
		try {
			const { error } = await supabase
				.from("players")
				.update({ name: newPlayerName, time: "NOW()" })
				.eq("player_id", playerID);
			if (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			}
		} catch (error) {
			console.log(error);
			showToast(error.error_description, error.message, "error");
		}
	}

	const fetchPlayers = async () => {
		setIsLoading(true);
		try {
			let { data, error } = await supabase
				.from("players")
				.select(
					"player_id, name, created_by ,trainers!players_created_by_fkey(name)"
				)
				.eq("group_id", params.groupID)
				.order("time", { ascending: false });
			if (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			} else {
				setPlayers(data);
			}
		} catch (error) {
			console.log(error);
			showToast(error.error_description, error.message, "error");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPlayers();
		return setPlayers([]);
	}, [session.user.id]);

	useEffect(() => {
		const playersSubscription = supabase
			.from("players")
			.on("*", (payload) => {
				if (
					payload.eventType === "DELETE" ||
					(payload.eventType === "INSERT" &&
						payload.new.group_id === params.groupID) ||
					(payload.eventType === "UPDATE" &&
						payload.new.group_id === params.groupID)
				) {
					fetchPlayers();
				}
			})
			.subscribe();
		return () => {
			playersSubscription.unsubscribe();
		};
	}, []);

	return (
		<BoxWrapper pyPadding={pyPadding} colors={colors}>
			<Header
				colors={colors}
				session={session}
				colorMode={colorMode}
				toggleColorMode={toggleColorMode}
				showToast={showToast}
				heading="Spieler"
				handleEditMode={handleEditMode}
				isBackButtonHidden={false}
				handleSwitchTo={handleSwitchToGroups}
				isEditButtonHidden={false}
			/>
			<Body>
				{showEditMode ? (
					<>
						{isLoading ? (
							<FetchSpinner colors={colors} />
						) : (
							players.map((player) => (
								<EditListItem
									colors={colors}
									session={session}
									key={player.player_id}
									name={player.name}
									createdByName={player.trainers.name}
									createdByID={player.created_by}
									modalHeading="Spieler löschen"
									modalFormLabel="Achtung: Löschen kann nicht rückgängig gemacht werden!"
									modalText="Um den Spieler mit seinem Spielerprofil zu löschen bitte den Namen des Spielers eingeben: "
									modalHandleDelete={handleDeletePlayer}
									handleEdit={handleUpdatePlayer}
									id={player.player_id}
								/>
							))
						)}
					</>
				) : (
					<>
						{isLoading ? (
							<FetchSpinner colors={colors} />
						) : (
							players.map((player) => (
								<ListItem
									colors={colors}
									name={player.name}
									createdBy={player.trainers.name}
									key={player.player_id}
									handleSwitchTo={handleSwitchToReports}
									id={player.player_id}
								/>
							))
						)}
						<AddButton
							colors={colors}
							modalHeading="Neuen Spieler erstellen"
							modalPlaceholder="Spieler Name"
							modalHandleAdd={handleAddPlayer}
						/>
					</>
				)}
			</Body>
		</BoxWrapper>
	);
}
