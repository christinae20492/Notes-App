import React from "react";
import { Link } from "@remix-run/react";
import {
  PlusOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  SortAscendingOutlined,
  SyncOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

interface LayoutProps {
  children: React.ReactNode;
  setIsMultiSelect: (value: boolean) => void;
  isMultiSelect: boolean;
  setSearchBar: (value: boolean) => void;
  searchBar: boolean;
  setOpenSorter: (visible: boolean) => void;
  setShowSettings: (visible: boolean) => void;
  setRefresh: (value: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  setIsMultiSelect,
  isMultiSelect,
  setSearchBar,
  searchBar,
  setOpenSorter,
  setShowSettings,
  setRefresh,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="bg-gray-100 h-16 flex items-center justify-between p-5 shadow-sm">
        <Link to="/">
          <h1 className="font-header text-steelgrey text-3xl">Notes App</h1>
        </Link>
      </header>

      <div className="flex-grow overflow-y-auto overflow-x-hidden justify-center">
        <aside className="bg-gray-200 w-24 flex flex-col items-center pt-3 fixed top-16 left-0 h-full shadow-md">
          <Link
            to="/createnote"
            className="block p-3 scale-150 justify-center my-7"
          >
            <PlusOutlined />
            <span className="font-body text-xs text-darkgrey">New</span>
          </Link>

          <div
            className="block p-3 scale-150 justify-center my-7 cursor-pointer"
            onClick={() => {
              setIsMultiSelect(!isMultiSelect);
            }}
          >
            <CheckCircleOutlined />
            <span className="font-body text-xs text-darkgrey">
              {isMultiSelect ? "Deselect" : "Select"}
            </span>
          </div>

          <div
            className="block p-3 scale-150 justify-center my-7 cursor-pointer"
            onClick={() => {
              setSearchBar(!searchBar);
            }}
          >
            <SearchOutlined />
            <span className="font-body text-xs text-darkgrey">Search</span>
          </div>

          <Link to="/trash" className="block p-3 scale-150 justify-center my-7">
            <DeleteOutlined />
            <span className="font-body text-xs text-darkgrey">Trash</span>
          </Link>
        </aside>

        <div className="bg-gray-100 fixed top-16 left-24 h-12 w-[calc(100%-6rem)] flex items-end flex-row-reverse px-5 shadow-md">
          <div
            className="p-5 scale-160 text-darksteelgrey cursor-pointer hover:animate-ping"
            onClick={() => {
              setOpenSorter(true);
            }}
          >
            <SortAscendingOutlined />
          </div>

          <div
            className="p-5 scale-148 text-darksteelgrey cursor-pointer hover:animate-spin"
            onClick={() => {
              setShowSettings(true);
            }}
          >
            <SyncOutlined />
          </div>

          <div
            className="p-5 scale-148 text-darksteelgrey cursor-pointer hover:animate-bounce"
            onClick={() => {
              setRefresh(true);
            }}
          >
            <EllipsisOutlined />
          </div>
        </div>

        <main className="mt-8 ml-20 p-4 w-full text-lg bg-vague">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
