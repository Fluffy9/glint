import Link from "next/link";
import { Fragment } from "react";
import { fill, type CopyVars } from "@/content";

export type CopyPart = string | { href: string; label: string };

export function RichCopy({
  parts,
  vars,
}: {
  parts: readonly CopyPart[];
  vars?: Partial<CopyVars>;
}) {
  return parts.map((part, index) => {
    if (typeof part === "string") {
      return <Fragment key={index}>{fill(part, vars)}</Fragment>;
    }
    const href = fill(part.href, vars);
    if (href.startsWith("/")) {
      return (
        <Link key={index} href={href}>
          {fill(part.label, vars)}
        </Link>
      );
    }
    return (
      <a key={index} href={href}>
        {fill(part.label, vars)}
      </a>
    );
  });
}

export function ProseBlocks({
  blocks,
  vars,
}: {
  blocks: readonly ({ h: string } | { p: string | readonly CopyPart[] })[];
  vars?: Partial<CopyVars>;
}) {
  return blocks.map((block, index) => {
    if ("h" in block) return <h2 key={index}>{fill(block.h, vars)}</h2>;
    if (typeof block.p === "string") return <p key={index}>{fill(block.p, vars)}</p>;
    return (
      <p key={index}>
        <RichCopy parts={block.p} vars={vars} />
      </p>
    );
  });
}
