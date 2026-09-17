import katex from "katex";

export function renderLatex(tex: string, displayMode: boolean) {
    return katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
        output: "html",
        strict: "ignore",
    });
}

export function renderMixedText(text: string) {
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
