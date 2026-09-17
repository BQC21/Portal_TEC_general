"use client";

import { useState } from "react";

import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import { Button2AddProps } from "@/lib/types/components/General/buttons";

export default function Button2Add({ label, children }: Button2AddProps) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<div>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			>
				<PlusIcon />
				<span>{label}</span>
			</button>

			{open ? children(close) : null}
		</div>
	);
}
