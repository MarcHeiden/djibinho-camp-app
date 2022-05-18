import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BoxWrapper from "./BoxWrapper.js";
import Header from "./Header.js";
import Body from "./Body.js";
import AddButton from "./AddButton.js";
import FetchSpinner from "./FetchSpinner";
import ReportStat from "./ReportStat";

export default function Reports({
	colors,
	session,
	colorMode,
	toggleColorMode,
	showToast,
	setSwitchTo,
	params,
}) {
	const [reports, setReports] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSwitchToPlayers = () => {
		setSwitchTo({
			component: "Players",
			campID: params.campID,
			groupID: params.groupID,
		});
	};

	function handleAddReport(
		onClose,
		reportNameToAdd,
		setReportNameToAdd,
		setAddModalIsLoading
	) {
		return async function innerFunc() {
			try {
				setAddModalIsLoading(true);
				const { error } = await supabase.from("reports").insert([
					{
						name: reportNameToAdd,
						player_id: params.playerID,
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
				setReportNameToAdd("");
			}
		};
	}

	function handleDeleteReport(
		onClose,
		reportIDToDelete,
		setDeleteModalIsLoading
	) {
		return async function innerFunc() {
			try {
				setDeleteModalIsLoading(true);
				const { error } = await supabase
					.from("reports")
					.delete()
					.eq("report_id", reportIDToDelete);
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

	function handleUpdateReport(
		onClose,
		reportID,
		newReportName,
		newNote,
		newScoreBefore,
		newScoreAfter,
		setEditReportModalIsLoading
	) {
		return async function innerFunc() {
			if (newNote === "") {
				newNote = null;
			}
			if (newScoreBefore === "") {
				newScoreBefore = null;
			}
			if (newScoreAfter === "") {
				newScoreAfter = null;
			}
			try {
				setEditReportModalIsLoading(true);
				const { error } = await supabase
					.from("reports")
					.update({
						name: newReportName,
						note: newNote,
						score_before: newScoreBefore,
						score_after: newScoreAfter,
						time: "NOW()",
					})
					.eq("report_id", reportID);
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
				setEditReportModalIsLoading(false);
			}
		};
	}

	const fetchReports = async () => {
		setIsLoading(true);
		try {
			let { data, error } = await supabase
				.from("reports")
				.select(
					"report_id, name, note, score_before, score_after, created_by ,trainers!reports_created_by_fkey(name)"
				)
				.eq("player_id", params.playerID)
				.order("time", { ascending: false });
			if (error) {
				console.log(error);
				showToast(error.error_description, error.message, "error");
			} else {
				setReports(data);
			}
		} catch (error) {
			console.log(error);
			showToast(error.error_description, error.message, "error");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchReports();
		return setReports([]);
	}, [session.user.id]);

	useEffect(() => {
		const reportsSubscription = supabase
			.from("reports")
			.on("*", (payload) => {
				if (
					payload.eventType === "DELETE" ||
					(payload.eventType === "INSERT" &&
						payload.new.player_id === params.playerID) ||
					(payload.eventType === "UPDATE" &&
						payload.new.player_id === params.playerID)
				) {
					fetchReports();
				}
			})
			.subscribe();
		return () => {
			reportsSubscription.unsubscribe();
		};
	}, []);

	return (
		<BoxWrapper pyPadding={"120px"} colors={colors}>
			<Header
				colors={colors}
				session={session}
				colorMode={colorMode}
				toggleColorMode={toggleColorMode}
				showToast={showToast}
				heading={params.playerName}
				isBackButtonHidden={false}
				handleSwitchTo={handleSwitchToPlayers}
				isEditButtonHidden={true}
			/>
			<Body>
				{isLoading ? (
					<FetchSpinner colors={colors} />
				) : (
					reports.map((report) => (
						<ReportStat
							colors={colors}
							session={session}
							name={report.name}
							note={report.note}
							scoreBefore={report.score_before}
							scoreAfter={report.score_after}
							createdByName={report.trainers.name}
							createdByID={report.created_by}
							id={report.report_id}
							key={report.report_id}
							modalHandleUpdate={handleUpdateReport}
							modalHandleDelete={handleDeleteReport}
						/>
					))
				)}
				<AddButton
					colors={colors}
					modalHeading="Neuen Spielerreport erstellen"
					modalPlaceholder="Report Name"
					modalHandleAdd={handleAddReport}
				/>
			</Body>
		</BoxWrapper>
	);
}
