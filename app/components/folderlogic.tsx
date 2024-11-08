import React from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";

interface FolderItemProps {
  folder: {
    id: string;
    title: string;
  };
  isSelected: boolean;
  isMultiSelect: boolean;
  onSelect: (folderId: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  isSelected,
  isMultiSelect,
  onSelect,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isMultiSelect) {
      onSelect(folder.id);
    } else {
      navigate(`/viewfolder/${encodeURIComponent(folder.id)}`, {
        state: { folder },
      });
    }
  };

  return (
    <div
      key={folder.id}
      className={`folder-item ${isSelected ? "selected-folder" : ""}`}
      onClick={handleClick}
    >
      <FolderOpenOutlined style={{ color: "steelblue", fontSize: "1.5rem" }} />
      <br />
      <span className="folder-title">{folder.title}</span>
    </div>
  );
};

export default FolderItem;