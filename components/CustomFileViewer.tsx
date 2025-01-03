import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const CustomFileViewer = ({
  preUrl,
  fileName,
}: {
  preUrl: string;
  fileName: string;
}) => {
  const docs = [
    {
      uri: preUrl,
      fileName,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "60vh",
        width: "60vw",
        overflow: "hidden",
      }}
    >
      {/* Render DocViewer */}
      <DocViewer
        prefetchMethod="GET"
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default CustomFileViewer;
