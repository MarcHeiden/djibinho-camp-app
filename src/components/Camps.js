import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BoxWrapper from "./BoxWrapper.js";
import Header from "./Header.js";
import Body from "./Body.js";
import AddButton from "./AddButton.js";
import ListItem from "./ListItem.js";
import EditListItem from "./EditListItem.js";
import FetchSpinner from "./FetchSpinner";

export default function Camps({
	colors,
	session,
	colorMode,
	toggleColorMode,
	showToast,
	setSwitchTo,
}) {
	const [showEditMode, setShowEditMode] = useState(false);
	const [pyPadding, setPyPadding] = useState("120px");
	const [camps, setCamps] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	function handleSwitchToGroup(campID, _campName) {
		return function innerFunc() {
			setSwitchTo({
				component: "Groups",
				campID: campID,
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

	function handleAddCamp(
		onClose,
		campNameToAdd,
		setCampNameToAdd,
		setAddModalIsLoading
	) {
		return async function innerFunc() {
			try {
				setAddModalIsLoading(true);
				const { error } = await supabase
					.from("camps")
					.insert([{ name: campNameToAdd, created_by: session.user.id }]);
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
				setCampNameToAdd("");
			}
		};
	}

	function handleDeleteCamp(onClose, campIDToDelete, setDeleteModalIsLoading) {
		return async function innerFunc() {
			try {
				setDeleteModalIsLoading(true);
				const { error } = await supabase
					.from("camps")
					.delete()
					.eq("camp_id", campIDToDelete);
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

	async function handleUpdateCamp(campID, newCampName) {
		try {
			const { error } = await supabase
				.from("camps")
				.update({ name: newCampName, time: "NOW()" })
				.eq("camp_id", campID);
			if (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			}
		} catch (error) {
			console.log(error);
			showToast(error.error_description, error.message, "error");
		}
	}

	const fetchCamps = async () => {
		setIsLoading(true);
		try {
			let { data, error } = await supabase
				.from("camps")
				.select(
					"camp_id, name, created_by ,trainers!camps_created_by_fkey(name)"
				)
				.order("time", { ascending: false });
			if (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			} else {
				setCamps(data);
			}
		} catch (error) {
			console.log(error);
			showToast(error.error_description, error.message, "error");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCamps();
		return setCamps([]);
	}, [session.user.id]);

	useEffect(() => {
		const campsSubscription = supabase
			.from("camps")
			.on("*", (payload) => {
				fetchCamps();
			})
			.subscribe();
		return () => {
			campsSubscription.unsubscribe();
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
				heading="Camps"
				handleEditMode={handleEditMode}
				isBackButtonHidden={true}
				isEditButtonHidden={false}
			/>
			<Body>
				{showEditMode ? (
					<>
						{isLoading ? (
							<FetchSpinner colors={colors} />
						) : (
							camps.map((camp) => (
								<EditListItem
									colors={colors}
									session={session}
									key={camp.camp_id}
									name={camp.name}
									createdByName={camp.trainers.name}
									createdByID={camp.created_by}
									id={camp.camp_id}
									modalHeading="Camp löschen"
									modalFormLabel="Achtung: Löschen kann nicht rückgängig gemacht werden!"
									modalText="Um das Camp mit allen zugehörigen Gruppen, Spielern und
						Spielerprofilen zu löschen bitte den Namen des Camps eingeben: "
									modalHandleDelete={handleDeleteCamp}
									handleEdit={handleUpdateCamp}
								/>
							))
						)}
					</>
				) : (
					<>
						{isLoading ? (
							<FetchSpinner colors={colors} />
						) : (
							camps.map((camp) => (
								<ListItem
									colors={colors}
									name={camp.name}
									createdBy={camp.trainers.name}
									key={camp.camp_id}
									handleSwitchTo={handleSwitchToGroup}
									id={camp.camp_id}
								/>
							))
						)}
						<AddButton
							colors={colors}
							modalHeading="Neues Camp erstellen"
							modalPlaceholder="Camp Name"
							modalHandleAdd={handleAddCamp}
						/>
					</>
				)}
			</Body>
		</BoxWrapper>
	);
}
