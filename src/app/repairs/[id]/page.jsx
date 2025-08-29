"use client";
import { fetchRepairById } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SingleRepairPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["repair", id],
    queryFn: () => fetchRepairById(id),
    enabled: !!id, // only runs when id exists
  });

  if (isLoading) return <p className="text-center mt-10">Loading repair...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading repair</p>;
  if (!data || !data.data) return <p className="text-center mt-10">No repair found</p>;

  const repair = data.data;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <div className="flex item-center justify-center">

      <h1 className="text-xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Repair Details
      </h1>
      </div>

      {/* Flex container for responsive layout */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
        
        {/* Left side - Product info */}
        <div className="flex-1 space-y-3 text-sm md:text-lg">
          <p>
            <span className="font-semibold">Product:</span> {repair.productName}
          </p>
          <p>
            <span className="font-semibold">Total Repair Cost:</span> ${repair.totalRepairCost}
          </p>
          <p>
            <span className="font-semibold">Created By:</span> {repair.createdBy?.name}
          </p>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(repair.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(repair.updatedAt).toLocaleString()}
          </p>
        </div>

        {/* Right side - Image */}
        {repair.image && (
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src={repair.image}
              alt={repair.productName}
              className="w-full max-w-sm md:max-w-md object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Repair Items */}
      <div className="mt-8">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Repair Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {repair.repairItems?.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{item.description}</td>
                  <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                    ${item.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
