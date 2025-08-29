"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { fetchRepairs } from "@/utils/api";

export default function RepairsPage() {
  const { role } = useAuthStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["repairs"],
    queryFn: fetchRepairs,
  });

  if (isLoading) return <p>Loading repairs...</p>;
  if (error) return <p>Error loading repairs</p>;

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-lg font-bold mb-4">Repairs</h1>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-3 py-2 text-left">Product</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Created By</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Total Cost</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((repair) => (
            <tr key={repair._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2">
                {repair.productName } {repair.productId}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {repair.createdBy?.name}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                ${repair.totalRepairCost}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {new Date(repair.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center space-x-3">
                <Link
                  href={`/repairs/${repair._id}`}
                  className="text-blue-500 hover:underline"
                >
                  View
                </Link>
                {role === "admin" && (
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
