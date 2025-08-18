// hooks/useItems.js
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"], // unique cache key
    queryFn: async () => {
      const res = await axios.get("https://icfix.com.bd/getall", {
        params: {
          erp_url: "https://demo15.ionicerp.xyz",
          doctype_name: "Item",
          fields: '["name", "item_code"]',
          sid: "3b4eca81cac4cbc6a4d58081a7f3ccf1235f199082ca3970821ddb47",
          filters: '[["name", "=", "Z9s Pro"]]',
          limit: 5,
          page: 1,
        },
      });
      return res.data.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
