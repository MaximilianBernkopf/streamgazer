"use client";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import React from "react";

interface ExcalidrawWrapperProps {
    initialData?: ExcalidrawInitialDataState
}

const ExcalidrawWrapper: React.FC<ExcalidrawWrapperProps> = ({ initialData }) => {
    return (
        <div style={{ height: '100vh' }}>
            <Excalidraw initialData={initialData} />
        </div>
    );
};

export default ExcalidrawWrapper;
