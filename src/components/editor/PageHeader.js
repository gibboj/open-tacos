import React from "react";
import { navigate } from "gatsby";

const PageHeader = ({ onSubmit, editType, submitting, children }) => {
  return (
    <div className="flex justify-between mb-8">
      <div className="">
        <div className="text-lg font-bold">
          Edit {editType !== "unknown" ? editType : ""}
        </div>
        {children}
      </div>
      <div className="flex flex-col items-end justify-between gap-2">
        <div>&nbsp;{/*future buttons, submenu*/}</div>
        <div>
          <button
            className="btn btn-text mr-4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary disabled:opacity-30"
            disabled={submitting}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
