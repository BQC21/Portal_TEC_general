"use client";

import { useState } from "react";

import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { Button2EditProps } from "@/lib/types/components/General/buttons";

export default function Button2Edit({ title, label, children }: Button2EditProps) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={
					label
						? "inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						: "table-icon-button text-brand-500"
				}
				title={title}
				aria-label={title}
			>
				<EditIcon />
				{label ? <span>{label}</span> : null}
			</button>

			{open ? children(close) : null}
		</>
	);
}
