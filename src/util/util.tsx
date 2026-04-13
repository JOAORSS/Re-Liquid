import React from "react";

export function RemoveMaxWidth(props: { classe: string }): React.ReactNode {
  return (
    <style>
        {`.shopify-section > .${props.classe} {display: contents;}`}
    </style>
  );
}