import React from "react";
import PropTypes from "prop-types";
import FolderIcon from "react-material-icons/icons/file/folder";
import FolderOpenIcon from "react-material-icons/icons/file/folder-open";
import Typography from "material-ui/Typography";

const SubFolders = ({ folders, deep, selectedId, onSelect }) => {
  if (!folders || folders.length === 0) {
    return null;
  }

  return (
    <div className="children">
      {folders.map((folder, idx) => (
        <Folder
          key={idx}
          folder={folder}
          deep={deep}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

class Folder extends React.Component {
  onClick = id => {
    this.props.onSelect(id);
  };

  render() {
    const { folder, deep, selectedId, onSelect } = this.props;

    var className = "folderItem";
    if (folder._id === selectedId) {
      className += " selected";
    }

    return (
      <div className="folder" style={{ marginLeft: 10 * deep }}>
        <div className={className} onClick={() => this.onClick(folder._id)}>
          {folder._id === selectedId ? <FolderOpenIcon /> : <FolderIcon />}
          <Typography
            variant="subheading"
            color={folder._id === selectedId ? "primary" : "textSecondary"}
            style={{marginLeft: "3px"}}
          >
            {folder.name}
          </Typography>
        </div>
        <SubFolders
          folders={folder.children}
          deep={deep + 1}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    );
  }
}

Folder.propTypes = {
  folder: PropTypes.object.isRequired,
  deep: PropTypes.number,
  selectedId: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired
};

Folder.defaultProps = {
  deep: 0
};

export default Folder;
