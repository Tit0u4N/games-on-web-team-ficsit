import React from "react";

interface Props {
    value: number;
}

export const View: React.FC<Props> = ({ value }) => {
    return <div>{value}</div>;
}