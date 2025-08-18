"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { base_url, fetchURL } from "../dataPanel";

export const useAllItemGroup = () => {
  return useQuery({
    queryKey: ["itemGroup"], // unique cache key
    queryFn: async () => {
      const res = await axios.get(`${fetchURL}/getall`, {
        params: {
          erp_url: base_url,
          doctype_name: "Item Group",
        },
      });

      // filter only groups shown in website
      const filteredGroups = res.data.data.filter(
        (group) => group.show_in_website === 1
      );

      return filteredGroups;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
  });
};
