"use client";

import { useState } from "react";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { Button2DeleteProps } from "@/lib/types/components/General/buttons";

export function Button2Delete({ title, children }: Button2DeleteProps) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="table-icon-button text-brand-500"
				title={title}
				aria-label={title}
			>
				<TrashIcon />
			</button>

			{open ? children(close) : null}
		</>
	);
}
