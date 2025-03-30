import React from "react";
import { Ellipsis } from "lucide-react";
import { Dropdown, DropdownTrigger } from "../../components/ui/Dropdown";

interface POSmachinesProps {
  posName: string;
  posDescription: string;
  storeName: string;
  cashopeining: string;
  sales: string;
  cashclosing: string;
  posColor: string;
  status: string;
}

const POSmachines = (props: POSmachinesProps) => {
  return (
    <div
      className={`${props.posColor} flex flex-col items-stretch p-4 border rounded-lg`}
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">{props.posName}</h3>
        <Ellipsis />
      </div>
      <div className=" my-4 grid grid-cols-2">
        <p className="text-sm text-gray-500 my-2">
          <strong>Description:</strong> {props.posDescription}
        </p>
        <p className="text-sm text-gray-500 my-2">
          <strong>Store:</strong> {props.storeName}
        </p>
        <p className="text-sm text-gray-500 my-2">
          <strong>Cash Opening:</strong> {props.cashopeining}
        </p>
        <p className="text-sm text-gray-500 my-2">
          <strong>Sales:</strong> {props.sales}
        </p>
        <p className="text-sm text-gray-500 my-2">
          <strong>Cash Closing:</strong> {props.cashclosing}
        </p>
        <p className="text-sm text-gray-500 my-2">
          <strong>Status:</strong> {props.status}
        </p>
      </div>
      <button className="bg-slate-900 hover:bg-slate-800 text-white w-full py-1 rounded-md">
        Go to store
      </button>
    </div>
  );
};

export default POSmachines;
