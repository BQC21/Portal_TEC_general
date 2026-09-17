import type { ReactNode } from "react";

import type { FinantialPdfPayload } from "../Python_components/FinantialPdfPayload";
import type { ReportPdfPayload } from "../Python_components/ReportPdfPayload";
import type {
	GenericMassiveCleanModalProps,
	MassiveDownloadModalProps,
	MassiveUploadModalProps,
} from "./modals";

export type ModalTriggerChildren = (close: () => void) => ReactNode;

export type Button2AddProps = {
	label: string;
	children: ModalTriggerChildren;
};

export type Button2EditProps = {
	title: string;
	label?: string;
	children: ModalTriggerChildren;
};

export type Button2DeleteProps = {
	title: string;
	children: ModalTriggerChildren;
};

export type DuplicateRowButtonProps = {
	title: string;
	onDuplicate: () => Promise<void> | void;
};

export type Button2MassiveUploadProps = Omit<MassiveUploadModalProps, "onClose">;

export type Button2MassiveCleanProps = Omit<GenericMassiveCleanModalProps, "onClose">;

export type Button2MassiveDownloadProps<T> = Omit<MassiveDownloadModalProps<T>, "onClose">;

export type Button2PDFProps = {
	disabled?: boolean;
	getPayload: () => ReportPdfPayload | FinantialPdfPayload;
};
