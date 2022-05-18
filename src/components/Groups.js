import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BoxWrapper from "./BoxWrapper.js";
import Header from "./Header.js";
import Body from "./Body.js";
import AddButton from "./AddButton.js";
import ListItem from "./ListItem.js";
import EditListItem from "./EditListItem.js";
import FetchSpinner from "./FetchSpinner";

export default function Groups({
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
	const [groups, setGroups] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSwitchToCamps = () => {
		setSwitchTo({
			component: "Camps",
		});
	};

	function handleSwitchToPlayers(groupID, _groupName) {
		return function innerFunc() {
			setSwitchTo({
				component: "Players",
				campID: params.campID,
				groupID: groupID,
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

	function handleAddGroup(
		onClose,
		groupNameToAdd,
		setGroupNameToAdd,
		setAddModalIsLoading
	) {
		return async function innerFunc() {
			try {
				setAddModalIsLoading(true);
				const { error } = await supabase.from("groups").insert([
					{
						name: groupNameToAdd,
						camp_id: params.campID,
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
				setGroupNameToAdd("");
			}
		};
	}

	function handleDeleteGroup(
		onClose,
		groupIDToDelete,
		setDeleteModalIsLoading
	) {
		return async function innerFunc() {
			try {
				setDeleteModalIsLoading(true);
				const { error } = await supabase
					.from("groups")
					.delete()
					.eq("group_id", groupIDToDelete);
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

	async function handleUpdateGroup(groupID, newGroupName) {
		try {
			const { error } = await supabase
				.from("groups")
				.update({ name: newGroupName, time: "NOW()" })
				.eq("group_id", groupID);
			if (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			}
		} catch (error) {
			console.log(error);
			showToast(error.error_description, error.message, "error");
		}
	}

	const fetchGroups = async () => {
		setIsLoading(true);
		try {
			let { data, error } = await supabase
				.from("groups")
				.select(
					"group_id, name, created_by ,trainers!groups_created_by_fkey(name)"
				)
				.eq("camp_id", params.campID)
				.order("time", { ascending: false });
			if (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			} else {
				setGroups(data);
			}
		} catch (error) {
			console.log(error);
			showToast(error.error_description, error.message, "error");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchGroups();
		return setGroups([]);
	}, [session.user.id]);

	useEffect(() => {
		const groupsSubscription = supabase
			.from("groups")
			.on("*", (payload) => {
				if (
					payload.eventType === "DELETE" ||
					(payload.eventType === "INSERT" &&
						payload.new.camp_id === params.campID) ||
					(payload.eventType === "UPDATE" &&
						payload.new.camp_id === params.campID)
				) {
					fetchGroups();
				}
			})
			.subscribe();
		return () => {
			groupsSubscription.unsubscribe();
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
				heading="Gruppen"
				handleEditMode={handleEditMode}
				isBackButtonHidden={false}
				handleSwitchTo={handleSwitchToCamps}
				isEditButtonHidden={false}
			/>
			<Body>
				{showEditMode ? (
					<>
						{isLoading ? (
							<FetchSpinner colors={colors} />
						) : (
							groups.map((group) => (
								<EditListItem
									colors={colors}
									session={session}
									key={group.group_id}
									name={group.name}
									createdByName={group.trainers.name}
									createdByID={group.created_by}
									modalHeading="Gruppe löschen"
									modalFormLabel="Achtung: Löschen kann nicht rückgängig gemacht werden!"
									modalText="Um die Gruppe mit allen Spielern und
						Spielerprofilen zu löschen bitte den Namen der Gruppe eingeben: "
									modalHandleDelete={handleDeleteGroup}
									handleEdit={handleUpdateGroup}
									id={group.group_id}
								/>
							))
						)}
					</>
				) : (
					<>
						{isLoading ? (
							<FetchSpinner colors={colors} />
						) : (
							groups.map((group) => (
								<ListItem
									colors={colors}
									name={group.name}
									createdBy={group.trainers.name}
									key={group.group_id}
									handleSwitchTo={handleSwitchToPlayers}
									id={group.group_id}
								/>
							))
						)}
						<AddButton
							colors={colors}
							modalHeading="Neue Gruppe erstellen"
							modalPlaceholder="Gruppen Name"
							modalHandleAdd={handleAddGroup}
						/>
					</>
				)}
			</Body>
		</BoxWrapper>
	);
}
