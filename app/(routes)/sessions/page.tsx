"use client"

import { useStore } from "@/hooks/useStore"

import ClientSessionsPage from "@/components/ClientSession";
import ExpertSessionsPage from "@/components/ExpertSessions";

export default function Sessions() {
  const {role, setRole} = useStore();

  return(role == "client" ? <ClientSessionsPage/> : <ExpertSessionsPage/> )

}