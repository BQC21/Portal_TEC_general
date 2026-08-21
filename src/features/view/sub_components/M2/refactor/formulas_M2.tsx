"use client";

import katex from "katex";
import "katex/dist/katex.min.css";
import { FormulaItem } from "@/lib/types/components/General/formulas";
import {
    ARRAY_FORMULAS,
    ENERGY_FORMULAS,
    PROTECTION_FORMULAS,
} from "@/lib/utils/helpers/formulas/formulaContent";
import { CollapsibleTableSection } from "@/features/view/components/Shells/CollapsibleTableSection";

function renderLatex(tex: string, displayMode: boolean) {
    return katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
        output: "html",
        strict: "ignore",
    });
}

function renderMixedText(text: string) {
    return text
        .split(/(\$[^$]+\$)/g)
        .map((part) => {
            if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
                return renderLatex(part.slice(1, -1), false);
            }

            return part
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        })
        .join("");
}

function PaperEquation({ tex, number }: { tex: string; number: number }) {
    const html = renderLatex(`${tex} \\tag{${number}}`, true);

    return (
        <div
            className="overflow-x-auto py-1 text-[1.15rem] leading-relaxed text-slate-900 [&_.katex-display]:my-3"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

function PaperNote({ text }: { text: string }) {
    return (
        <p
            className="mt-1 text-justify text-[0.98rem] leading-7 text-slate-700 [&_.katex]:text-[0.98rem]"
            dangerouslySetInnerHTML={{ __html: renderMixedText(text) }}
        />
    );
}

function FormulaGroup({
    title,
    items,
    startNumber,
}: {
    title: string;
    items: FormulaItem[];
    startNumber: number;
}) {
    return (
        <section className="space-y-6">
            {/* <h3 className="border-b border-slate-300 pb-2 text-center text-xl font-semibold tracking-tight text-slate-900">
                {title}
            </h3> */}
            <div className="space-y-7">
                {items.map((item, index) => (
                    <article key={item.id} className="px-1">
                        <h4 className="text-[1.02rem] font-semibold italic text-slate-800">
                            {item.name}.
                        </h4>
                        <PaperEquation tex={item.formula} number={startNumber + index} />
                        <PaperNote text={item.description} />
                    </article>
                ))}
            </div>
        </section>
    );
}

export function Formulas_M2() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-3 py-5 sm:px-6 lg:px-8">
            <div className="rounded-sm border border-slate-300 bg-[#fbf8f1] px-6 py-8 shadow-sm sm:px-10">
                <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-slate-900">
                    Fórmulas de cálculo
                </h2>
                <div className="mx-auto flex max-w-3xl flex-col gap-10 font-serif">
                    <CollapsibleTableSection title="Requerimientos energéticos">
                        <FormulaGroup
                            title="Requerimientos energéticos"
                            items={ENERGY_FORMULAS}
                            startNumber={1}
                        />
                    </CollapsibleTableSection>
                    <CollapsibleTableSection title="Campo fotovoltaico">
                        <FormulaGroup
                            title="Campo fotovoltaico"
                            items={ARRAY_FORMULAS}
                            startNumber={ENERGY_FORMULAS.length + 1}
                        />
                    </CollapsibleTableSection>
                    <CollapsibleTableSection title="Protecciones eléctricas">
                        <FormulaGroup
                            title="Protecciones eléctricas"
                            items={PROTECTION_FORMULAS}
                            startNumber={ENERGY_FORMULAS.length + ARRAY_FORMULAS.length + 1}
                        />
                    </CollapsibleTableSection>
                </div>
            </div>
        </div>
    );
}
