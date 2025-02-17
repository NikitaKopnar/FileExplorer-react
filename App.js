import "./App.css";
import json from "./data.json";
import { useState } from "react";

// Render list of objects - recursive call of list
const List = ({ list, addNodeToFolder, deleteNodeFromList }) => {
  const [isExpanded, setIsExpanded] = useState({});
  return (
    <div className="container">
      {list.map((node) => (
        <div key={node.id}>
          {node.isFolder && (
            <span onClick={() => addNodeToFolder(node.id)}>
              <img src="/3979527.png" className="icon" alt="deletefile" />
            </span>
          )}
          <span onClick={() => deleteNodeFromList(node.id)}>
            <img src="/1214428.png" className="icon" alt="addfile" />
          </span>
          {node.isFolder && (
            <span
              onClick={() =>
                setIsExpanded((prev) => ({
                  ...prev,
                  [node.name]: !prev[node.name],
                }))
              }
            >
              {isExpanded?.[node.name] ? "-" : "+"}
            </span>
          )}
          <span>{node.name}</span>
          {isExpanded?.[node.name] && node?.children && (
            <List
              list={node.children}
              addNodeToFolder={addNodeToFolder}
              deleteNodeFromList={deleteNodeFromList}
            />
          )}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [data, setData] = useState(json);

  const addNodeToFolder = (parentId) => {
    const name = prompt("Enter folder name");
    const updateTree = (list) => {
      return list.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              {
                id: Date.now().toString(),
                name: name,
                isFolder: true,
                children: [],
              },
            ],
          };
        } else if (node.children) {
          return {
            ...node,
            children: updateTree(node.children),
          };
        } else {
          return node;
        }
      });
    };
    setData((prev) => updateTree(prev));
  };

  const deleteNodeFromList = (itemId) => {
    const updateTree = (list) => {
      return list
        .filter((node) => node.id !== itemId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });
    };
    setData((prev) => updateTree(prev));
  };
  return (
    <div className="App">
      <h1>Folder and File Explorer</h1>
      <List
        list={data}
        addNodeToFolder={addNodeToFolder}
        deleteNodeFromList={deleteNodeFromList}
      />
    </div>
  );
}

export default App;
