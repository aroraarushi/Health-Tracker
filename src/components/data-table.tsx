import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Trash2, Pencil } from 'lucide-react';
import { HealthEntry, HealthDataTableProps } from './types.tsx';

const HealthDataTable = ({ data, handleEdit, handleDelete }: HealthDataTableProps) => {
  const [tableData, setTableData] = useState<HealthEntry[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const columns = [
    {
      name: 'Time',
      selector: (row: HealthEntry) => row.timestamp,
      sortable: true,
      id: 'timestamp',
      cell: (row: HealthEntry) => {
        const date = new Date(row.timestamp);
        return (
          <div className="text-black">
            {isNaN(date.getTime()) ? '' : date.toLocaleString()}
          </div>
        );
      },
      sortFunction: (rowA: HealthEntry, rowB: HealthEntry) => {
        const dateA = new Date(rowA.timestamp).getTime();
        const dateB = new Date(rowB.timestamp).getTime();
        return dateA - dateB;
      },
    },
    {
      name: 'Steps',
      selector: (row: HealthEntry) => row.steps ?? 0,
      sortable: true,
      cell: (row: HealthEntry) => <div className="text-black">{row.steps}</div>,
    },
    {
      name: 'Water (Liters)',
      selector: (row: HealthEntry) => row.water ?? 0,
      sortable: true,
      cell: (row: HealthEntry) => <div className="text-black">{row.water}</div>,
    },
    {
      name: 'Heart Rate (bpm)',
      selector: (row: HealthEntry) => row.heartRate ?? 0,
      sortable: true,
      cell: (row: HealthEntry) => (
        <div className="text-black">
          {row.heartRate}
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row: HealthEntry) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row)}
            className="p-1 hover:bg-gray-200 rounded"
           
          >
            <Pencil className="h-5 w-5 text-primary" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 hover:bg-gray-200 rounded"
           
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border custom-border">
      <DataTable
        columns={columns}
        data={tableData}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        defaultSortFieldId="timestamp"
        defaultSortAsc={false}
        customStyles={{
          headCells: {
            style: {
              color: 'black', 
              fontWeight: 'bold', 
              backgroundColor:'#F5F3FF'
            },
          },
          cells: {
            style: {
              color: 'black',
            },
          },
        }}
      />
    </div>
  );
};

export default HealthDataTable;

